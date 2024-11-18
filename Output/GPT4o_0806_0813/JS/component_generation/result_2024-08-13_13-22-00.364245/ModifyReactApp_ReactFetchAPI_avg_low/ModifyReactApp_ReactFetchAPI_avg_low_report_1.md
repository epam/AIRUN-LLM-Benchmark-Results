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
To add a character search functionality and optimize the application to avoid overloading the backend with requests, we can implement a search input with a debounced effect. This will ensure that we only send a request after the user has stopped typing for a certain period of time. Here's how you can modify the code:

```tsx
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

interface Character {
    name: string;
    url: string;
}

const CharacterList: React.FC = () => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');

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
        const handler = setTimeout(() => {
            fetchCharacters(searchTerm);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm, fetchCharacters]);

    useEffect(() => {
        fetchCharacters('');
    }, [fetchCharacters]);

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

### Key Changes:
1. **State Management**: Added a `searchTerm` state to keep track of the user's input.
2. **Debounced Search**: Used a `setTimeout` in the `useEffect` to delay the API call until the user stops typing for 500 milliseconds.
3. **Callback for Fetching**: Wrapped the `fetchCharacters` function in a `useCallback` to prevent unnecessary re-creations of the function.
4. **Initial Fetch**: On initial render, the component fetches all characters by calling `fetchCharacters` with an empty string.
5. **Search Input**: Added an input field to allow users to type in their search query.

This implementation ensures that the application is efficient and does not overload the backend with requests while providing a responsive search experience.

### Tokens: {'input_tokens': 379, 'output_tokens': 591}
### Execution time: 7.783905982971191
