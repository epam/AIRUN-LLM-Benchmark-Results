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
Here's a simple React application that fetches and displays a list of Star Wars characters using the SWAPI API. The application is built using Create React App, TypeScript, and axios.

### Step 1: Create the React App with TypeScript

First, create a new React app with TypeScript:

```bash
npx create-react-app swapi-app --template typescript
cd swapi-app
```

### Step 2: Install Axios

Install axios for making HTTP requests:

```bash
npm install axios
```

### Step 3: Create the Application

Now, let's create the application. Replace the contents of `src/App.tsx` with the following code:

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
        const response = await axios.get('https://swapi.dev/api/people?search=');
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

### Step 4: Add Basic Styling

You can add some basic styling in `src/App.css`:

```css
.App {
  text-align: center;
  font-family: Arial, sans-serif;
}

.loader {
  font-size: 24px;
  margin-top: 50px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  font-size: 18px;
  margin: 10px 0;
}
```

### Step 5: Run the Application

Now, you can run the application:

```bash
npm start
```

### Explanation

- **State Management**: The application uses the `useState` hook to manage the state of the characters and the loading state.
- **Data Fetching**: The `useEffect` hook is used to fetch the data from the SWAPI API when the component mounts. Axios is used to make the HTTP GET request.
- **Loading Indicator**: While the data is being fetched, a loading indicator is displayed.
- **Rendering**: Once the data is fetched, the list of characters is rendered in an unordered list.

This code is optimized for simplicity and clarity, following best practices for a small React application.

### Tokens: {'input_tokens': 188, 'output_tokens': 643}
### Execution time: 7.769096851348877
