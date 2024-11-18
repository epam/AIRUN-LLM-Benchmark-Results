```typescript
import { useEffect, useRef } from 'react';

export function useFocus<T extends HTMLElement>(shouldFocus: boolean) {
    const ref = useRef<T>(null);

    useEffect(() => {
        if (shouldFocus && ref.current) {
            ref.current.focus();
        }
    }, [shouldFocus]);

    return ref;
}
```