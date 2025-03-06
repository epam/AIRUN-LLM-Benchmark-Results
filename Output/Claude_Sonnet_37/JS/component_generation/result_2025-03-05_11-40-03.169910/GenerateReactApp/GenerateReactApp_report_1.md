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
I'll create a React application that fetches and displays Star Wars characters from the SWAPI API. Here's the complete codebase:

First, let's set up the project:

```bash
npx create-react-app swapi-characters --template typescript
cd swapi-characters
npm install axios
```

Now, let's create the necessary files:

**src/types.ts**
```typescript
export interface Character {
  name: string;
  url: string;
}

export interface SwapiResponse {
  results: Character[];
}
```

**src/api.ts**
```typescript
import axios from 'axios';
import { SwapiResponse } from './types';

const API_URL = 'https://swapi.dev/api/people';

export const fetchCharacters = async (): Promise<SwapiResponse> => {
  const response = await axios.get<SwapiResponse>(API_URL);
  return response.data;
};
```

**src/components/Loader.tsx**
```typescript
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="loader">
      <div className="spinner"></div>
      <p>Loading characters...</p>
    </div>
  );
};

export default Loader;
```

**src/components/CharacterList.tsx**
```typescript
import React from 'react';
import { Character } from '../types';

interface CharacterListProps {
  characters: Character[];
}

const CharacterList: React.FC<CharacterListProps> = ({ characters }) => {
  return (
    <div className="character-list">
      <h2>Star Wars Characters</h2>
      <ul>
        {characters.map((character, index) => (
          <li key={index} className="character-item">
            <h3>{character.name}</h3>
            <p>URL: {character.url}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CharacterList;
```

**src/App.tsx**
```typescript
import React, { useEffect, useState } from 'react';
import { fetchCharacters } from './api';
import { Character } from './types';
import CharacterList from './components/CharacterList';
import Loader from './components/Loader';
import './App.css';

const App: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCharacters = async () => {
      try {
        const data = await fetchCharacters();
        setCharacters(data.results);
        setLoading(false);
      } catch (err) {
        setError('Failed to load characters');
        setLoading(false);
      }
    };

    loadCharacters();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Star Wars Characters</h1>
      </header>
      <main>
        <CharacterList characters={characters} />
      </main>
    </div>
  );
};

export default App;
```

**src/App.css**
```css
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.app-header {
  text-align: center;
  margin-bottom: 30px;
}

.character-list {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 20px;
}

.character-item {
  background-color: white;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.character-item h3 {
  margin-top: 0;
  color: #333;
}

.loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #09f;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

.error-message {
  color: red;
  text-align: center;
  padding: 20px;
  font-size: 18px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
```

**src/index.tsx**
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**src/index.css**
```css
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f9f9f9;
}

ul {
  list-style-type: none;
  padding: 0;
}
```

This application will:
1. Fetch Star Wars characters from the SWAPI API when the component mounts
2. Display a loading spinner while fetching data
3. Show the list of characters once loaded
4. Handle errors if the API request fails
5. Present the data in a clean, styled interface

The code is optimized with proper TypeScript typing, component separation, and error handling.

### Tokens: {'input_tokens': 204, 'output_tokens': 1656}
### Execution time: 19.360023975372314
