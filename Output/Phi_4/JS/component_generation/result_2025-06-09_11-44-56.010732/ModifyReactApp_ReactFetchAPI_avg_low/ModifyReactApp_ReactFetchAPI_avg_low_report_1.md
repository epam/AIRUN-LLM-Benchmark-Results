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
To implement the character search functionality in your React 18.x application while adhering to the specified requirements, we'll follow these steps:

1. **Add a Search Input Field**: We'll introduce a search input field to filter characters by name.
2. **Debounce Search Requests**: To avoid overloading the backend, we'll debounce the search input to limit the number of API requests.
3. **Preserve Initial Data Loading**: We'll ensure the initial data load behavior remains unchanged.
4. **Handle API Errors Gracefully**: We'll provide user feedback for any API errors.
5. **Implement UI Enhancements**: We'll add a loading indicator, handle no results, and ensure responsive design.

Here's the updated code:

```tsx
// index.tsx
import React, { useEffect, useState, ChangeEvent, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';

interface Character {
    name: string;
    url: string;
}

const CharacterList: React.FC = () => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const fetchCharacters = useCallback(async (query: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`https://swapi.dev/api/people/?search=${query}`);
            setCharacters(response.data.results);
        } catch (error) {
            setError('Failed to fetch characters. Please try again later.');
            console.error('Failed to fetch characters:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const debouncedFetchCharacters = debounce(fetchCharacters, 300);
        debouncedFetchCharacters(searchQuery);
        return () => debouncedFetchCharacters.cancel();
    }, [searchQuery, fetchCharacters]);

    useEffect(() => {
        fetchCharacters('');
    }, [fetchCharacters]);

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <input
                type="text"
                placeholder="Search characters..."
                value={searchQuery}
                onChange={handleSearchChange}
                style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
            />
            <ul>
                {characters.length > 0 ? (
                    characters.map((character) => (
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

### Key Points:

- **Debounce**: We use `lodash.debounce` to limit the frequency of API requests as the user types in the search input.
- **Error Handling**: Errors are caught and displayed to the user.
- **Loading Indicator**: A loading message is shown while fetching data.
- **Responsive Design**: The search input is styled to be responsive.
- **TypeScript**: Proper type definitions are used for state and props.

### Additional Considerations:

- **Error Boundaries**: For a production application, consider implementing error boundaries to catch and handle errors in the component tree.
- **Performance**: The use of `useCallback` and `debounce` helps optimize performance by preventing unnecessary re-renders and API calls.
- **Styling**: You can further enhance the UI with CSS or a styling library like Tailwind CSS for better responsiveness and aesthetics.

### Tokens: {'input_tokens': 558, 'output_tokens': 775}
### Execution time: 9.484235763549805
