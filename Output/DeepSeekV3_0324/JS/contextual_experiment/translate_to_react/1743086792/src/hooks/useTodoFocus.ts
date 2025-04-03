import { useEffect, useRef } from 'react';

export const useTodoFocus = (shouldFocus: boolean) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (shouldFocus && ref.current) {
      ref.current.focus();
    }
  }, [shouldFocus]);

  return ref;
};