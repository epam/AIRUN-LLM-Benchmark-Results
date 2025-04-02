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
import React, {useEffect, useState, useCallback} from 'react';
import axios from 'axios';

interface Character {
    name: string;
    url: string;
}

const CharacterList: React.FC = () => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchResults, setSearchResults] = useState<Character[]>([]);
    const [searchLoading, setSearchLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [noResults, setNoResults] = useState<boolean>(false);

    const fetchCharacters = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('https://swapi.dev/api/people');
            setCharacters(response.data.results);
            setSearchResults(response.data.results); // Initialize searchResults with all characters
            setNoResults(response.data.results.length === 0);
        } catch (e: any) {
            console.error('Failed to fetch characters:', e);
            setError('Failed to load characters. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCharacters();
    }, [fetchCharacters]);

    const handleSearch = useCallback(async (query: string) => {
        if (!query.trim()) {
            setSearchResults(characters); // Reset to all characters if search query is empty
            setNoResults(characters.length === 0);
            return;
        }

        setSearchLoading(true);
        setError(null);
        setNoResults(false);
        try {
            const response = await axios.get(`https://swapi.dev/api/people/?search=${query}`);
            setSearchResults(response.data.results);
            setNoResults(response.data.results.length === 0);
        } catch (e: any) {
            console.error('Failed to search characters:', e);
            setError('Failed to search characters. Please try again later.');
            setSearchResults([]);
            setNoResults(true);
        } finally {
            setSearchLoading(false);
        }
    }, [characters]);

    // Debounce search input
    const debouncedSearch = useCallback(
        debounce((query) => {
            handleSearch(query);
        }, 500),
        [handleSearch]
    );

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setSearchQuery(query);
        debouncedSearch(query);
    };

    if (loading) return <div>Loading characters...</div>;
    if (error) return <div>Error: {error}</div>;

    const charactersToDisplay = searchQuery ? searchResults : characters;
    const displayNoResults = searchQuery && noResults && !searchLoading && !error;

    return (
        <div>
            <input
                type="text"
                placeholder="Search characters..."
                value={searchQuery}
                onChange={handleInputChange}
            />

            {searchLoading && <div>Searching characters...</div>}
            {displayNoResults && <div>No characters found matching your search.</div>}

            <ul>
                {charactersToDisplay.map((character) => (
                    <li key={character.url}>{character.name}</li>
                ))}
            </ul>
        </div>
    );
};

// Debounce function
function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null;
    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func(...args);
        };
        clearTimeout(timeout as NodeJS.Timeout);
        timeout = setTimeout(later, wait);
    };
}


export default CharacterList;
```

### Tokens: {'input_tokens': 614, 'output_tokens': 952}
### Execution time: 9.151283025741577
