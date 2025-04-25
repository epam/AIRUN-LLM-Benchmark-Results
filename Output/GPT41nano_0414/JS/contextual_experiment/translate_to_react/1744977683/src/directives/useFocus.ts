import { useEffect, RefObject } from 'react';

interface UseFocusProps {
  shouldFocus: boolean;
  ref: RefObject<HTMLElement>;
}

export function useFocus({ shouldFocus, ref }: UseFocusProps) {
  useEffect(() => {
    if (shouldFocus && ref.current) {
      ref.current.focus();
    }
  }, [shouldFocus, ref]);
}
