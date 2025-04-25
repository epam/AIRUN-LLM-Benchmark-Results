import { useEffect } from 'react';

interface UseEscapeProps {
  onEscape: () => void;
}

export function useEscape({ onEscape }: UseEscapeProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.keyCode === 27) {
        onEscape();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onEscape]);
}
