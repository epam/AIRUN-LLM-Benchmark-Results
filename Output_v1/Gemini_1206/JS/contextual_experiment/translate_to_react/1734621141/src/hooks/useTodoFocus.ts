import { useEffect, useRef } from 'react';

export const useTodoFocus = <T extends HTMLElement>(condition: boolean) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (condition && ref.current) {
      ref.current.focus();
    }
  }, [condition]);

  return ref;
};
