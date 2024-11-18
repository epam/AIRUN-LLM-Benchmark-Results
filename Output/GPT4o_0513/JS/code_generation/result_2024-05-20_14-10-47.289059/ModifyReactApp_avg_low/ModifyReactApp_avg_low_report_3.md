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

## Run 3:
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

    const debouncedFetchCharacters = useCallback(
        debounce((query: string) => {
            fetchCharacters(query);
        }, 500),
        []
    );

    useEffect(() => {
        fetchCharacters();
    }, []);

    useEffect(() => {
        debouncedFetchCharacters(searchTerm);
    }, [searchTerm, debouncedFetchCharacters]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <input
                type="text"
                placeholder="Search characters"
                value={searchTerm}
                onChange={handleSearchChange}
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

### Explanation:
1. **State Management**:
   - Added `searchTerm` state to keep track of the search input value.

2. **Fetching Data**:
   - Modified `fetchCharacters` to accept a query parameter and use it in the API request.
   - Used `axios.get` with `params` to include the search term in the request.

3. **Debouncing**:
   - Used `lodash.debounce` to create a debounced version of the `fetchCharacters` function.
   - The debounced function is called whenever `searchTerm` changes, ensuring that we only send a request after the user has stopped typing for 500 milliseconds.

4. **Effect Hooks**:
   - The initial fetch is done in the first `useEffect` with an empty search term.
   - The second `useEffect` watches for changes in `searchTerm` and calls the debounced fetch function.

5. **Search Input**:
   - Added an input field to capture the search term and update the state accordingly.

This implementation ensures that the backend is not overloaded with requests and provides a smooth user experience with a debounced search input.

### Tokens: {'input_tokens': 379, 'output_tokens': 676}
### Execution time: 12.38981318473816
