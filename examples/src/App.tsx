import { BasicExample, ExampleWithDebouncing, UnmountExample } from './Examples';

export function App() {
	return (
		<>
			<BasicExample />
			<div style={{ marginTop: '100px' }}>
				<UnmountExample />
			</div>
		</>
	);
}
