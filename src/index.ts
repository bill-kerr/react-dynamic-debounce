import React from 'react';

type UseDynamicDebounceConfig = {
	defaultDelay?: number;
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
	defaultDelay: 275,
	maxSamples: 10,
	minSamples: 6,
	minDelay: 0,
	maxDelay: 825,
	delayFunction: (gap) => Math.floor(gap),
};

function clamp(num: number, min: number, max: number): number {
	return Math.min(Math.max(num, min), max);
}

function calculateAverageGap(timings: number[]): number {
	if (timings.length < 2) {
		return 0;
	}

	let sum = 0;
	let prev = timings[0]!;
	for (let i = 1; i < timings.length; i++) {
		sum += timings[i]! - prev;
		prev = timings[i]!;
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

	const defaultDelay = Math.max(conf.defaultDelay, 0);

	return {
		...conf,
		minDelay,
		maxDelay,
		minSamples,
		maxSamples,
		defaultDelay,
	};
}

export function useDynamicDebounceCallback<T extends unknown[]>(
	callback: (...args: T) => void,
	config?: UseDynamicDebounceConfig,
): [(...args: T) => void, UseDynamicDebounceBag] {
	const { defaultDelay, minSamples, maxSamples, delayFunction, minDelay, maxDelay } = parseConfig(config);
	const storedCallback = React.useRef(callback);
	const timer = React.useRef<ReturnType<typeof setTimeout>>();
	const [isDebouncing, setIsDebouncing] = React.useState(false);
	const samples = React.useRef<number[]>([]);
	const isMounted = React.useRef(true);
	const [delay, setDelay] = React.useState<number>(defaultDelay);

	React.useEffect(() => {
		storedCallback.current = callback;
	}, [callback]);

	React.useEffect(
		() => () => {
			if (timer.current !== undefined) {
				clearTimeout(timer.current);
			}
			timer.current = undefined;
			isMounted.current = false;
		},
		[],
	);

	return [
		React.useCallback((...args: T) => {
			if (timer.current) {
				clearTimeout(timer.current);
			}

			samples.current = [
				...(samples.current.length >= maxSamples ? samples.current.slice(1) : samples.current),
				performance.now(),
			];

			const newDelay = clamp(
				samples.current.length >= minSamples ? delayFunction(calculateAverageGap(samples.current)) : defaultDelay,
				minDelay,
				maxDelay,
			);

			setDelay(newDelay);
			setIsDebouncing(true);

			timer.current = setTimeout(() => {
				if (!isMounted.current) return;
				setIsDebouncing(false);
				samples.current = [];
				setDelay(defaultDelay);
				storedCallback.current.apply(null, args);
			}, newDelay);
		}, []),
		{ isDebouncing, delay },
	];
}

export function useDynamicDebounce<S = undefined>(): [
	S | undefined,
	React.Dispatch<React.SetStateAction<S | undefined>>,
	UseDynamicDebounceBag,
];

export function useDynamicDebounce<S>(
	initialState: S | (() => S),
	config?: UseDynamicDebounceConfig,
): [S, React.Dispatch<React.SetStateAction<S>>, UseDynamicDebounceBag];

export function useDynamicDebounce<S = undefined>(initialState?: S | (() => S), config?: UseDynamicDebounceConfig) {
	const [state, setState] = React.useState(initialState);
	return [state, ...useDynamicDebounceCallback(setState, config)];
}
