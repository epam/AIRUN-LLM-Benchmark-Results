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
```tsx
// index.tsx
import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  ChangeEvent,
  ReactNode,
} from "react";
import axios, { AxiosResponse } from "axios";

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

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to an error reporting service if needed
    // console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          style={{
            padding: "1rem",
            backgroundColor: "#fdd",
            color: "#900",
            borderRadius: 4,
            maxWidth: 600,
            margin: "2rem auto",
            textAlign: "center",
          }}
        >
          <h2>Something went wrong.</h2>
          <p>{this.state.errorMessage}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

const DEBOUNCE_DELAY_MS = 500;

const CharacterList: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Debounced search query state
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");

  // Debounce effect for search input
  useEffect(() => {
    const handler = window.setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, DEBOUNCE_DELAY_MS);

    return () => {
      window.clearTimeout(handler);
    };
  }, [searchQuery]);

  const fetchCharacters = useCallback(
    async (query: string) => {
      setLoading(true);
      setError(null);
      try {
        // API expects search param "search" for filtering by name
        // If query is empty, it returns all characters (first page)
        const url = "https://swapi.dev/api/people";
        const params = query ? { search: query } : {};
        const response: AxiosResponse<SwapiResponse> = await axios.get(url, {
          params,
        });
        setCharacters(response.data.results);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.statusText ||
              err.message ||
              "Failed to fetch characters"
          );
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
        setCharacters([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Fetch characters on mount and when debouncedQuery changes
  useEffect(() => {
    fetchCharacters(debouncedQuery);
  }, [debouncedQuery, fetchCharacters]);

  const onSearchChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  // Memoized characters list to avoid unnecessary re-renders
  const charactersList = useMemo(() => {
    if (characters.length === 0 && !loading && !error) {
      return (
        <li
          style={{
            padding: "0.5rem 1rem",
            color: "#555",
            fontStyle: "italic",
            textAlign: "center",
          }}
          aria-live="polite"
        >
          No characters found.
        </li>
      );
    }
    return characters.map((character) => (
      <li
        key={character.url}
        style={{
          padding: "0.5rem 1rem",
          borderBottom: "1px solid #ddd",
          listStyle: "none",
        }}
      >
        {character.name}
      </li>
    ));
  }, [characters, loading, error]);

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "2rem auto",
        padding: "0 1rem",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
      }}
    >
      <label
        htmlFor="character-search"
        style={{
          display: "block",
          marginBottom: 8,
          fontWeight: "600",
          fontSize: "1.1rem",
        }}
      >
        Search Characters
      </label>
      <input
        id="character-search"
        type="search"
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Type a character name..."
        aria-label="Search characters by name"
        style={{
          width: "100%",
          padding: "0.5rem 1rem",
          fontSize: "1rem",
          borderRadius: 4,
          border: "1px solid #ccc",
          boxSizing: "border-box",
          marginBottom: 16,
          transition: "border-color 0.2s",
        }}
        autoComplete="off"
      />
      {loading && (
        <div
          role="status"
          aria-live="polite"
          style={{ textAlign: "center", marginBottom: 16 }}
        >
          Loading...
        </div>
      )}
      {error && (
        <div
          role="alert"
          style={{
            color: "#b00020",
            backgroundColor: "#fdd",
            padding: "0.75rem 1rem",
            borderRadius: 4,
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}
      <ul
        style={{
          padding: 0,
          margin: 0,
          borderRadius: 4,
          boxShadow:
            "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
          backgroundColor: "#fff",
          maxHeight: 400,
          overflowY: "auto",
        }}
        aria-live="polite"
        aria-relevant="additions removals"
      >
        {charactersList}
      </ul>
    </div>
  );
};

const App: React.FC = () => (
  <ErrorBoundary>
    <CharacterList />
  </ErrorBoundary>
);

export default App;
```


### Tokens: {'input_tokens': 571, 'output_tokens': 1557, 'reasoning_tokens': 0}
### Execution time: 13.918100833892822
