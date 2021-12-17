import React from 'react';
import { useDynamicDebounce } from '../../src';

export function BasicExample() {
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

export function UnmountExample() {
	const [mounted, setMounted] = React.useState(true);

	return (
		<>
			<button onClick={() => setMounted(!mounted)}>{mounted ? 'Unmount' : 'Mount'}</button>
			{mounted ? <ExampleWithDebouncing /> : null}
		</>
	);
}

export function ExampleWithDebouncing() {
	const [debouncedValue, setDebouncedValue, { delay, isDebouncing }] = useDynamicDebounce('Hello World', {
		defaultDelay: 500,
		delayFunction: (averageGap) => Math.floor(averageGap + 5000),
		maxDelay: Infinity,
	});

	return (
		<>
			<input type="text" onChange={(e) => setDebouncedValue(e.target.value)} defaultValue={debouncedValue} />
			<p>The current delay (ms): {delay}</p>
			<p>Is debouncing: {isDebouncing.toString()}</p>
		</>
	);
}
