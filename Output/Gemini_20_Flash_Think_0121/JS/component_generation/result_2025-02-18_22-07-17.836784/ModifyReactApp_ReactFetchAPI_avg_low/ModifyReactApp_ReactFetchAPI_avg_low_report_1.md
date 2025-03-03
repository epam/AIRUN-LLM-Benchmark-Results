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
```tsx
import React, {useEffect, useState, useCallback } from 'react';
import axios from 'axios';

interface Character {
    name: string;
    url: string;
}

const CharacterList: React.FC = () => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [search, setSearch] = useState<string>('');

    const fetchCharacters = useCallback(async (searchTerm: string) => {
        setLoading(true);
        try {
            const params = searchTerm ? { search: searchTerm } : {};
            const response = await axios.get('https://swapi.dev/api/people', { params });
            setCharacters(response.data.results);
        } catch (error) {
            console.error('Failed to fetch characters:', error);
            setCharacters([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCharacters('');
    }, [fetchCharacters]);

    const debouncedFetchCharacters = useCallback(
        debounce((searchTerm) => fetchCharacters(searchTerm), 300),
        [fetchCharacters]
    );

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = event.target.value;
        setSearch(searchTerm);
        debouncedFetchCharacters(searchTerm);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <input
                type="text"
                placeholder="Search characters"
                value={search}
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

function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null;
    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func(...args);
        };
        clearTimeout(timeout!);
        timeout = setTimeout(later, wait);
    };
}

export default CharacterList;
```

### Tokens: {'input_tokens': 416, 'output_tokens': 530}
### Execution time: 8.87219786643982
