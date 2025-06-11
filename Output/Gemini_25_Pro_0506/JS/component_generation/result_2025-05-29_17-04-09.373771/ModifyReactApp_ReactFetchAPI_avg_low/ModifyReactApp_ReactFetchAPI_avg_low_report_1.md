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
### Thoughts:
**Here's the plan to make this Star Wars character search component shine!**

First, I need to set up the foundation: I'll use `characters` to store the list of fetched characters, `loading` to show the user when I'm fetching data, and `error` to display any problems with the API call. I'll also add `searchTerm` to keep track of what the user types in the search box.

Next up is the search input. It's a simple `<input type="text">` that links its value to the `searchTerm` state. The `onChange` handler will update the `searchTerm` every time the user types.

Now for the API interactions. I'm going to modify the `useEffect` hook to fetch characters whenever `searchTerm` changes. To do this, I'll use the SWAPI endpoint and build the search query dynamically. Importantly, I'm starting with an empty search on component mount, which will fetch the initial list of characters.

To prevent overloading the backend, I'll debounce the search input. That means, wait a little bit after the user stops typing before making the API call. I'll use a `useDebounce` hook that I made myself.

When it comes to actually fetching the characters, the `fetchCharacters` function gets updated. It'll take the search term as an argument, set `loading` to `true`, clear previous errors, and then make the API call. If something goes wrong, I'll update the `error` state. I'll also always set `loading` to `false` when I'm done.

I need to make sure the UI is updated correctly. When `loading`, show a loading indicator. If there's an error, show an error message. If the search turns up nothing, then show "no results". And when the list of characters changes, the list re-renders automatically.

To ensure my code is top-notch, I'll use TypeScript to type everything properly. I'll also keep my code clean and follow React best practices, like using `useCallback` to optimize the performance of functions that are passed as props, or in the dependencies of `useEffect`.

**Here's the detailed plan I'm going to follow:**

**Phase 1: Get the Search Input Ready**

1.  I'll add the `searchTerm` state: `const [searchTerm, setSearchTerm] = useState<string>('');`
2.  I'll add the `error` state: `const [error, setError] = useState<string | null>(null);`
3.  Then the input field itself, like this:

```tsx
    <input
        type="text"
        placeholder="Search characters..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
    />
```

**Phase 2: Hooking up the `useEffect`**

1.  Make the `useEffect` respond to the `searchTerm`.
2.  Update the API URL in `fetchCharacters` with the search term.
3.  The empty initial query gets the first page of characters.

**Phase 3: Debounce it!**

1.  Create a `useDebounce` hook:

```typescript
    function useDebounce<T>(value: T, delay: number): T {
        const [debouncedValue, setDebouncedValue] = useState<T>(value);

        useEffect(() => {
            const handler = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);

            return () => {
                clearTimeout(handler);
            };
        }, [value, delay]);

        return debouncedValue;
    }
```

2.  Use the hook, like so: `const debouncedSearchTerm = useDebounce(searchTerm, 500);`
3.  Update the `useEffect` to trigger when `debouncedSearchTerm` changes.

**Phase 4: Refining Data Fetching and Error Handling**

1.  I'll make the `fetchCharacters` an async function that I will `useCallback` and put inside the `useEffect`.
2.  Set `setLoading(true)` at the start, and clear any prior errors.
3.  When the API call succeeds, show the characters. If there is an error, the `setError` state gets updated.
4.  Finally, `setLoading(false)` to let everyone know we're done.

**Phase 5: Making it Pretty**

1.  I'll display the error message.
    ```tsx
    {error && <div style={{ color: 'red' }}>{error}</div>}
    ```
2.  Also, display "No results

### Answer:
Okay, I've modified the `CharacterList` component to include the search functionality with optimizations and other requirements.

Here's the updated `index.tsx`:

```tsx
// index.tsx
import React, { useEffect, useState, useCallback, ChangeEvent } from 'react';
import axios, { AxiosError } from 'axios';

// Interface for a single character
interface Character {
    name: string;
    url: string; // SWAPI uses URLs as unique identifiers, suitable for keys
}

// Interface for the SWAPI people API response structure
interface SwapiPeopleResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Character[];
}

// Custom hook for debouncing a value.
// This hook delays updating its output value until a certain amount of time has passed
// without the input value changing, which is useful for rate-limiting operations
// like API calls based on user input.
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Set up a timer to update the debounced value after the specified delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Clean up the timer if the input value changes before the delay has passed,
        // or if the component unmounts. This prevents updating the debounced value
        // prematurely or after unmount.
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]); // Re-run this effect if the input value or the delay changes

    return debouncedValue;
}

const CharacterList: React.FC = () => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Start in loading state for the initial fetch
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Debounce the search term to prevent API calls on every keystroke
    const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay

    // Memoized function to fetch characters from SWAPI.
    // useCallback ensures this function reference remains stable unless its dependencies change.
    // Here, it has no dependencies from the component scope, so it's created once.
    const fetchCharacters = useCallback(async (currentSearchTerm: string) => {
        setLoading(true);
        setError(null); // Clear any previous errors before a new request
        try {
            // Construct the API URL with the search term.
            // encodeURIComponent ensures the search term is properly formatted for a URL.
            const apiUrl = `https://swapi.dev/api/people/?search=${encodeURIComponent(currentSearchTerm)}`;
            const response = await axios.get<SwapiPeopleResponse>(apiUrl);
            setCharacters(response.data.results);
        } catch (err) {
            console.error('Failed to fetch characters:', err); // Log the error for debugging

            // Set a user-friendly error message based on the error type
            if (axios.isAxiosError(err)) {
                setError(`API Error: ${err.message}. Please check your connection or try again later.`);
            } else if (err instanceof Error) {
                setError(`An unexpected error occurred: ${err.message}.`);
            } else {
                setError('An unknown error occurred. Please try again later.');
            }
            setCharacters([]); // Clear any existing characters from the list on error
        } finally {
            setLoading(false); // Ensure loading is set to false after the request completes or fails
        }
    }, []); // Empty dependency array: fetchCharacters itself doesn't depend on component state/props

    // useEffect hook to trigger fetching characters.
    // It runs when the component mounts (due to initial debouncedSearchTerm)
    // and whenever debouncedSearchTerm changes.
    useEffect(() => {
        // The requirement "Send an initial empty search query on component mount" and
        // "Preserve initial data loading behavior" is met here.
        // On mount, debouncedSearchTerm is '', leading to a fetch of all (first page) characters.
        fetchCharacters(debouncedSearchTerm);
    }, [debouncedSearchTerm, fetchCharacters]); // Dependencies: re-run if search term or fetch function changes

    // Memoized event handler for the search input field.
    // useCallback ensures this handler function reference is stable.
    const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    }, []); // setSearchTerm from useState is stable, so no dependencies needed.

    // Inline styles for the component. In a larger application, these might be moved
    // to CSS Modules, a dedicated CSS file, or a CSS-in-JS library for better organization
    // and more advanced styling capabilities (like media queries).
    const styles: { [key: string]: React.CSSProperties } = {
        container: {
            padding: '20px',
            maxWidth: '800px',
            margin: '0 auto', // Center the container
            fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', // Modern font stack
        },
        searchInput: {
            width: '100%', // Full width of the container
            padding: '12px 15px',
            marginBottom: '20px',
            boxSizing: 'border-box', // Include padding and border in the element's total width and height
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '1rem', // Use rem for scalable font size
        },
        characterList: {
            listStyleType: 'none',
            padding: 0,
            margin: 0,
        },
        characterItem: {
            padding: '10px 0',
            borderBottom: '1px solid #eee',
            fontSize: '1.1rem',
        },
        characterItemLast: { // Style for the last item to remove its bottom border
            padding: '10px 0',
            fontSize: '1.1rem',
        },
        message: { // General style for informational messages
            padding: '15px',
            textAlign: 'center',
            color: '#333', // Darker gray for better readability
            fontSize: '1rem',
        },
        errorMessage: { // Style for error messages
            padding: '15px',
            textAlign: 'center',
            color: '#D8000C', // Standard error red color
            backgroundColor: '#FFD2D2', // Light red background for emphasis
            border: '1px solid #D8000C',
            borderRadius: '4px',
            fontSize: '1rem',
            marginTop: '10px',
            marginBottom: '10px',
        },
        loadingMessage: { // Style for loading indicator text
            padding: '15px',
            textAlign: 'center',
            color: '#00529B', // Standard info blue color
            fontSize: '1rem',
        }
    };

    return (
        <div style={styles.container}>
            <input
                type="text"
                placeholder="Search Star Wars characters by name..."
                value={searchTerm}
                onChange={handleSearchChange}
                style={styles.searchInput}
                aria-label="Search Star Wars characters by name" // Accessibility: label for screen readers
            />

            {/* Display loading indicator when data is being fetched */}
            {loading && <div style={styles.loadingMessage}>Loading characters...</div>}

            {/* Display error message if an API error occurred */}
            {error && <div style={styles.errorMessage}>{error}</div>}

            {/* Display "no results" message if search yields no characters and not loading/error */}
            {!loading && !error && characters.length === 0 && debouncedSearchTerm !== '' && (
                <div style={styles.message}>No characters found matching "{debouncedSearchTerm}".</div>
            )}
            
            {/* Display message if initial load (empty search) returns no characters,
                and it's not due to an error or active loading. */}
            {!loading && !error && characters.length === 0 && debouncedSearchTerm === '' && (
                 <div style={styles.message}>No characters to display. You can try searching for a character.</div>
            )}

            {/* Display the list of characters if available and not loading/error */}
            {!loading && !error && characters.length > 0 && (
                <ul style={styles.characterList}>
                    {characters.map((character, index) => (
                        <li 
                            key={character.url} // SWAPI URLs are unique and stable
                            style={index === characters.length - 1 ? styles.characterItemLast : styles.characterItem}
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

**Key changes and features:**

1.  **State Management:**
    *   `searchTerm`: Stores the current value of the search input.
    *   `error`: Stores API error messages for user feedback.
    *   Existing `characters` and `loading` states are utilized.

2.  **Search Input:**
    *   An `<input type="text">` field is added.
    *   Its `onChange` event updates the `searchTerm` state.

3.  **Debouncing:**
    *   A custom `useDebounce` hook is implemented. This hook takes the `searchTerm` and a delay (500ms) and returns `debouncedSearchTerm`.
    *   API requests are triggered based on `debouncedSearchTerm`, preventing requests on every keystroke and thus avoiding backend overload.

4.  **API Integration:**
    *   The `fetchCharacters` function is now memoized using `useCallback`.
    *   It constructs the API URL using `https://swapi.dev/api/people/?search=${encodeURIComponent(currentSearchTerm)}`.
    *   An initial empty search query (`search=`) is sent on component mount because `debouncedSearchTerm` is initially an empty string. This preserves the initial data loading behavior.
    *   API errors are caught, and a user-friendly message is set in the `error` state. `axios.isAxiosError` is used for more specific error handling.

5.  **User Interface:**
    *   A loading message (`Loading characters...`) is displayed during API requests.
    *   Search results are displayed dynamically as the `characters` state updates.
    *   Basic responsive design is achieved through inline styles (e.g., `maxWidth` for the container, `width: 100%` for the input).
    *   Visual feedback is provided if no characters are found for a specific search term (`No characters found matching "..."`).
    *   A message is also shown if the initial load (empty search) results in no characters.

6.  **TypeScript and Typing:**
    *   Proper type definitions are used for states, props, API responses (`SwapiPeopleResponse`, `Character`), and function signatures.
    *   `axios.get<SwapiPeopleResponse>` ensures type safety for API responses.

7.  **Performance Optimizations:**
    *   `useDebounce` hook for efficient API calling.
    *   `useCallback` for `fetchCharacters` and `handleSearchChange` to memoize these functions and prevent unnecessary re-creations, optimizing re-renders.

8.  **Code Quality:**
    *   The code is clean, with comments explaining key parts.
    *   React best practices (functional components, hooks) are followed.
    *   Error handling is implemented within the component to provide feedback. A full Error Boundary component would typically wrap this component in a larger application structure.
    *   Accessibility is considered with an `aria-label` for the search input.

This solution addresses all the specified requirements, providing a functional, optimized, and user-friendly character search feature.

### Tokens: {'input_tokens': 610, 'output_tokens': 13050, 'reasoning_tokens': 10273}
### Execution time: 135.7515778541565
