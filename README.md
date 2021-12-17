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
