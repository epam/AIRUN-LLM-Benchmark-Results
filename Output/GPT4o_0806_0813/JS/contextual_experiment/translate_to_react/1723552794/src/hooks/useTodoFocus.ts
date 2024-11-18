import { useEffect, useRef } from 'react';

const useTodoFocus = (shouldFocus: boolean) => {
  const elementRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (shouldFocus && elementRef.current) {
      elementRef.current.focus();
    }
  }, [shouldFocus]);

  return elementRef;
};

export default useTodoFocus;
