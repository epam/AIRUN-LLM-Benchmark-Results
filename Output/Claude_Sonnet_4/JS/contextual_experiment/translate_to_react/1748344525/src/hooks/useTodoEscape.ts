import { useEffect, RefObject } from 'react';

const ESCAPE_KEY = 27;

export const useTodoEscape = (ref: RefObject<HTMLInputElement>, onEscape: () => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.keyCode === ESCAPE_KEY) {
        onEscape();
      }
    };

    const element = ref.current;
    if (element) {
      element.addEventListener('keydown', handleKeyDown);
      return () => {
        element.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [ref, onEscape]);
};
