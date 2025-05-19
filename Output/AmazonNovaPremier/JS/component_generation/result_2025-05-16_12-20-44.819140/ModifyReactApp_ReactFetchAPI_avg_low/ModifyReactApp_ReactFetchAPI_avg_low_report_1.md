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
To implement the character search functionality efficiently while adhering to the provided requirements, we can follow these steps:

1. **Add a search input field**: We'll add an input field to capture the user's search query.
2. **Debouncing**: To avoid overloading the backend, we'll implement debouncing for the search input.
3. **State Management**: We'll manage the search query and filtered results using React state.
4. **API Integration**: We'll update the API request to include the search query parameter.

Here's the updated code:

```tsx
// index.tsx
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';

interface Character {
    name: string;
    url: string;
}

const CharacterList: React.FC = () => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const fetchCharacters = useCallback(async (query: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`https://swapi.dev/api/people/?search=${query}`);
            setCharacters(response.data.results);
            setFilteredCharacters(response.data.results);
        } catch (err) {
            console.error('Failed to fetch characters:', err);
            setError('Failed to fetch characters. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    const debouncedFetchCharacters = useMemo(() => debounce(fetchCharacters, 300), [fetchCharacters]);

    useEffect(() => {
        debouncedFetchCharacters('');
        return () => {
            debouncedFetchCharacters.cancel();
        };
    }, [debouncedFetchCharacters]);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setSearchQuery(query);
        debouncedFetchCharacters(query);
    };

    const filteredResults = useMemo(() => {
        if (!searchQuery) return characters;
        return characters.filter(character => 
            character.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [characters, searchQuery]);

    return (
        <div>
            <input
                type="text"
                placeholder="Search characters..."
                value={searchQuery}
                onChange={handleSearch}
                style={{ marginBottom: '1rem', padding: '0.5rem', width: '100%', maxWidth: '400px' }}
            />
            {loading && <div>Loading...</div>}
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <ul>
                {filteredResults.length > 0 ? (
                    filteredResults.map((character) => (
                        <li key={character.url}>{character.name}</li>
                    ))
                ) : (
                    <li>No characters found</li>
                )}
            </ul>
        </div>
    );
};

export default CharacterList;
```

### Explanation:

1. **Search Input**: Added an input field to capture the search query.
2. **Debouncing**: Used `lodash.debounce` to limit the number of API calls.
3. **State Management**:
   - `searchQuery`: Holds the current search query.
   - `filteredCharacters`: Stores the characters filtered by the search query.
   - `error`: Manages any API errors.
4. **API Integration**: Updated the API request to include the search query parameter.
5. **UI Feedback**:
   - Display a loading indicator while fetching data.
   - Show an error message if the API call fails.
   - Display "No characters found" if there are no matching results.

This implementation ensures that the backend isn't overloaded with requests and provides a responsive and user-friendly search experience.

### Tokens: {'input_tokens': 657, 'output_tokens': 1056}
### Execution time: 17.851439952850342
