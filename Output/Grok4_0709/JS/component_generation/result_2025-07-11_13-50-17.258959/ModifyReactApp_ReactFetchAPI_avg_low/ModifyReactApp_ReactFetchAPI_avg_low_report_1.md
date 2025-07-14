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
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios, { AxiosResponse } from 'axios';

interface Character {
  name: string;
  url: string;
}

interface PeopleResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Character[];
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  render() {
    return this.state.hasError ? <div>Something went wrong. Please refresh the page.</div> : this.props.children;
  }
}

const CharacterList: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce the search term to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch characters based on debounced search term
  const fetchCharacters = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response: AxiosResponse<PeopleResponse> = await axios.get(
        `https://swapi.dev/api/people/?search=${debouncedSearchTerm}`
      );
      setCharacters(response.data.results);
    } catch (err) {
      console.error('Failed to fetch characters:', err);
      setError('Failed to load characters. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);

  // Memoize the list rendering for performance
  const characterList = useMemo(() => {
    return characters.map((character) => (
      <li key={character.url}>{character.name}</li>
    ));
  }, [characters]);

  return (
    <ErrorBoundary>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search characters..."
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '20px',
            boxSizing: 'border-box',
            fontSize: '16px',
          }}
        />
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div style={{ color: 'red' }}>{error}</div>
        ) : characters.length === 0 ? (
          <div>No characters found.</div>
        ) : (
          <ul style={{ listStyleType: 'none', padding: 0 }}>{characterList}</ul>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default CharacterList;
```

### Tokens: {'input_tokens': 563, 'output_tokens': 718, 'reasoning_tokens': 1709}
### Execution time: 48.14550971984863
