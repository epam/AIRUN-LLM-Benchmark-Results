import { useEffect, RefObject } from 'react';

const ESCAPE_KEY = 27;

const useTodoEscape = (
  ref: RefObject<HTMLInputElement>,
  callback: () => void
): void => {
  useEffect(() => {
    const element = ref.current;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.keyCode === ESCAPE_KEY || event.key === 'Escape') {
        callback();
      }
    };
    
    element?.addEventListener('keydown', handleKeyDown);
    
    return () => {
      element?.removeEventListener('keydown', handleKeyDown);
    };
  }, [ref, callback]);
};

export default useTodoEscape;
