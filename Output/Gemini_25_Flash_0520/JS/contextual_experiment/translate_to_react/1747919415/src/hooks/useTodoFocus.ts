import { useEffect, RefObject } from 'react';

export const useTodoFocus = (ref: RefObject<HTMLInputElement>, shouldFocus: boolean) => {
  useEffect(() => {
    if (shouldFocus && ref.current) {
      ref.current.focus();
    }
  }, [shouldFocus, ref]);
};
