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
// src/index.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);

// src/App.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
        const { data } = await axios.get('https://swapi.dev/api/people?search=');
        setCharacters(data.results);
      } catch (error) {
        setCharacters([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCharacters();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ul>
        {characters.map((character) => (
          <li key={character.url}>{character.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;

// src/index.css
body {
  margin: 0;
  font-family: sans-serif;
}

### Tokens: {'input_tokens': 187, 'output_tokens': 1145, 'reasoning_tokens': 832}
### Execution time: 13.019164323806763
