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
I'll implement the character search functionality with all the specified requirements, focusing on performance optimization using debouncing for search requests, proper TypeScript typing, and a responsive UI.

```tsx
// CharacterList.tsx
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios, { AxiosError } from 'axios';
import { debounce } from 'lodash';

interface Character {
  name: string;
  url: string;
}

interface ApiResponse {
  results: Character[];
  count: number;
}

const CharacterList: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Debounced search function to prevent excessive API calls
  const debouncedSearch = useMemo(
    () =>
      debounce(async (query: string) => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get<ApiResponse>(
            `https://swapi.dev/api/people${query ? `/?search=${encodeURIComponent(query)}` : ''}`
          );
          setCharacters(response.data.results);
        } catch (err) {
          const axiosError = err as AxiosError;
          setError(
            axiosError.response?.status === 404
              ? 'No characters found matching your search.'
              : 'Failed to fetch characters. Please try again.'
          );
          setCharacters([]);
        } finally {
          setLoading(false);
        }
      }, 500),
    []
  );

  // Handle search input changes
  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newQuery = event.target.value;
      setSearchQuery(newQuery);
      debouncedSearch(newQuery);
    },
    [debouncedSearch]
  );

  // Initial data load on component mount
  useEffect(() => {
    debouncedSearch('');
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Memoized rendering of character list
  const characterList = useMemo(() => {
    return characters.map((character) => (
      <li
        key={character.url}
        className="py-2 px-4 hover:bg-gray-100 transition-colors duration-200"
      >
        {character.name}
      </li>
    ));
  }, [characters]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Star Wars Characters</h1>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search characters..."
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Search characters"
        />
      </div>

      {loading && (
        <div className="text-center py-4 text-gray-500">Loading...</div>
      )}

      {!loading && error && (
        <div className="text-center py-4 text-red-500" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && characters.length === 0 && searchQuery && (
        <div className="text-center py-4 text-gray-500" role="status">
          No characters found matching "{searchQuery}"
        </div>
      )}

      {!loading && !error && characters.length > 0 && (
        <ul className="bg-white rounded-lg shadow-md divide-y">
          {characterList}
        </ul>
      )}
    </div>
  );
};

// Error Boundary Component
class CharacterListErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-4 text-red-500">
          Something went wrong. Please refresh the page.
        </div>
      );
    }
    return this.props.children;
  }
}

// Wrap the component with Error Boundary
const WrappedCharacterList: React.FC = () => (
  <CharacterListErrorBoundary>
    <CharacterList />
  </CharacterListErrorBoundary>
);

export default WrappedCharacterList;
```

### Implementation Explanation:

1. **Search Functionality & Performance Optimization**:
   - Implemented a debounced search using `lodash.debounce` to limit API calls to once every 500ms, preventing backend overload.
   - Used `useMemo` for the debounced function and character list rendering to avoid unnecessary re-renders.
   - Applied `useCallback` for the search handler to maintain stable function references.

2. **API Integration**:
   - Maintained `axios` for HTTP requests with proper TypeScript typing for responses.
   - Initial empty search query is sent on component mount.
   - Search queries are formatted according to SWAPI specifications using `encodeURIComponent`.
   - Error handling includes specific messages for 404 (no results) and generic errors, with user feedback.

3. **User Interface**:
   - Added a responsive search input with Tailwind CSS for styling, ensuring accessibility with ARIA labels.
   - Displayed loading states, error messages, and "no results" feedback dynamically.
   - Results update as the user types, with hover effects for better UX.
   - Responsive design centers content with `max-w-2xl` and adapts to different screen sizes.

4. **Technical Implementation**:
   - Full TypeScript typing for state, API responses, and event handlers.
   - Proper state management for search query, loading, and error states.
   - Performance optimizations with memoization techniques.
   - Clean-up of debounced function on component unmount to prevent memory leaks.

5. **Code Quality**:
   - Production-ready code with no TODOs or commented-out sections.
   - Followed React best practices (hooks usage, component structure).
   - Implemented an error boundary to catch unexpected runtime errors.
   - Clear, maintainable structure with consistent styling using Tailwind CSS.

### Assumptions:
- The `lodash` library is available in the project for debouncing. If not, it can be installed via `npm install lodash`.
- Tailwind CSS is configured in the project for styling. If not, the classes can be replaced with custom CSS or another styling solution.
- The SWAPI endpoint (`https://swapi.dev/api/people`) is reliable for this implementation, though in production, additional error handling for rate limits might be needed.

This implementation provides a robust, user-friendly, and performant search feature for the Star Wars character list while adhering to all specified requirements.

### Tokens: {'input_tokens': 562, 'output_tokens': 1467, 'reasoning_tokens': 0}
### Execution time: 19.248428106307983
