import { useDynamicDebounce } from '../../src';

function clamp(num: number, min: number, max: number): number {
	return Math.min(Math.max(num, min), max);
}

function delayFunction(gap: number): number {
	return clamp(Math.floor(-1034.91 + 308.5 * Math.log(gap)), 200, 1000);
}

export function Test() {
	const [value, setValue, { isDebouncing, delay }] = useDynamicDebounce('test', {
		delayFunction,
		defaultDelay: 700,
	});

	return (
		<div style={{ marginTop: '24px' }}>
			<div style={{ display: 'flex' }}>
				<div
					style={{
						backgroundColor: isDebouncing ? 'pink' : 'lightblue',
						height: '40px',
						width: '100px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					{delay}
				</div>
				<div
					style={{
						backgroundColor: 'lightgray',
						height: '40px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						paddingLeft: '12px',
						paddingRight: '12px',
					}}
				>
					{value}
				</div>
			</div>
			<input style={{ padding: '12px' }} type="text" onChange={(e) => setValue(e.target.value)} />
		</div>
	);
}
