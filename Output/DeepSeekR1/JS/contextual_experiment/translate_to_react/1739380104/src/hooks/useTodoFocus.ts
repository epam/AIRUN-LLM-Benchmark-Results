import { useEffect, useRef } from 'react';

export const useTodoFocus = (condition: boolean) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (condition && ref.current) {
      setTimeout(() => ref.current?.focus(), 0);
    }
  }, [condition]);

  return ref;
};