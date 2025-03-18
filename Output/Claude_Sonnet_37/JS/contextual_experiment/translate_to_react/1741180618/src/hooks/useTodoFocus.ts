import { useEffect, useRef } from 'react';

export const useTodoFocus = (shouldFocus: boolean): React.RefObject<HTMLInputElement> => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (shouldFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [shouldFocus]);

  return inputRef;
};