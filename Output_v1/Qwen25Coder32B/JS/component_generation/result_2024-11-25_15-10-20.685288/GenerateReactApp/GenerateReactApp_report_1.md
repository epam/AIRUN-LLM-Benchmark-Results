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
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App: React.FC = () => {
  const [characters, setCharacters] = useState<{ name: string, url: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await axios.get<{ results: { name: string, url: string }[] }>('https://swapi.dev/api/people');
        setCharacters(response.data.results);
      } catch (error) {
        console.error('Error fetching characters:', error);
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
    <ul>
      {characters.map((character) => (
        <li key={character.url}>{character.name}</li>
      ))}
    </ul>
  );
};

export default App;
```

### Tokens: {'input_tokens': 189, 'output_tokens': 214}
### Execution time: 2.5541868209838867
