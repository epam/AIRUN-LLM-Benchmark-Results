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
To add a character search functionality and optimize the application to avoid overloading the backend with requests, we can implement a debounced search input. This will ensure that we only send a request after the user has stopped typing for a certain period of time. Here's the updated code:

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

    const fetchCharacters = async (query: string = '') => {
        setLoading(true);
        try {
            const response = await axios.get(`https://swapi.dev/api/people`, {
                params: { search: query }
            });
            setCharacters(response.data.results);
        } catch (error) {
            console.error('Failed to fetch characters:', error);
        } finally {
            setLoading(false);
        }
    };

    const debouncedFetchCharacters = useCallback(debounce(fetchCharacters, 500), []);

    useEffect(() => {
        debouncedFetchCharacters(searchTerm);
    }, [searchTerm, debouncedFetchCharacters]);

    useEffect(() => {
        fetchCharacters();
    }, []);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Search characters"
                value={searchTerm}
                onChange={handleSearchChange}
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

### Explanation:
1. **State Management**: Added `searchTerm` state to keep track of the search input value.
2. **Debounce**: Used `lodash.debounce` to create a debounced version of the `fetchCharacters` function to avoid sending too many requests.
3. **Effect Hooks**:
   - The first `useEffect` hook triggers the debounced fetch function whenever `searchTerm` changes.
   - The second `useEffect` hook fetches the characters on the initial render with an empty search term.
4. **Input Handling**: Added an input field to capture the search term and update the state accordingly.

This implementation ensures that the backend is not overloaded with requests by debouncing the search input.

### Tokens: {'input_tokens': 379, 'output_tokens': 582}
### Execution time: 8.70393705368042
