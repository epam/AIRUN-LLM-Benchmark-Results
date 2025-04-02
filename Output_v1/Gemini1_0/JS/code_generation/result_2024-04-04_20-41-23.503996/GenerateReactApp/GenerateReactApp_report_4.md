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

## Run 4:
### Answer:
```typescript
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [characters, setCharacters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharacters = async () => {
      const response = await axios.get("https://swapi.dev/api/people");
      setCharacters(response.data.results);
      setLoading(false);
    };
    fetchCharacters();
  }, []);

  return (
    <div className="App">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {characters.map((character) => (
            <li key={character.name}>{character.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
```
### Tokens: {'prompt_tokens': 191, 'completion_tokens': 220, 'total_tokens': 411}
### Execution time: 2.4081790447235107
