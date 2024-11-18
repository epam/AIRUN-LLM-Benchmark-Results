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
To accomplish the task, follow these steps to set up the project, install necessary dependencies, and write the application code.

### Step 1: Setting Up the Project

1. **Create a new React project with TypeScript**:
   ```bash
   npx create-react-app swapi-characters --template typescript
   ```
2. **Navigate into your project directory**:
   ```bash
   cd swapi-characters
   ```
3. **Install Axios** for making API requests:
   ```bash
   npm install axios
   ```

### Step 2: Writing the Application Code

1. **Create a new file for the API service**:
   - Path: `src/api/swapi.ts`
   - This file will contain the function to fetch characters from the SWAPI.

2. **Create a new component to display characters**:
   - Path: `src/components/CharacterList.tsx`
   - This component will be responsible for fetching the characters on mount and displaying them.

### Step 3: Implementing the API Service (`src/api/swapi.ts`)

```typescript
import axios from 'axios';

const BASE_URL = 'https://swapi.dev/api/people';

export const fetchCharacters = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching characters:', error);
    return [];
  }
};
```

### Step 4: Implementing the CharacterList Component (`src/components/CharacterList.tsx`)

```typescript
import React, { useEffect, useState } from 'react';
import { fetchCharacters } from '../api/swapi';

interface Character {
  name: string;
  url: string;
}

const CharacterList: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getCharacters = async () => {
      const data = await fetchCharacters();
      setCharacters(data);
      setLoading(false);
    };

    getCharacters();
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

export default CharacterList;
```

### Step 5: Using the CharacterList Component in the App

Modify the `src/App.tsx` to use the `CharacterList` component:

```typescript
import React from 'react';
import './App.css';
import CharacterList from './components/CharacterList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <CharacterList />
      </header>
    </div>
  );
}

export default App;
```

### Step 6: Running the Application

- Start the application:
  ```bash
  npm start
  ```
- The application should now fetch and display the characters from SWAPI on the homepage.

This setup completes the task as per the instructions. The application fetches and displays characters from the SWAPI, shows a loader while loading, and optimizes the code by separating concerns (API service and component logic).
### Tokens: {'prompt_tokens': 186, 'completion_tokens': 679, 'total_tokens': 865}
### Execution time: 35.54118299484253
