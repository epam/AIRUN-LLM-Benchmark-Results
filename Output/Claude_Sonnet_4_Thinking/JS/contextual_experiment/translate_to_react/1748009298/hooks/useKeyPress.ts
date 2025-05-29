import { useEffect } from 'react';

export const useKeyPress = (targetKey: string, handler: () => void) => {
  useEffect(() => {
    const keydownHandler = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        handler();
      }
    };

    document.addEventListener('keydown', keydownHandler);

    return () => {
      document.removeEventListener('keydown', keydownHandler);
    };
  }, [targetKey, handler]);
};