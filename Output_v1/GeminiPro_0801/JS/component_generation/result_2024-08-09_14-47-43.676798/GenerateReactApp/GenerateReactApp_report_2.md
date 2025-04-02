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

## Run 2:
### Answer:
```tsx
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
      setIsLoading(true);
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
        <div>Loading...</div>
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

```typescript jsx
// package.json
{
  "dependencies": {
    "@testing-library/jest-dom": "^6.1.4",
    "@testing-library/react": "^14.0.0",
    "@testing-library/user-event": "^14.4.3",
    "@types/jest": "^29.5.3",
    "@types/node": "^20.4.2",
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "axios": "^1.4.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "typescript": "^5.1.6",
    "web-vitals": "^3.3.0"
  },
}
```


### Tokens: {'input_tokens': 190, 'output_tokens': 472}
### Execution time: 10.874815940856934
