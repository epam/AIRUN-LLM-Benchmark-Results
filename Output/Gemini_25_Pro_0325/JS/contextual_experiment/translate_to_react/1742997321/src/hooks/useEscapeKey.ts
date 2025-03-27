import { useEffect } from 'react';

const ESCAPE_KEY = 'Escape';

export const useEscapeKey = (callback: () => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === ESCAPE_KEY) {
        callback();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [callback]);
};
