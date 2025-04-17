import { useEffect } from 'react';

const ESCAPE_KEY = 'Escape';

const useEscape = (handler: () => void): void => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === ESCAPE_KEY || event.keyCode === 27) {
        handler();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handler]);
};

export default useEscape;
