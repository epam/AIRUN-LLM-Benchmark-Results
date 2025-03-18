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
```tsx
// App.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Character {
  name: string;
  url: string;
}

const App: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCharacters = async () => {
      const response = await axios.get('https://swapi.dev/api/people');
      setCharacters(response.data.results);
      setIsLoading(false);
    };

    fetchCharacters();
  }, []);

  return (
    <div>
      <h1>Star Wars Characters</h1>
      {isLoading ? (
        <p>Loading...</p>
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
```

```tsx
// index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
``` 


### Tokens: {'input_tokens': 190, 'output_tokens': 322}
### Execution time: 10.485733985900879
