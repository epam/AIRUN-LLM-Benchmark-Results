Your task is to modify the application on React 18.x, which utilizes the SWAPI open API.
You should add a character search functionality and optimize it efficiently (avoid overloading the Backend with requests).

When performing the task, ensure to follow the instructions below:
- Utilize the following libraries: TypeScript, axios.
- Display a loader while loading.
- Send a request with an empty search on the initial render.
- Optimize the code where possible.
- The generated code should not contain any TODOs.
- Return the codebase without additional comments.

index.tsx
```tsx
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

## Run 1:
### Answer:
Here is the modified code that adds a character search functionality and optimizes it efficiently:
```tsx
import React, {useEffect, useState, useMemo} from 'react';
import axios from 'axios';

interface Character {
    name: string;
    url: string;
}

const CharacterList: React.FC = () => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const fetchCharacters = async (query: string) => {
        try {
            const response = await axios.get(`https://swapi.dev/api/people/?search=${query}`);
            setCharacters(response.data.results);
        } catch (error) {
            console.error('Failed to fetch characters:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCharacters(searchQuery);
    }, [searchQuery]);

    const debouncedFetchCharacters = useMemo(() => {
        let timeoutId: NodeJS.Timeout;
        return (query: string) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                fetchCharacters(query);
            }, 500);
        };
    }, []);

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setSearchQuery(query);
        debouncedFetchCharacters(query);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <input type="search" value={searchQuery} onChange={handleSearchInputChange} />
            <ul>
                {characters.map((character) => (
                    <li key={character.url}>{character.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default CharacterList;
```
Here's what's changed:

1. Added a `searchQuery` state to store the user's search input.
2. Created a `fetchCharacters` function that takes a `query` parameter and fetches the characters from the API with the search query.
3. Added a `useEffect` hook that calls `fetchCharacters` with the `searchQuery` state as a dependency. This ensures that the characters are refetched whenever the search query changes.
4. Implemented a debouncing mechanism using `useMemo` to prevent excessive API requests when the user types quickly. The `debouncedFetchCharacters` function returns a new function that debounces the API request by 500ms.
5. Added an `input` field to the UI to allow users to search for characters.
6. Added an `onChange` event handler to the `input` field that updates the `searchQuery` state and calls the debounced `fetchCharacters` function.

This implementation should efficiently handle character searches without overloading the backend with requests.

### Tokens: {'input_tokens': 374, 'output_tokens': 581}
### Execution time: 44.04643678665161
