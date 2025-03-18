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
To add a character search functionality and optimize the code to avoid overloading the backend with requests, we can implement the following changes:

1. Add a search input field.
2. Use a debouncing technique to prevent sending too many requests while the user is typing.
3. Send an initial request with an empty search query.
4. Display a loader while fetching data.

Here’s the updated code:

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
        debouncedFetchCharacters(searchTerm);
    }, [searchTerm, debouncedFetchCharacters]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
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

### Key Changes:
1. **Search Input**: Added an input field to allow users to search for characters.
2. **Debouncing**: Used `lodash.debounce` to delay the API request until the user stops typing for 500ms, preventing excessive requests.
3. **Initial Fetch**: The `useEffect` hook triggers the initial fetch with an empty search query.
4. **Loader**: The loader is displayed while the data is being fetched.

This approach ensures that the backend is not overloaded with requests and provides a smooth user experience.

### Tokens: {'input_tokens': 379, 'output_tokens': 566, 'reasoning_tokens': 0}
### Execution time: 6.2768919467926025
