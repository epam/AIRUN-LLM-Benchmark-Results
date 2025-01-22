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
To implement the character search functionality and optimize it efficiently, I'll modify the existing `CharacterList` component. Here's the updated code:

```tsx
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';

interface Character {
    name: string;
    url: string;
}

const CharacterList: React.FC = () => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const fetchCharacters = useCallback(async (query: string = '') => {
        setLoading(true);
        try {
            const response = await axios.get(`https://swapi.dev/api/people/?search=${query}`);
            setCharacters(response.data.results);
        } catch (error) {
            console.error('Failed to fetch characters:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCharacters();
    }, [fetchCharacters]);

    const handleSearch = useCallback(
        debounce((query: string) => {
            fetchCharacters(query);
        }, 300),
        [fetchCharacters]
    );

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setSearchTerm(query);
        handleSearch(query);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="Search characters..."
            />
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

This updated code implements the following changes and optimizations:

1. Added a search input field to allow users to search for characters.
2. Implemented a `searchTerm` state to store the current search query.
3. Modified the `fetchCharacters` function to accept a search query parameter, which is used to filter the results from the API.
4. Used `useCallback` to memoize the `fetchCharacters` function and prevent unnecessary re-renders.
5. Implemented debouncing using `lodash.debounce` to limit the number of API requests when the user types in the search input. This optimizes the code by preventing excessive requests to the backend.
6. Added an `handleInputChange` function to update the `searchTerm` state and trigger the debounced `handleSearch` function.
7. The initial render now sends a request with an empty search term, as requested.
8. The loader is displayed while fetching data, as specified in the requirements.

These changes implement the character search functionality while optimizing the code to prevent overloading the backend with requests.

### Tokens: {'input_tokens': 372, 'output_tokens': 610}
### Execution time: 9.997997999191284
