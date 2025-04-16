import { useEffect } from "react";

export function useTodoFocus(ref: React.RefObject<HTMLElement>, shouldFocus: boolean) {
  useEffect(() => {
    if (shouldFocus && ref.current) {
      ref.current.focus();
    }
  }, [shouldFocus, ref]);
}
