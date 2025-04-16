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
Here’s a production-ready, fully-typed React 18.x component in TypeScript that adds a debounced search input for SWAPI characters, optimizes API calls, and meets all your requirements.

**Key Features:**
- **Debounced search** (prevents backend overload)
- **Initial data load** (empty search on mount)
- **Graceful error handling** and user feedback
- **Responsive UI** and accessibility
- **Strict TypeScript typing**
- **Performance optimizations** (`useCallback`, `useMemo`)
- **Error boundary** for robust error handling

---

```tsx
// CharacterList.tsx
import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  ChangeEvent,
  FC,
} from 'react';
import axios, { AxiosError } from 'axios';

// --- Types ---
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

// --- Error Boundary ---
interface ErrorBoundaryProps {
  children: React.ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}
class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error) {
    // Optionally log error
  }
  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            color: 'red',
            padding: '1rem',
            textAlign: 'center',
            background: '#fff0f0',
            borderRadius: 8,
            margin: '1rem 0',
          }}
        >
          <strong>Something went wrong:</strong> {this.state.error?.message}
        </div>
      );
    }
    return this.props.children;
  }
}

// --- Main Component ---
const CharacterList: FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // 500ms debounce
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch characters from SWAPI
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
      const axiosErr = err as AxiosError;
      setError(
        axiosErr.response?.status === 404
          ? 'No characters found.'
          : 'Failed to fetch characters. Please try again.'
      );
      setCharacters([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load and on search
  useEffect(() => {
    fetchCharacters(debouncedSearch);
  }, [debouncedSearch, fetchCharacters]);

  // Memoized render of character list
  const characterList = useMemo(() => {
    if (loading) {
      return (
        <div className="loading-indicator" style={{ textAlign: 'center' }}>
          Loading...
        </div>
      );
    }
    if (error) {
      return (
        <div
          className="error-message"
          style={{
            color: 'red',
            textAlign: 'center',
            margin: '1rem 0',
          }}
        >
          {error}
        </div>
      );
    }
    if (characters.length === 0) {
      return (
        <div
          className="no-results"
          style={{
            textAlign: 'center',
            color: '#888',
            margin: '1rem 0',
          }}
        >
          No results found.
        </div>
      );
    }
    return (
      <ul
        className="character-list"
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.5rem',
        }}
      >
        {characters.map((character) => (
          <li
            key={character.url}
            style={{
              background: '#f7f7f7',
              borderRadius: 6,
              padding: '0.75rem 1rem',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              textAlign: 'center',
            }}
          >
            {character.name}
          </li>
        ))}
      </ul>
    );
  }, [characters, loading, error]);

  // Input handler
  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    []
  );

  return (
    <div
      className="character-search-container"
      style={{
        maxWidth: 600,
        margin: '2rem auto',
        padding: '1rem',
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}
    >
      <label
        htmlFor="character-search"
        style={{
          display: 'block',
          marginBottom: 8,
          fontWeight: 500,
          fontSize: '1.1rem',
        }}
      >
        Search Star Wars Characters
      </label>
      <input
        id="character-search"
        type="text"
        value={search}
        onChange={handleInputChange}
        placeholder="Type a character name..."
        style={{
          width: '100%',
          padding: '0.5rem 0.75rem',
          fontSize: '1rem',
          borderRadius: 4,
          border: '1px solid #ccc',
          marginBottom: '1.5rem',
          boxSizing: 'border-box',
        }}
        aria-label="Search Star Wars Characters"
        autoComplete="off"
      />
      {characterList}
    </div>
  );
};

// --- Export with Error Boundary ---
const CharacterListWithBoundary: FC = () => (
  <ErrorBoundary>
    <CharacterList />
  </ErrorBoundary>
);

export default CharacterListWithBoundary;
```

---

**How this meets your requirements:**

- **Debounced search**: Uses a 500ms debounce to avoid excessive API calls.
- **Initial data load**: Loads all characters on mount (empty search).
- **API integration**: Uses axios, passes `search` param as per SWAPI docs.
- **Error handling**: Shows user-friendly error messages and an error boundary for unexpected errors.
- **Loading indicator**: Displays while fetching.
- **No results feedback**: Shows a message if no characters are found.
- **Responsive design**: Uses CSS grid for the character list.
- **Strict TypeScript**: All types are defined for API responses, state, and props.
- **Performance**: Uses `useCallback` and `useMemo` for stable handlers and efficient rendering.
- **Clean code**: No TODOs, commented code, or anti-patterns.

**Usage:**  
Replace your current `CharacterList` export with this file, and import it in your app as needed.

---

**If you want to split ErrorBoundary into its own file, you can, but for a single-component solution, this is ready to use.**

### Tokens: {'input_tokens': 571, 'output_tokens': 1747, 'reasoning_tokens': 0}
### Execution time: 37.2771692276001
