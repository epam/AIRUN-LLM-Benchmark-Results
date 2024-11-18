import { useEffect } from 'react';

const ESCAPE_KEY = 27;

const useTodoEscape = (handler: () => void) => {
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.keyCode === ESCAPE_KEY) {
        handler();
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [handler]);
};

export default useTodoEscape;
