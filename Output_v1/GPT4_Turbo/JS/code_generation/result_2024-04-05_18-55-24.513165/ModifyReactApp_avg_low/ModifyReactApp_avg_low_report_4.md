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

## Run 4:
### Answer:
To add a character search functionality and optimize it efficiently, we'll introduce a search input field to filter the characters. We'll also implement a debounce mechanism to avoid overloading the backend with requests as the user types. Here's how you can modify the `CharacterList` component to include these features:

```tsx
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

interface Character {
    name: string;
    url: string;
}

const CharacterList: React.FC = () => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    const debounce = (func: Function, delay: number) => {
        let timer: NodeJS.Timeout;
        return function (...args: any) {
            clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, delay);
        };
    };

    const fetchCharacters = useCallback(async (query: string) => {
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
        const debouncedFetch = debounce(fetchCharacters, 500);
        debouncedFetch(searchTerm);
    }, [searchTerm, fetchCharacters]);

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

This code introduces a search input field that updates the `searchTerm` state on change. The `useEffect` hook listens for changes to `searchTerm` and triggers the `fetchCharacters` function with a debounce of 500 milliseconds. This means the API request will only be sent if the user stops typing for half a second, reducing the number of requests sent to the backend. The `fetchCharacters` function is wrapped in a `useCallback` hook to ensure it doesn't get recreated on every render, which is important for the debounce function to work correctly.
### Tokens: {'prompt_tokens': 371, 'completion_tokens': 550, 'total_tokens': 921}
### Execution time: 34.86507177352905
