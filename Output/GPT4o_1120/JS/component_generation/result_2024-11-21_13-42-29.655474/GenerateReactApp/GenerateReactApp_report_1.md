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
Below is the codebase for the requested React application using Create React App, TypeScript, and axios. The application fetches characters from the SWAPI API and displays them in a list with a loader while the data is being fetched.

### File Structure
```
src/
├── components/
│   ├── CharacterList.tsx
│   ├── Loader.tsx
├── App.tsx
├── index.tsx
├── services/
│   ├── api.ts
├── types/
│   ├── Character.ts
```

### Code Implementation

#### `src/types/Character.ts`
```typescript
export interface Character {
  name: string;
  url: string;
}
```

#### `src/services/api.ts`
```typescript
import axios from 'axios';
import { Character } from '../types/Character';

const BASE_URL = 'https://swapi.dev/api';

export const fetchCharacters = async (): Promise<Character[]> => {
  const response = await axios.get<{ results: Character[] }>(`${BASE_URL}/people`);
  return response.data.results;
};
```

#### `src/components/Loader.tsx`
```typescript
import React from 'react';

const Loader: React.FC = () => {
  return <div>Loading...</div>;
};

export default Loader;
```

#### `src/components/CharacterList.tsx`
```typescript
import React from 'react';
import { Character } from '../types/Character';

interface CharacterListProps {
  characters: Character[];
}

const CharacterList: React.FC<CharacterListProps> = ({ characters }) => {
  return (
    <ul>
      {characters.map((character) => (
        <li key={character.url}>{character.name}</li>
      ))}
    </ul>
  );
};

export default CharacterList;
```

#### `src/App.tsx`
```typescript
import React, { useEffect, useState } from 'react';
import { fetchCharacters } from './services/api';
import { Character } from './types/Character';
import Loader from './components/Loader';
import CharacterList from './components/CharacterList';

const App: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadCharacters = async () => {
      try {
        const data = await fetchCharacters();
        setCharacters(data);
      } finally {
        setLoading(false);
      }
    };

    loadCharacters();
  }, []);

  return (
    <div>
      <h1>Star Wars Characters</h1>
      {loading ? <Loader /> : <CharacterList characters={characters} />}
    </div>
  );
};

export default App;
```

#### `src/index.tsx`
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

#### `src/index.css`
```css
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f4f4f4;
}

h1 {
  text-align: center;
  margin-top: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  background: #fff;
  margin: 10px auto;
  padding: 10px;
  max-width: 400px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
```

### How It Works
1. The `App` component initializes the state for `characters` and `loading`.
2. On component mount, it fetches the characters using the `fetchCharacters` function from the `api.ts` service.
3. While the data is being fetched, the `Loader` component is displayed.
4. Once the data is fetched, the `CharacterList` component renders the list of characters.

This implementation is optimized, modular, and adheres to the requirements.

### Tokens: {'input_tokens': 188, 'output_tokens': 894, 'reasoning_tokens': 0}
### Execution time: 6.611536979675293
