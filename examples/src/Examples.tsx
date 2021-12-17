import { useDynamicDebounce } from '.';

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
