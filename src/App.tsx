import React from 'react';
import Test from './Test';

export default function App() {
  const [show, setShow] = React.useState(true);

  return (
    <div>
      <button onClick={() => setShow(!show)}>{show ? 'Hide' : 'Show'}</button>
      {show ? <Test /> : null}
    </div>
  );
}
