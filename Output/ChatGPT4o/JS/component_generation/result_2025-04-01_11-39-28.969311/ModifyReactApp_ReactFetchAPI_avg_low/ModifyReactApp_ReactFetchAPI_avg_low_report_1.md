Your task is to modify the application on React 18.x, which utilizes the SWAPI open API.
You should add a character search functionality and optimize it efficiently (avoid overloading the Backend with requests).

<source_code>
```tsx
// index.tsx
import React, {useEffect, useState} from 'react';
import axios from 'axios';

interface Character {
    name: string;
    url: string;
}

const CharacterList: React.FC = () => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchCharacters = async () => {
            try {
                const response = await axios.get('https://swapi.dev/api/people');
                setCharacters(response.data.results);
            } catch (error) {
                console.error('Failed to fetch characters:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCharacters();
    }, []);

    if (loading) return <div>Loading...</div>;

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

</source_code>

Please follow these steps:

1. Implement a search functionality for a React 18.x application:
   - Add a search input field to filter characters by name
   - Do not overload the backend with requests
   - Preserve initial data loading behavior

2. API Integration requirements:
   - Continue using axios for API requests
   - Send an initial empty search query on component mount
   - Format search requests according to the API specifications
   - Handle API errors gracefully with appropriate user feedback

3. User Interface requirements:
   - Display a loading indicator during API requests
   - Show search results dynamically as users type
   - Implement responsive design for the search component
   - Provide visual feedback when no results are found

4. Technical implementation requirements:
   - Use TypeScript with proper type definitions for all components and functions
   - Maintain strict typing for API responses and component props
   - Implement proper state management for search queries and results
   - Apply performance optimizations where applicable (useMemo, useCallback)

5. Code quality standards:
   - Write clean, production-ready code without TODOs or commented-out code
   - Follow React best practices and patterns
   - Ensure all components are properly typed
   - Implement error boundaries where appropriate
## Run 1:
### Answer:
Here's the updated and optimized React 18.x component with search functionality, efficient API usage, and all the requested features implemented using TypeScript and best practices:

✅ Features Implemented:

- Search input with debounced API calls to avoid backend overload
- Initial data load on mount with empty search query
- Graceful error handling and user feedback
- Responsive UI with loading and "no results" indicators
- Strict TypeScript typing
- Performance optimizations using useCallback and useMemo

🔧 Updated Code:

```tsx
// CharacterList.tsx
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import './CharacterList.css'; // Optional: for responsive styling

interface Character {
  name: string;
  url: string;
}

interface SwapiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Character[];
}

const CharacterList: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');

  // Debounce search input to avoid excessive API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const fetchCharacters = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<SwapiResponse>(
        'https://swapi.dev/api/people',
        {
          params: query ? { search: query } : {},
        }
      );
      setCharacters(response.data.results);
    } catch (err) {
      console.error('Failed to fetch characters:', err);
      setError('Failed to load characters. Please try again later.');
      setCharacters([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch characters on mount and when debouncedQuery changes
  useEffect(() => {
    fetchCharacters(debouncedQuery);
  }, [debouncedQuery, fetchCharacters]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  const characterList = useMemo(() => {
    if (loading) {
      return <div className="status">Loading...</div>;
    }

    if (error) {
      return <div className="status error">{error}</div>;
    }

    if (characters.length === 0) {
      return <div className="status">No characters found.</div>;
    }

    return (
      <ul className="character-list">
        {characters.map((character) => (
          <li key={character.url}>{character.name}</li>
        ))}
      </ul>
    );
  }, [characters, loading, error]);

  return (
    <div className="character-container">
      <h1>Star Wars Characters</h1>
      <input
        type="text"
        placeholder="Search characters..."
        value={searchQuery}
        onChange={handleInputChange}
        className="search-input"
        aria-label="Search characters"
      />
      {characterList}
    </div>
  );
};

export default CharacterList;
```

📦 Optional CSS (CharacterList.css):

```css
.character-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
  font-family: Arial, sans-serif;
}

.search-input {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  margin-bottom: 1rem;
  box-sizing: border-box;
}

.character-list {
  list-style: none;
  padding: 0;
}

.character-list li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #ccc;
}

.status {
  text-align: center;
  font-size: 1rem;
  color: #555;
}

.status.error {
  color: red;
}
```

🧪 Notes:

- The debounce logic ensures that the API is not called on every keystroke.
- The initial fetch is triggered with an empty query to load the first page of characters.
- The component is fully typed with TypeScript, including API response types.
- The UI is responsive and provides feedback for loading, errors, and empty results.

🛡️ Error Boundary (Optional Enhancement):

If you want to wrap this component in an error boundary, you can create a simple one like this:

```tsx
// ErrorBoundary.tsx
import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, ErrorBoundaryState> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong. Please refresh the page.</h2>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

Then wrap your component in index.tsx:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import CharacterList from './CharacterList';
import ErrorBoundary from './ErrorBoundary';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <CharacterList />
    </ErrorBoundary>
  </React.StrictMode>
);
```

✅ This implementation meets all the requirements and is ready for production.

### Tokens: {'input_tokens': 571, 'output_tokens': 1317, 'reasoning_tokens': 0}
### Execution time: 12.913456916809082
