import React from 'react';
import { useDynamicDebounceCallback } from './useDynamicDebounce';

export default function App() {
  const [show, setShow] = React.useState(true);

  const [debouncedCallback, { isDebouncing, delay, setDelay }] = useDynamicDebounceCallback(
    (text: string) => console.log(text),
    {
      initialDelay: 1500,
    }
  );

  return (
    <div>
      <div>
        <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'}</button>
      </div>
      {show ? (
        <>
          <button
            onClick={() => debouncedCallback('hello')}
            style={{ backgroundColor: isDebouncing ? 'pink' : 'lightblue' }}
          >
            Click me - {delay}
          </button>
          <button onClick={() => setDelay(d => d + 100)}>Add to delay</button>
          <button onClick={() => setDelay(0)}>Reset delay</button>
        </>
      ) : null}
    </div>
  );
}
