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
```typescript
// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// src/App.tsx
import React, { useEffect, useState } from 'react';
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
        const response = await axios.get('https://swapi.dev/api/people/');
        setCharacters(response.data.results);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCharacters();
  }, []);

  return (
    <div className="App">
      <h1>Star Wars Characters</h1>
      {loading ? (
        <div className="loader">Loading...</div>
      ) : (
        <ul>
          {characters.map((character) => (
            <li key={character.url}>{character.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;

// src/App.css
.App {
  text-align: center;
  padding: 20px;
}

.loader {
  font-size: 24px;
  font-weight: bold;
}

// src/index.css
body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  background-color: #f0f0f0;
}
```

### Tokens: {'input_tokens': 158, 'output_tokens': 855, 'reasoning_tokens': 448}
### Execution time: 4.767744064331055
