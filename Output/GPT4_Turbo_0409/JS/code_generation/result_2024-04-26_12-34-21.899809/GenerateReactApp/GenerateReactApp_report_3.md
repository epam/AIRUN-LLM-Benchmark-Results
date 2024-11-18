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
To create the required React application using Create React App with TypeScript and axios, follow these steps:

1. **Set up the project using Create React App**:
   ```bash
   npx create-react-app swapi-characters --template typescript
   cd swapi-characters
   ```

2. **Install axios**:
   ```bash
   npm install axios
   ```

3. **Create the React components**:
   - Here's how you can structure the application:
     - `src/components/CharacterList.tsx`: Component to fetch and display characters.
     - `src/App.tsx`: Main application component.

4. **Implement the components**:

**src/components/CharacterList.tsx**:
```typescript
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Character {
  name: string;
  url: string;
}

const CharacterList: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios.get('https://swapi.dev/api/people')
      .then(response => {
        setCharacters(response.data.results);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ul>
      {characters.map(character => (
        <li key={character.url}>{character.name}</li>
      ))}
    </ul>
  );
};

export default CharacterList;
```

**src/App.tsx**:
```typescript
import React from 'react';
import './App.css';
import CharacterList from './components/CharacterList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>SWAPI Characters</h1>
        <CharacterList />
      </header>
    </div>
  );
}

export default App;
```

5. **Add basic styling** (optional, for better visibility):
   - Modify `src/App.css` to style the application header or list.

6. **Run the application**:
   ```bash
   npm start
   ```

This setup will display a list of characters fetched from the SWAPI using axios, showing a loading state until the data is fetched. The application is optimized by loading data only once on component mount and handling errors gracefully.

### Tokens: {'input_tokens': 186, 'output_tokens': 519}
### Execution time: 29.97478222846985
