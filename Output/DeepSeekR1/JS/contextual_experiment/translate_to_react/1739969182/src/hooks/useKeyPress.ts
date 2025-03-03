import { useEffect } from 'react';

export default function useKeyPress(targetKey: string, handler: () => void) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === targetKey) {
        handler();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handler, targetKey]);
}
