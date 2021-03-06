## react-dynamic-debounce

A debounce hook that dynamically adjusts to input speed.

## Quick Start

```
npm i react-dynamic-debounce
```

```jsx
import { useDynamicDebounce } from 'react-dynamic-debounce';

function BasicExample() {
	const [debouncedValue, setDebouncedValue, { delay }] = useDynamicDebounce('Hello World', {
		defaultDelay: 500,
		delayFunction: (averageGap) => Math.floor(averageGap + 275),
	});

	return (
		<>
			<input type="text" onChange={(e) => setDebouncedValue(e.target.value)} defaultValue={debouncedValue} />
			<p>The current delay (ms): {delay}</p>
			<p>My debounced value: {debouncedValue}</p>
		</>
	);
}
```

## API

### useDynamicDebounce(initialState, options?)

A debounce hook that can adjust its debounce delay based on input speed. Provide a `delayFunction` to customize this behavior. Use this hook as you would `useState`.

```jsx
export function useDynamicDebounce<S>(
	initialState: S | (() => S),
	config?: UseDynamicDebounceConfig,
): [S, React.Dispatch<React.SetStateAction<S>>, UseDynamicDebounceBag];
```

| Parameter    | Type                                                    | Description                                        |
| ------------ | ------------------------------------------------------- | -------------------------------------------------- |
| initialState | `(S \| () => S)`                                        | The initial state value.                           |
| config       | [`UseDynamicDebounceConfig`](#UseDynamicDebounceConfig) | Config object, allowing customization of behavior. |

### useDynamicDebounceCallback(callback, options?)

A hook that returns a debounced callback with the same behavior and customization options as `useDynamicDebounce`.

```jsx
export function useDynamicDebounceCallback<T extends unknown[]>(
	callback: (...args: T) => void,
	config?: UseDynamicDebounceConfig,
): [(...args: T) => void, UseDynamicDebounceBag]
```

### UseDynamicDebounceConfig

Pass any number of arguments from this object as the second argument to either `useDynamicDebounce` or `useDynamicDebounceCallback` to customize its behavior.

| Option        | Type                             | Default Value                            | Description                                                                                                                                                                                           |
| ------------- | -------------------------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| defaultDelay  | `number`                         | `275`                                    | The amount of time in milliseconds that values will be initially debounced. The debounce time will also reset to this once it is triggered.                                                           |
| minDelay      | `number`                         | `0`                                      | The minimum debounce time in milliseconds.                                                                                                                                                            |
| maxDelay      | `number`                         | `825`                                    | The maximum debounce time in milliseconds.                                                                                                                                                            |
| delayFunction | `(averageGap: number) => number` | `(averageGap) => Math.floor(averageGap)` | A function that receives the average time in milliseconds between input events and returns what the corresponding debounce time should be. This will only trigger once `minSamples` has been reached. |
| minSamples    | `number`                         | `6`                                      | The minimum number of input events that will happen before the delay function is called. Cannot be below 2.                                                                                           |
| maxSamples    | `number`                         | `10`                                     | The maximum number of input events that will be used to calculate the `averageGap` that gets passed to the delay function.                                                                            |

```jsx
// Debounce hook with logarithmic delay function

const [value, setValue, { isDebouncing }] = useDynamicDebounce('Hello World!', {
	defaultDelay: 700,
	minDelay: 300,
	maxDelay: Infinity,
	delayFunction: (gap) => -470 + 199 * Math.log(gap),
	minSamples: 4,
	maxSamples: 8,
});
```

### UseDynamicDebounceBag

`UseDynamicDebounceBag` are the values returned as the third return value from `useDynamicDebounce` or the second from `useDynamicDebounceCallback`.

| Value        | Type      | Description                                                    |
| ------------ | --------- | -------------------------------------------------------------- |
| delay        | `number`  | The current debounce delay in milliseconds                     |
| isDebouncing | `boolean` | A boolean indicating whether or not a debounce delay is active |
