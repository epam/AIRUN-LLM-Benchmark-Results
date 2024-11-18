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
Here's a simple React application that fetches characters from the SWAPI and displays them in a list. The application uses Create React App with TypeScript and axios.

1. First, create a new React app with TypeScript:

```bash
npx create-react-app swapi-characters --template typescript
cd swapi-characters
```

2. Install axios:

```bash
npm install axios
```

3. Replace the contents of `src/App.tsx` with the following code:

```tsx
import React, { useEffect, useState } from 'react';
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
        const response = await axios.get('https://swapi.dev/api/people');
        setCharacters(response.data.results);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  return (
    <div>
      <h1>Star Wars Characters</h1>
      {loading ? (
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

4. Start the application:

```bash
npm start
```

This code will fetch the characters from the SWAPI API when the component mounts, display a loading message while the data is being fetched, and then render the list of character names once the data is loaded.

### Tokens: {'input_tokens': 188, 'output_tokens': 393}
### Execution time: 6.347499847412109
