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
To implement the character search functionality with efficient backend interaction and a robust user experience, we'll modify the `CharacterList` component.

Here's a breakdown of the changes and why they are made:

1.  **State Management:**
    *   `searchTerm`: A new state variable to hold the user's input in the search field.
    *   `error`: A new state variable to store any error messages from API requests.

2.  **Debouncing:**
    *   We use `setTimeout` and `clearTimeout` within a `useEffect` hook to debounce the API calls. This ensures that the API request is only sent after the user has paused typing for a specified duration (e.g., 500ms), preventing an overload of requests to the SWAPI backend.
    *   `debounceTimeoutRef`: A `useRef` is used to store the ID of the `setTimeout` timer. This allows us to clear the previous timer if the user types again before the debounce period ends.

3.  **API Integration:**
    *   The `useEffect` hook now depends on `searchTerm`.
    *   Inside the debounced function, `axios.get` is called with the `search` query parameter if `searchTerm` is not empty. If `searchTerm` is empty, it fetches all characters (the default behavior of SWAPI's `/people` endpoint).
    *   Error handling is added using a `try-catch` block. If an error occurs, the `error` state is updated, and `characters` are cleared.

4.  **User Interface:**
    *   An `<input type="text" />` field is added for the search query.
    *   The `loading` indicator is displayed during API requests (including the initial load and subsequent searches).
    *   An error message is displayed if `error` state is not null.
    *   A "No characters found" message is displayed when the search yields no results.
    *   Basic inline styles are added for responsiveness and better visual feedback.

5.  **TypeScript:**
    *   All new state variables and `useRef` are properly typed.
    *   The `Character` interface remains, ensuring strict typing for character data.

```tsx
// index.tsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';

// Define the Character interface for type safety
interface Character {
    name: string;
    url: string; // Using URL as a unique key for list items
}

// Define the structure of the SWAPI people response
interface SwapiPeopleResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Character[];
}

const CharacterList: React.FC = () => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    // useRef to store the debounce timeout ID
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // useCallback to memoize the fetch function, though its primary benefit here
    // is to prevent unnecessary re-creation if it were passed to a child component.
    // For an internal effect dependency, it's less critical but good practice.
    const fetchCharacters = useCallback(async (query: string) => {
        setLoading(true);
        setError(null); // Clear any previous errors

        try {
            const apiUrl = `https://swapi.dev/api/people${query ? `?search=${query}` : ''}`;
            const response = await axios.get<SwapiPeopleResponse>(apiUrl);
            setCharacters(response.data.results);
        } catch (err) {
            console.error('Failed to fetch characters:', err);
            setError('Failed to fetch characters. Please try again later.');
            setCharacters([]); // Clear characters on error
        } finally {
            setLoading(false);
        }
    }, []); // No dependencies, as query is passed as an argument

    // Effect for debounced search
    useEffect(() => {
        // Clear previous timeout if it exists
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        // Set a new timeout
        debounceTimeoutRef.current = setTimeout(() => {
            fetchCharacters(searchTerm);
        }, 500); // Debounce for 500ms

        // Cleanup function: clear timeout if component unmounts or effect re-runs
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [searchTerm, fetchCharacters]); // Re-run effect when searchTerm or fetchCharacters changes

    // Handler for search input changes
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ textAlign: 'center', color: '#333' }}>Star Wars Characters</h1>

            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Search characters by name..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={{
                        width: '100%',
                        padding: '10px',
                        fontSize: '16px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        boxSizing: 'border-box' // Ensures padding doesn't increase total width
                    }}
                />
            </div>

            {loading && <div style={{ textAlign: 'center', color: '#555' }}>Loading...</div>}

            {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</div>}

            {!loading && !error && characters.length === 0 && (
                <div style={{ textAlign: 'center', color: '#777' }}>No characters found.</div>
            )}

            {!loading && !error && characters.length > 0 && (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {characters.map((character) => (
                        <li
                            key={character.url} // SWAPI URLs are unique for each character
                            style={{
                                padding: '10px 0',
                                borderBottom: '1px dashed #eee',
                                fontSize: '18px',
                                color: '#444'
                            }}
                        >
                            {character.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CharacterList;
```

### Tokens: {'input_tokens': 610, 'output_tokens': 3592, 'reasoning_tokens': 1395}
### Execution time: 15.604136943817139
