import { useEffect, useRef } from 'react';

export const useAutoFocus = (shouldFocus: boolean) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (shouldFocus && ref.current) {
      setTimeout(() => {
        ref.current?.focus();
      }, 0);
    }
  }, [shouldFocus]);

  return ref;
};