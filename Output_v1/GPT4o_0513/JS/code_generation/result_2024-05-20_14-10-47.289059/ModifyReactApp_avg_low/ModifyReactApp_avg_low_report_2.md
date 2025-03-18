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

## Run 2:
### Answer:
To add a character search functionality and optimize the application to avoid overloading the backend with requests, we can implement a debounced search input. This will ensure that we only send a request after the user has stopped typing for a certain period of time. Here's the updated code:

index.tsx
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

    useEffect(() => {
        fetchCharacters();
    }, []);

    const debouncedFetchCharacters = useCallback(
        debounce((query: string) => {
            fetchCharacters(query);
        }, 500),
        []
    );

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setSearchTerm(query);
        debouncedFetchCharacters(query);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search characters"
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

In this updated code:
1. We added a search input field to allow users to search for characters.
2. We used the `useState` hook to manage the search term.
3. We used the `useCallback` hook along with `lodash.debounce` to debounce the search input, ensuring that we only send a request after the user has stopped typing for 500 milliseconds.
4. We updated the `fetchCharacters` function to accept a query parameter and send it as a search parameter in the API request.
5. We updated the `useEffect` hook to fetch characters with an empty search term on the initial render.
6. We added a `handleSearchChange` function to handle changes in the search input and trigger the debounced fetch function.

### Tokens: {'input_tokens': 379, 'output_tokens': 587}
### Execution time: 8.394922018051147
