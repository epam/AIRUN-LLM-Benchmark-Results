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
            const response = await axios.get('https://swapi.dev/api/people', {
                params: { search: query }
            });
            setCharacters(response.data.results);
        } catch (error) {
            console.error('Failed to fetch characters:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCharacters('');
    }, [fetchCharacters]);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchTerm) {
                fetchCharacters(searchTerm);
            } else {
                fetchCharacters('');
            }
        }, 300);

        return () => clearTimeout(handler);
    }, [searchTerm, fetchCharacters]);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <input 
                type="text" 
                placeholder="Search characters..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
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

### Tokens: {'input_tokens': 379, 'output_tokens': 367, 'reasoning_tokens': 0}
### Execution time: 5.883073091506958
