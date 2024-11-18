import { useEffect, useRef } from 'react';

const useTodoFocus = (isFocused: boolean) => {
  const elementRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isFocused && elementRef.current) {
      elementRef.current.focus();
    }
  }, [isFocused]);

  return elementRef;
};

export default useTodoFocus;
