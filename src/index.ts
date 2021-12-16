import React from 'react';
import { useLatest } from './useLatest';

type UseDynamicDebounceConfig = {
  initialDelay?: number;
  leading?: boolean;
  maxSamples?: number;
  minSamples?: number;
  minDelay?: number;
  maxDelay?: number;
  delayFunction?: (averageGap: number) => number;
};

type UseDynamicDebounceBag = {
  isDebouncing: boolean;
  delay: number;
};

const defaultConfig: Required<UseDynamicDebounceConfig> = {
  initialDelay: 100,
  leading: false,
  maxSamples: 10,
  minSamples: 6,
  minDelay: 0,
  maxDelay: Infinity,
  delayFunction: gap => Math.floor(gap),
};

function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

function calculateAverageGap(timings: number[]): number {
  if (timings.length < 2) {
    return 0;
  }

  let sum = 0;
  let prev = timings[0];
  for (let i = 1; i < timings.length; i++) {
    sum += timings[i] - prev;
    prev = timings[i];
  }

  return sum / (timings.length - 1);
}

function parseConfig(config?: UseDynamicDebounceConfig): Required<UseDynamicDebounceConfig> {
  if (!config) return defaultConfig;
  const conf = { ...defaultConfig, ...config };

  const minDelay = Math.max(conf.minDelay, 0);
  const maxDelay = Math.max(minDelay, conf.maxDelay);

  const minSamples = Math.max(conf.minSamples, 2);
  const maxSamples = Math.max(conf.maxSamples, 2);

  const initialDelay = Math.max(conf.initialDelay, 0);

  return {
    ...conf,
    minDelay,
    maxDelay,
    minSamples,
    maxSamples,
    initialDelay,
  };
}

export function useDynamicDebounceCallback<T extends any[]>(
  callback: (...args: T) => void,
  config?: UseDynamicDebounceConfig
): [(...args: T) => void, UseDynamicDebounceBag] {
  const { initialDelay, leading, minSamples, maxSamples, delayFunction, minDelay, maxDelay } =
    parseConfig(config);
  const storedCallback = useLatest(callback);
  const timer = React.useRef<ReturnType<typeof setTimeout>>();
  const [isDebouncing, setIsDebouncing] = React.useState(false);
  const samples = React.useRef<number[]>([]);
  const isMounted = React.useRef(true);
  const [delay, setDelay] = React.useState<number>(initialDelay);

  React.useEffect(
    () => () => {
      if (timer.current !== undefined) {
        clearTimeout(timer.current);
      }
      timer.current = undefined;
      isMounted.current = false;
    },
    []
  );

  const triggerTimeout = React.useCallback(
    (...args: T) => {
      const triggerTime = performance.now();
      samples.current = [
        ...(samples.current.length >= maxSamples ? samples.current.slice(1) : samples.current),
        triggerTime,
      ];
      const calculatedDelay =
        samples.current.length >= minSamples
          ? delayFunction(calculateAverageGap(samples.current))
          : initialDelay;
      const newDelay = clamp(calculatedDelay, minDelay, maxDelay);
      console.log('newDelay', newDelay, 'calc delay', calculatedDelay);
      setDelay(newDelay);
      setIsDebouncing(true);
      timer.current = setTimeout(() => {
        if (!isMounted.current) return;
        setIsDebouncing(false);
        samples.current = [];
        storedCallback.current.apply(null, args);
      }, newDelay);
    },
    [storedCallback]
  );

  return [
    React.useCallback(
      (...args: T) => {
        if (timer.current === undefined && leading) {
          triggerTimeout(...args);
        }

        if (timer.current) {
          clearTimeout(timer.current);
        }

        triggerTimeout(...args);
      },
      [leading, triggerTimeout]
    ),
    { isDebouncing, delay },
  ];
}

export function useDynamicDebounce<S = undefined>(): [
  S | undefined,
  React.Dispatch<React.SetStateAction<S | undefined>>,
  UseDynamicDebounceBag
];

export function useDynamicDebounce<S>(
  initialState: S | (() => S),
  config?: UseDynamicDebounceConfig
): [S, React.Dispatch<React.SetStateAction<S>>, UseDynamicDebounceBag];

export function useDynamicDebounce<S = undefined>(
  initialState?: S | (() => S),
  config?: UseDynamicDebounceConfig
) {
  const [state, setState] = React.useState(initialState);
  return [state, ...useDynamicDebounceCallback(setState, config)];
}
