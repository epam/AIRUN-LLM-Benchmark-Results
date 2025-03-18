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
```bash
npx create-react-app swapi-app --template typescript
cd swapi-app
npm install axios
```

**src/App.tsx**
```typescript
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CharacterList from './components/CharacterList';
import Loader from './components/Loader';

const App: React.FC = () => {
  const [characters, setCharacters] = useState<{ name: string; url: string }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await axios.get('https://swapi.dev/api/people');
        setCharacters(response.data.results);
      } catch (error) {
        console.error('Error fetching characters:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  return (
    <div className="App">
      <h1>Star Wars Characters</h1>
      {isLoading ? <Loader /> : <CharacterList characters={characters} />}
    </div>
  );
};

export default App;
```

**src/components/CharacterList.tsx**
```typescript
import React from 'react';

interface Character {
  name: string;
  url: string;
}

interface CharacterListProps {
  characters: Character[];
}

const CharacterList: React.FC<CharacterListProps> = ({ characters }) => {
  return (
    <ul>
      {characters.map((character, index) => (
        <li key={index}>
          <a href={character.url} target="_blank" rel="noopener noreferrer">
            {character.name}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default CharacterList;
```

**src/components/Loader.tsx**
```typescript
import React from 'react';

const Loader: React.FC = () => {
  return <div>Loading...</div>;
};

export default Loader;
```

**src/index.css**
```css
body {
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
}

.App {
  text-align: center;
}

h1 {
  color: #333;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 10px 0;
}

a {
  color: #007BFF;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
```

**package.json**
```json
{
  "name": "swapi-app",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "@types/jest": "^27.5.2",
    "@types/node": "^16.11.45",
    "@types/react": "^18.0.21",
    "@types/react-dom": "^18.0.6",
    "axios": "^0.27.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "typescript": "^4.7.4",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

### Tokens: {'input_tokens': 185, 'output_tokens': 921}
### Execution time: 18.487571954727173
