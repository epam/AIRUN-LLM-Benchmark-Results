```typescript
import { useEffect, useRef } from 'react';

export function useFocus(condition: boolean) {
    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (condition && ref.current) {
            ref.current.focus();
        }
    }, [condition]);

    return ref;
}
```