import { useEffect, RefObject } from 'react';

const useTodoFocus = (
  ref: RefObject<HTMLInputElement>,
  shouldFocus: boolean
): void => {
  useEffect(() => {
    if (shouldFocus && ref.current) {
      // Use setTimeout to mimic the $timeout(fn, 0) behavior from Angular
      setTimeout(() => {
        ref.current?.focus();
      }, 0);
    }
  }, [ref, shouldFocus]);
};

export default useTodoFocus;
