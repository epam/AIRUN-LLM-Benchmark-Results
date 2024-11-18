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
Here is the codebase for the React application:

**`package.json`**

```json
{
  "name": "swapi-characters",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@types/react": "^18.0.26",
    "@types/react-dom": "^18.0.9",
    "axios": "^1.4.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "typescript": "^4.9.5"
  },
  "scripts": {
    "start": "react-scripts start"
  }
}
```

**`tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES6",
    "lib": ["DOM", "DOM.Iterable", "ES6"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ES6",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

**`src/index.tsx`**

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**`src/App.tsx`**

```tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

interface Character {
  name: string;
  url: string;
}

const App: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        let allCharacters: Character[] = [];
        let url = 'https://swapi.dev/api/people';
        while (url) {
          const response = await axios.get(url);
          allCharacters = allCharacters.concat(response.data.results);
          url = response.data.next;
        }
        setCharacters(allCharacters);
      } catch (error) {
        console.error('Error fetching characters:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCharacters();
  }, []);

  if (loading) {
    return (
      <div className="loader">
        Loading...
      </div>
    );
  }

  return (
    <div className="app">
      <h1>Star Wars Characters</h1>
      <ul className="character-list">
        {characters.map((character) => (
          <li key={character.url}>{character.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
```

**`src/App.css`**

```css
.app {
  font-family: Arial, sans-serif;
  text-align: center;
}

.character-list {
  list-style-type: none;
  padding: 0;
}

.character-list li {
  margin: 5px 0;
}

.loader {
  font-size: 24px;
  margin-top: 50px;
}
```

**`src/index.css`**

```css
body {
  margin: 0;
  padding: 0;
  background-color: #f0f0f0;
}
```

### Tokens: {'input_tokens': 158, 'output_tokens': 3136, 'reasoning_tokens': 2304}
### Execution time: 36.585330963134766
