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
### Character Search Functionality Implementation

To implement the character search functionality, we will modify the existing `CharacterList` component to include a search input field. We will use the `useState` hook to store the search query and the `useCallback` hook with `useEffect` to handle the API requests efficiently.

#### Modified Code

```tsx
// index.tsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface Character {
  name: string;
  url: string;
}

interface ApiResponse {
  results: Character[];
  next: string | null;
  previous: string | null;
}

const CharacterList: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCharacters = useCallback(async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<ApiResponse>('https://swapi.dev/api/people', {
        params: { search: query },
      });
      setCharacters(response.data.results);
    } catch (error) {
      console.error('Failed to fetch characters:', error);
      setError('Failed to fetch characters. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCharacters(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, fetchCharacters]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="character-list-container">
      <input
        type="search"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search characters..."
        className="search-input"
      />
      {characters.length === 0 ? (
        <div>No characters found.</div>
      ) : (
        <ul>
          {characters.map((character) => (
            <li key={character.url}>{character.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CharacterList;
```

#### Explanation

1. **Search Functionality**:
   - We added a search input field and stored the search query in the component's state using `useState`.
   - We used `useCallback` to memoize the `fetchCharacters` function, which makes an API request to fetch characters based on the search query.
   - We implemented a debouncing mechanism using `setTimeout` and `clearTimeout` to avoid overloading the backend with requests. The API request is delayed by 500ms after the user stops typing.

2. **API Integration**:
   - We continued using `axios` for API requests.
   - We sent an initial empty search query on component mount by calling `fetchCharacters` with an empty string.
   - We formatted search requests according to the SWAPI specifications by passing the search query as a parameter to the API request.

3. **User Interface**:
   - We displayed a loading indicator during API requests using the `loading` state.
   - We showed search results dynamically as users type by updating the `characters` state with the API response.
   - We implemented a basic responsive design for the search component using CSS classes.
   - We provided visual feedback when no results are found by displaying a "No characters found." message.

4. **Technical Implementation**:
   - We used TypeScript with proper type definitions for all components and functions.
   - We maintained strict typing for API responses and component props.
   - We implemented proper state management for search queries and results using `useState`.
   - We applied performance optimizations using `useCallback` to memoize the `fetchCharacters` function.

5. **Code Quality Standards**:
   - We wrote clean, production-ready code without TODOs or commented-out code.
   - We followed React best practices and patterns.
   - We ensured all components are properly typed.
   - We did not implement error boundaries in this example, but it's recommended to add them in a real-world application to handle unexpected errors.

#### CSS for Responsive Design

You can add the following CSS to make the search component responsive:

```css
.character-list-container {
  max-width: 400px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.search-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.error-message {
  color: #red;
  font-weight: bold;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

li:last-child {
  border-bottom: none;
}
```

This CSS adds basic styling to the search component and makes it responsive. You can adjust the styles according to your requirements.

### Tokens: {'input_tokens': 570, 'output_tokens': 1188}
### Execution time: 10.517070055007935
