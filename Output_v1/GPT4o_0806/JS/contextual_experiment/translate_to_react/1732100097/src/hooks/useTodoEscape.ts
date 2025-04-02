import { useEffect } from 'react';

const useTodoEscape = (ref: React.RefObject<HTMLElement>, onEscape: () => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
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