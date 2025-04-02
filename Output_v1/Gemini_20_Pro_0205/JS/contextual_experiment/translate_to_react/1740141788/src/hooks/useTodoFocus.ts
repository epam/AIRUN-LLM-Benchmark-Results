import { useEffect, RefObject } from 'react';

export const useTodoFocus = (ref: RefObject<HTMLInputElement>, condition: boolean) => {
  useEffect(() => {
    if (condition) {
      ref.current?.focus();
    }
  }, [condition, ref]);
};
