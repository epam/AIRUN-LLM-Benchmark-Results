import { useEffect } from 'react';

const useTodoFocus = (ref: React.RefObject<HTMLInputElement>, shouldFocus: boolean) => {
  useEffect(() => {
    if (shouldFocus && ref.current) {
      ref.current.focus();
    }
  }, [shouldFocus, ref]);
};

export default useTodoFocus;
