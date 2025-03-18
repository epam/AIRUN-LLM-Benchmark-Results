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
Below is a complete React 18.x application created using Create React App, TypeScript, and axios. It fetches data from the SWAPI API and displays a loader while loading.

1. Initialize the project (run these commands in your terminal):

```bash
npx create-react-app swapi-app --template typescript
cd swapi-app
npm install axios
```

2. Replace the content of `src/App.tsx` with the following:

```tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Character {
  name: string;
  url: string;
}

const App = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const { data } = await axios.get<{ results: Character[] }>('https://swapi.dev/api/people');
        setCharacters(data.results);
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
      <h1>Star Wars Characters</h1>
      <ul>
        {characters.map((character) => (
          <li key={character.url}>{character.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
```

3. Replace the content of `src/index.tsx` with the following:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

4. Run the application:

```bash
npm start
```

The application will fetch and display a list of Star Wars characters from the SWAPI API, showing a loader while the data is being fetched.

### Tokens: {'input_tokens': 188, 'output_tokens': 438, 'reasoning_tokens': 0}
### Execution time: 15.679883003234863
