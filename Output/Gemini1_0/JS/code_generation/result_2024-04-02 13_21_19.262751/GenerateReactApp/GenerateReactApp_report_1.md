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
import { useEffect, useState } from "react";
import axios from "axios";
import { Loader } from "./Loader";
import { Character } from "./Character";

const App = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://swapi.dev/api/people")
      .then((res) => {
        setCharacters(res.data.results);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {loading ? <Loader /> : <ul>{characters.map((character) => <Character key={character.url} character={character} />)}</ul>}
    </div>
  );
};

export default App;
```
### Tokens: {'prompt_tokens': 217, 'completion_tokens': 218, 'total_tokens': 435}
### Execution time: 2.353402853012085

