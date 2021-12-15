import React from 'react';

export function useLatest<T>(current: T) {
  const storedValue = React.useRef<T>(current);
  React.useEffect(() => {
    storedValue.current = current;
  });
  return storedValue;
}
