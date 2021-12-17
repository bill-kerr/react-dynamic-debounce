## react-dynamic-debounce

A dynamically adjustable debounce hook

## Quick Start

```
npm i react-dynamic-debounce
```

```jsx
import { useDynamicDebounce } from 'react-dynamic-debounce';

function function BasicExample() {
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
