import { useEffect, useRef } from 'react';

export const useTodoFocus = (shouldFocus: boolean) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (shouldFocus && ref.current) {
      const timer = setTimeout(() => {
        ref.current?.focus();
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [shouldFocus]);

  return ref;
};