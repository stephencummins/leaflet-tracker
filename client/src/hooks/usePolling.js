import { useEffect, useRef } from 'react';

export function usePolling(fn, interval = 15000) {
  const savedFn = useRef(fn);
  savedFn.current = fn;

  useEffect(() => {
    savedFn.current();
    const id = setInterval(() => savedFn.current(), interval);
    return () => clearInterval(id);
  }, [interval]);
}
