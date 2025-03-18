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
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Character {
  name: string;
  url: string;
}

interface ApiResponse {
  results: Character[];
}

const App: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await axios.get<ApiResponse>('https://swapi.dev/api/people');
        setCharacters(response.data.results);
        setLoading(false);
      } catch (e) {
        setError('Failed to fetch characters.');
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  if (loading) {
    return <div>Loading characters...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
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

### Tokens: {'input_tokens': 192, 'output_tokens': 318}
### Execution time: 3.630916118621826
