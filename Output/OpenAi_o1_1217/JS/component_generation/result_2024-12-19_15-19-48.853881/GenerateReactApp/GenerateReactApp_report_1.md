Your task is to create an application on React 18.x that can utilize the SWAPI open API to fetch characters and display them in a list.

When completing the task, ensure to follow the instructions below:
- Use Create React App, TypeScript, and axios.
- Display a loader while loading.
- Do not include any input fields; only load the data initially and display it.
- Optimize the code where possible.
- The generated code should not contain any TODOs.
- Return the codebase without additional comments.

API Description:
GET https://swapi.dev/api/people?search={search}
Response:
{ results: Array<{ name: string, url: string }> }

## Run 1:
### Answer:
```plaintext
├── package.json
├── tsconfig.json
├── public
│   └── index.html
└── src
    ├── react-app-env.d.ts
    ├── index.tsx
    └── App.tsx
```

package.json:
```json
{
  "name": "swapi-characters",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "axios": "^1.4.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "typescript": "^4.9.5"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  }
}
```

tsconfig.json:
```json
{
  "compilerOptions": {
    "target": "ES5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react"
  },
  "include": ["src"]
}
```

public/index.html:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>SWAPI Characters</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

src/react-app-env.d.ts:
```ts
/// <reference types="react-scripts" />
```

src/index.tsx:
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
```

src/App.tsx:
```tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Character {
  name: string;
  url: string;
}

function App() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://swapi.dev/api/people')
      .then(response => {
        setCharacters(response.data.results);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <ul>
      {characters.map(character => (
        <li key={character.url}>{character.name}</li>
      ))}
    </ul>
  );
}

export default App;
```

### Tokens: {'input_tokens': 187, 'output_tokens': 1970, 'reasoning_tokens': 1280}
### Execution time: 20.351476907730103
