import { useRef, useEffect } from 'react';

export const useTodoFocus = (isFocused: boolean) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isFocused && ref.current) {
      const node = ref.current;
      // Use setTimeout to ensure focus happens after potential DOM updates
      setTimeout(() => node.focus(), 0);
    }
  }, [isFocused]);

  return ref;
};
