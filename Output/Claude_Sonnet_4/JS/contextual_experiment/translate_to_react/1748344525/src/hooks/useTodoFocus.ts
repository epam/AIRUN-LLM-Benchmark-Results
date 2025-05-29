import { useEffect, RefObject } from 'react';

export const useTodoFocus = (ref: RefObject<HTMLInputElement>, shouldFocus: boolean) => {
  useEffect(() => {
    if (shouldFocus && ref.current) {
      setTimeout(() => {
        ref.current?.focus();
      }, 0);
    }
  }, [ref, shouldFocus]);
};
