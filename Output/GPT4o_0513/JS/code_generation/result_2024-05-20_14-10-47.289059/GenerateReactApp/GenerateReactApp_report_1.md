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
Sure, here is a complete React application using Create React App, TypeScript, and axios to fetch and display characters from the SWAPI API.

First, create a new React application using Create React App with TypeScript template:

```sh
npx create-react-app swapi-app --template typescript
cd swapi-app
npm install axios
```

Next, replace the contents of `src/App.tsx` with the following code:

```tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

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

  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  return (
    <div className="App">
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

Add some basic styles in `src/App.css`:

```css
.App {
  text-align: center;
}

.loader {
  font-size: 24px;
  margin-top: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 10px 0;
  font-size: 18px;
}
```

Finally, ensure your `src/index.tsx` is set up correctly:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

This code sets up a React application that fetches data from the SWAPI API and displays a list of Star Wars characters. It includes a loading state to show a loader while the data is being fetched.

### Tokens: {'input_tokens': 188, 'output_tokens': 545}
### Execution time: 10.318363904953003
