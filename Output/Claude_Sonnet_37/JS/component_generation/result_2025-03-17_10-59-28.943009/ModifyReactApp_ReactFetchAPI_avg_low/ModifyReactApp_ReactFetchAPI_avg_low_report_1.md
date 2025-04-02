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
# Character Search Implementation for Star Wars API

I'll implement a search functionality for the Star Wars characters application with proper optimization to avoid overloading the backend.

Here's the updated code:

```tsx
// index.tsx
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import './styles.css';

interface Character {
  name: string;
  url: string;
}

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Character[];
}

const CharacterList: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const fetchCharacters = useCallback(async (query: string = '') => {
    setLoading(true);
    setError(null);
    
    try {
      const url = `https://swapi.dev/api/people${query ? `?search=${query}` : ''}`;
      const response = await axios.get<ApiResponse>(url);
      setCharacters(response.data.results);
    } catch (error) {
      console.error('Failed to fetch characters:', error);
      setError('Failed to fetch characters. Please try again later.');
      setCharacters([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);

  // Debounced search function to prevent excessive API calls
  const debouncedSearch = useMemo(
    () =>
      debounce((query: string) => {
        fetchCharacters(query);
      }, 500),
    [fetchCharacters]
  );

  // Clean up debounce on component unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  return (
    <div className="character-list-container">
      <h1>Star Wars Characters</h1>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search characters..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
          aria-label="Search characters"
        />
        {loading && <div className="search-indicator">Searching...</div>}
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {!loading && characters.length === 0 && !error && (
        <div className="no-results">No characters found. Try a different search term.</div>
      )}
      
      {!loading && characters.length > 0 && (
        <ul className="character-list">
          {characters.map((character) => (
            <li key={character.url} className="character-item">
              {character.name}
            </li>
          ))}
        </ul>
      )}
      
      {loading && !searchQuery && <div className="loading">Loading characters...</div>}
    </div>
  );
};

export default CharacterList;
```

And here's a CSS file to style the components:

```css
/* styles.css */
.character-list-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

h1 {
  color: #333;
  text-align: center;
  margin-bottom: 30px;
}

.search-container {
  position: relative;
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 12px 15px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: border-color 0.3s, box-shadow 0.3s;
}

.search-input:focus {
  border-color: #0066cc;
  box-shadow: 0 2px 8px rgba(0, 102, 204, 0.2);
  outline: none;
}

.search-indicator {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  font-size: 14px;
}

.character-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.character-item {
  padding: 15px;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
}

.character-item:hover {
  background-color: #f9f9f9;
}

.loading, .no-results, .error-message {
  text-align: center;
  padding: 20px;
  color: #666;
}

.error-message {
  color: #d32f2f;
  background-color: #ffebee;
  border-radius: 4px;
  padding: 15px;
}

@media (max-width: 600px) {
  .character-list-container {
    padding: 15px;
  }
  
  .search-input {
    padding: 10px;
    font-size: 14px;
  }
  
  .character-item {
    padding: 12px;
  }
}
```

## Implementation Details

### Search Functionality
- Added a search input field that filters characters by name
- Implemented debouncing using `lodash.debounce` to prevent excessive API calls
- Set a 500ms delay before triggering a search request

### API Integration
- Continued using axios for API requests
- Added proper URL formatting for search queries using the SWAPI search parameter
- Implemented comprehensive error handling with user feedback
- Added proper TypeScript interfaces for API responses

### User Interface
- Added a loading indicator during API requests
- Implemented dynamic search results that update as users type
- Added visual feedback when no results are found
- Created responsive design with CSS for all screen sizes

### Technical Implementation
- Used TypeScript with proper type definitions throughout
- Implemented proper state management for search queries and results
- Applied performance optimizations:
  - `useCallback` for the fetch function to prevent unnecessary re-renders
  - `useMemo` for the debounced search function
  - Cleanup for the debounce function on component unmount

### Code Quality
- Followed React best practices and patterns
- Ensured all components are properly typed
- Implemented error handling with user-friendly messages
- Created clean, production-ready code with no TODOs or commented-out sections

This implementation efficiently searches the Star Wars API while providing a smooth user experience and preventing excessive API calls.

### Tokens: {'input_tokens': 658, 'output_tokens': 1866}
### Execution time: 25.331920862197876
