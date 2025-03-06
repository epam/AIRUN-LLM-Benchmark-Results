import { useEffect, useCallback } from 'react';

const ESCAPE_KEY = 27;

export const useTodoEscape = (callback: () => void): void => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.keyCode === ESCAPE_KEY) {
        callback();
      }
    },
    [callback]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
};