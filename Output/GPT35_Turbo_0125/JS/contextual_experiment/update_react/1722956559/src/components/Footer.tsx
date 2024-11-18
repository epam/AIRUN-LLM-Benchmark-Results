```tsx
import React from 'react';
import { VISIBILITY_FILTERS } from '../constants/constants';

const Footer: React.FC = () => {
  return (
    <div>
      <button onClick={() => console.log(VISIBILITY_FILTERS.SHOW_ALL)}>All</button>
      <button onClick={() => console.log(VISIBILITY_FILTERS.SHOW_COMPLETED)}>Completed</button>
      <button onClick={() => console.log(VISIBILITY_FILTERS.SHOW_ACTIVE)}>Active</button>
    </div>
  );
};

export default Footer;
```