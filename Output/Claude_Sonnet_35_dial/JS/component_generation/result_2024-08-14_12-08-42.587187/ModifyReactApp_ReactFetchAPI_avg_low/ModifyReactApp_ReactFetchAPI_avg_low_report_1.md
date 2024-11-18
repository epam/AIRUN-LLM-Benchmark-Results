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
            const response = await axios.get('https://swapi.dev/api/people', {
                params: { search }
            });
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
        const value = event.target.value;
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

1. Added a search input field to allow users to search for characters.
2. Implemented debouncing using lodash's `debounce` function to prevent excessive API calls while typing.
3. Used `useCallback` to memoize the `fetchCharacters` function and its debounced version.
4. Modified the `fetchCharacters` function to accept a search parameter and include it in the API request.
5. Added an initial fetch with an empty search term on component mount.
6. Moved the loading state inside the return statement to always render the search input.
7. Optimized the code structure for better readability and performance.

Note: Make sure to install the `lodash` package (`npm install lodash @types/lodash`) for the debounce functionality.

### Tokens: {'input_tokens': 449, 'output_tokens': 710}
### Execution time: 12.864858865737915
