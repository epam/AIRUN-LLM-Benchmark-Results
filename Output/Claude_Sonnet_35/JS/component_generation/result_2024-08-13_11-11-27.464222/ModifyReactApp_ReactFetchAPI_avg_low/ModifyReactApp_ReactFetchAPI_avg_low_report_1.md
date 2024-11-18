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
Here's the modified version of the code with the added character search functionality and optimizations:

```tsx
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash/debounce';

interface Character {
    name: string;
    url: string;
}

const CharacterList: React.FC = () => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const fetchCharacters = useCallback(async (search: string) => {
        setLoading(true);
        try {
            const response = await axios.get(`https://swapi.dev/api/people/?search=${search}`);
            setCharacters(response.data.results);
        } catch (error) {
            console.error('Failed to fetch characters:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const debouncedFetchCharacters = useCallback(
        debounce((search: string) => fetchCharacters(search), 300),
        [fetchCharacters]
    );

    useEffect(() => {
        fetchCharacters('');
    }, [fetchCharacters]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchTerm(value);
        debouncedFetchCharacters(value);
    };

    return (
        <div>
            <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search characters..."
            />
            {loading ? (
                <div>Loading...</div>
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

This modified version includes the following changes and optimizations:

1. Added a search input field and state to manage the search term.
2. Implemented a debounced search function using lodash's `debounce` to prevent excessive API calls.
3. Modified the `fetchCharacters` function to accept a search parameter.
4. Used `useCallback` to memoize the `fetchCharacters` and `debouncedFetchCharacters` functions.
5. Updated the initial `useEffect` to fetch characters with an empty search on the initial render.
6. Implemented the `handleSearchChange` function to update the search term and trigger the debounced search.
7. Moved the loading check inside the JSX to always display the search input.

These changes provide an efficient character search functionality while optimizing API calls and component rendering.

### Tokens: {'input_tokens': 449, 'output_tokens': 704}
### Execution time: 8.906737089157104
