import { useEffect } from 'react';

const useTodoFocus = (ref: React.RefObject<HTMLElement>, shouldFocus: boolean) => {
  useEffect(() => {
    if (shouldFocus && ref.current) {
      ref.current.focus();
    }
  }, [shouldFocus, ref]);
};

export default useTodoFocus;