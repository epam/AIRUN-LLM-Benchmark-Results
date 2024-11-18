import { useEffect, useRef } from 'react';

export const useFocus = (isFocused: boolean) => {
  const elementRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isFocused && elementRef.current) {
      elementRef.current.focus();
    }
  }, [isFocused]);

  return elementRef;
};
