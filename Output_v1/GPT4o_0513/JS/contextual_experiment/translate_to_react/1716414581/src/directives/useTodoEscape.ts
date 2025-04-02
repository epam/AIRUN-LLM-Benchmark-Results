import { useEffect } from 'react';

const ESCAPE_KEY = 27;

const useTodoEscape = (ref: React.RefObject<HTMLElement>, onEscape: () => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.keyCode === ESCAPE_KEY) {
        onEscape();
      }
    };

    const element = ref.current;
    if (element) {
      element.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (element) {
        element.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [ref, onEscape]);
};

export default useTodoEscape;
