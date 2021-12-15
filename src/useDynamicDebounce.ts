import React from 'react';
import { useLatest } from './useLatest';

type UseDynamicDebounceCallbackConfig = {
  initialDelay: number;
  leading: boolean;
  maxHistory: number;
  minHistory: number;
};

const defaultConfig: UseDynamicDebounceCallbackConfig = {
  initialDelay: 100,
  leading: false,
  maxHistory: 10,
  minHistory: 6,
};

export function useDynamicDebounceCallback<T extends any[]>(
  callback: (...args: T) => void,
  config: Partial<UseDynamicDebounceCallbackConfig> = {}
): [
  (...args: T) => void,
  { isDebouncing: boolean; delay: number; setDelay: React.Dispatch<React.SetStateAction<number>> }
] {
  const { initialDelay, leading, minHistory, maxHistory } = { ...defaultConfig, ...config };
  const storedCallback = useLatest(callback);
  const timer = React.useRef<ReturnType<typeof setTimeout>>();
  const [isDebouncing, setIsDebouncing] = React.useState(false);
  const [timings, setTimings] = React.useState<number[]>([]);
  const [delay, setDelay] = React.useState<number>(initialDelay);

  React.useEffect(() => () => console.log('unmounting'), []);

  React.useEffect(
    () => () => {
      console.log('calling cleanup function');
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = undefined;
    },
    [leading, storedCallback]
  );

  React.useEffect(() => {
    console.log('new timings:', timings);
  }, [timings]);

  const triggerTimeout = React.useCallback(
    (...args: T) => {
      setTimings(t => [...(t.length >= maxHistory ? t.slice(1) : t), performance.now()]);
      console.log('triggering debounce with delay of', delay);
      setIsDebouncing(true);
      timer.current = setTimeout(() => {
        setIsDebouncing(false);
        storedCallback.current.apply(null, args);
      }, delay);
    },
    [delay, storedCallback]
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
      [delay, leading, triggerTimeout]
    ),
    { isDebouncing, delay, setDelay },
  ];
}
