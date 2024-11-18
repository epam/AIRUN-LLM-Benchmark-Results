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
Here's an optimized version of the React component with character search functionality:

```tsx
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import debounce from 'lodash/debounce';

interface Character {
    name: string;
    url: string;
}

interface ApiResponse {
    results: Character[];
    count: number;
}

const CharacterList: React.FC = () => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const fetchCharacters = useCallback(async (search: string = '') => {
        setLoading(true);
        try {
            const response = await axios.get<ApiResponse>('https://swapi.dev/api/people', {
                params: { search }
            });
            setCharacters(response.data.results);
        } catch (error) {
            console.error('Failed to fetch characters:', error);
            setCharacters([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const debouncedSearch = useMemo(
        () => debounce((search: string) => fetchCharacters(search), 300),
        [fetchCharacters]
    );

    useEffect(() => {
        fetchCharacters();

        return () => {
            debouncedSearch.cancel();
        };
    }, [fetchCharacters, debouncedSearch]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    const filteredCharacters = useMemo(() => {
        return characters.filter(character => 
            character.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [characters, searchTerm]);

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
                    {filteredCharacters.map((character) => (
                        <li key={character.url}>{character.name}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CharacterList;
```

Key improvements and optimizations:

1. Added search functionality with debounce to prevent excessive API calls
2. Used `useCallback` and `useMemo` for performance optimization
3. Implemented search with both client-side filtering and server-side search
4. Added type safety with TypeScript interfaces
5. Handled loading state more comprehensively
6. Used lodash's debounce to limit search request frequency
7. Added input field for searching characters
8. Cleaned up debounce on component unmount
9. Filtered characters both on the server and client-side

Note: You'll need to install lodash types:
```bash
npm install lodash @types/lodash
```

This implementation provides an efficient, performant solution for searching Star Wars characters with minimal backend load and smooth user experience.

### Tokens: {'input_tokens': 449, 'output_tokens': 815}
### Execution time: 13.320903062820435
