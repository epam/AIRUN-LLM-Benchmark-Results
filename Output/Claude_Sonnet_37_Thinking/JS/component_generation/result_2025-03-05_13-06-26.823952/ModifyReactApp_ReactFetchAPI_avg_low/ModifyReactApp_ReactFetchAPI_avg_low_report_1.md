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
### Thoughts:
Let's modify the application to add the character search functionality and optimize it. I'll need to:

1. Add a search input field to the component
2. Handle input changes and trigger searches
3. Implement debouncing to avoid sending too many requests when typing
4. Show the loader during searches
5. Optimize the code

Here's my plan:

1. Add a state for search term
2. Implement a debounced search function using useCallback and useRef
3. Update the useEffect to depend on the debounced search term
4. Create a search input field in the UI
5. Make sure the loader appears during searches
6. Send an initial empty search on render

Let me start coding:

```tsx
import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';

interface Character {
    name: string;
    url: string;
}

const CharacterList: React.FC = () => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
    
    // Create a debounce timer ref
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    
    // Handle search input changes
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        
        // Clear previous timeout
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        
        // Set new debounce timer
        debounceTimerRef.current = setTimeout(() => {
            setDebouncedSearchTerm(value);
        }, 300); // 300ms debounce time
    };
    
    // Fetch characters based on search term
    useEffect(() => {
        const fetchCharacters = async () => {
            setLoading(true);
            try {
                const response = await axios.get('https://swapi.dev/api/people', {
                    params: {
                        search: debouncedSearchTerm
                    }
                });
                setCharacters(response.data.results);
            } catch (error) {
                console.error('Failed to fetch characters:', error);
                setCharacters([]);
            } finally {
                setLoading(false);
            }
        };
        
        fetchCharacters();
        
        // Cleanup function
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [debouncedSearchTerm]);
    
    return (
        <div>
            <input
                type="text"
                placeholder="Search characters..."
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

Actually, let me optimize this code a bit more. I can use the useCallback hook to memoize the fetchCharacters function and use custom hook for debouncing to make the code more reusable and cleaner:

```tsx
import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';

interface Character {
    name: string;
    url: string;
}

// Custom hook for debounced value
const useDebounce = <T,>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        
        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);
    
    return debouncedValue;
};

const CharacterList: React.FC = () => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    
    // Debounce the search term to avoid excessive API calls
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    
    // Memoize the fetch function to prevent unnecessary recreations
    const fetchCharacters = useCallback(async (search: string) => {
        setLoading(true);
        try {
            const response = await axios.get('https://swapi.dev/api/people', {
                params: {
                    search
                }
            });
            setCharacters(response.data.results);
        } catch (error) {
            console.error('Failed to fetch characters:', error);
            setCharacters([]);
        } finally {
            setLoading(false);
        }
    }, []);
    
    // Handle search input changes
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };
    
    // Effect for fetching characters when debounced search term changes
    useEffect(() => {
        fetchCharacters(debouncedSearchTerm);
    }, [debouncedSearchTerm, fetchCharacters]);
    
    // Initial fetch with empty search on component mount
    useEffect(() => {
        fetchCharacters('');
    }, [fetchCharacters]);
    
    return (
        <div>
            <input
                type="text"
                placeholder="Search characters..."
                value={searchTerm}
                onChange={handleSearchChange}
            />
            
            {loading ? (
                <div>Loading...</div>
            ) : (
                <ul>
                    {characters.length > 0 ? 
                        characters.map((character) => (
                            <li key={character.url}>{character.name}</li>
                        )) : 
                        <li>No characters found</li>
                    }
                </ul>
            )}
        </div>
    );
};

export default CharacterList;
```

Wait, I'm noticing a potential issue. We have two useEffects that both call `fetchCharacters`, and one of them depends on `fetchCharacters` which is memoized with useCallback. This might cause some issues with the initialization.

Let me refine the code to have just one useEffect for fetching characters, and make sure it handles both the initial load and subsequent searches correctly:

```tsx
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

interface Character {
    name: string;
    url: string;
}

// Custom hook for debounced value
const useDebounce = <T,>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        
        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);
    
    return debouncedValue;
};

const CharacterList: React.FC = () => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    
    // Debounce the search term to avoid excessive API calls
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    
    // Handle search input changes
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };
    
    // Fetch characters based on the debounced search term
    useEffect(() => {
        const fetchCharacters = async () => {
            setLoading(true);
            try {
                const response = await axios.get('https://swapi.dev/api/people', {
                    params: {
                        search: debouncedSearchTerm
                    }
                });
                setCharacters(response.data.results);
            } catch (error) {
                console.error('Failed to fetch characters:', error);
                setCharacters([]);
            } finally {
                setLoading(false);
            }
        };
        
        fetchCharacters();
    }, [debouncedSearchTerm]);
    
    return (
        <div>
            <input
                type="text"
                placeholder="Search characters..."
                value={searchTerm}
                onChange={handleSearchChange}
            />
            
            {loading ? (
                <div>Loading...</div>
            ) : (
                <ul>
                    {characters.length > 0 ? 
                        characters.map((character) => (
                            <li key={character.url}>{character.name}</li>
                        )) : 
                        <li>No characters found</li>
                    }
                </ul>
            )}
        </div>
    );
};

export default CharacterList;
```

I think this version is better. The logic is straightforward:

1. Initially, debouncedSearchTerm is '' (empty string), so it will fetch all characters.
2. When the user types in the search box, the searchTerm is updated but the API call is debounced.
3. After the debounce delay, debouncedSearchTerm is updated, which triggers a new API call.
4. The loading state ensures that the user sees a loading indicator during searches.

Let me review once more to ensure I haven't missed anything:

1. ✅ Added search functionality
2. ✅ Implemented efficient debouncing to avoid overloading the backend
3. ✅ Display loading indicator while fetching data
4. ✅ Send request with empty search on initial render
5. ✅ Optimized the code with appropriate React hooks
6. ✅ Used TypeScript and axios as required
7. ✅ No TODOs in the code
8. ✅ Clean code without unnecessary comments

I think the solution is complete and meets all requirements. The useDebounce custom hook provides clean separation of concerns and makes the component more maintainable.

Let me do a final review and cleanup:

Actually, I realized we could slightly improve this solution by extracting the API call to a separate service function, which would make the component even more maintainable. Let me add that optimization:

```tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Character {
    name: string;
    url: string;
}

// Custom hook for debounced value
const useDebounce = <T,>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        
        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);
    
    return debouncedValue;
};

// API service function
const fetchCharactersAPI = async (search: string): Promise<Character[]> => {
    try {
        const response = await axios.get('https://swapi.dev/api/people', {
            params: { search }
        });
        return response.data.results;
    } catch (error) {
        console.error('Failed to fetch characters:', error);
        return [];
    }
};

const CharacterList: React.FC = () => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    
    // Debounce the search term to avoid excessive API calls
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    
    // Handle search input changes
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };
    
    // Fetch characters based on the debounced search term
    useEffect(() => {
        const fetchCharacters = async () => {
            setLoading(true);
            const results = await fetchCharactersAPI(debouncedSearchTerm);
            setCharacters(results);
            setLoading(false);
        };
        
        fetchCharacters();
    }, [debouncedSearchTerm]);
    
    return (
        <div>
            <input
                type="text"
                placeholder="Search characters..."
                value={searchTerm}
                onChange={handleSearchChange}
            />
            
            {loading ? (
                <div>Loading...</div>
            ) : (
                <ul>
                    {characters.length > 0 ? 
                        characters.map((character) => (
                            <li key={character.url}>{character.name}</li>
                        )) : 
                        <li>No characters found</li>
                    }
                </ul>
            )}
        </div>
    );
};

export default CharacterList;
```

This looks good, but let me simplify and remove some of the abstraction since it's a relatively small component. I'll still keep the useDebounce hook since it's a very useful pattern:

```tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Character {
    name: string;
    url: string;
}

// Custom hook for debounced value
const useDebounce = <T,>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        
        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);
    
    return debouncedValue;
};

const CharacterList: React.FC = () => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    
    // Debounce the search term to avoid excessive API calls
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    
    // Fetch characters based on the debounced search term
    useEffect(() => {
        const fetchCharacters = async () => {
            setLoading(true);
            try {
                const response = await axios.get('https://swapi.dev/api/people', {
                    params: { search: debouncedSearchTerm }
                });
                setCharacters(response.data.results);
            } catch (error) {
                console.error('Failed to fetch characters:', error);
                setCharacters([]);
            } finally {
                setLoading(false);
            }
        };
        
        fetchCharacters();
    }, [debouncedSearchTerm]);
    
    return (
        <div>
            <input
                type="text"
                placeholder="Search characters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            {loading ? (
                <div>Loading...</div>
            ) : (
                <ul>
                    {characters.length > 0 ? 
                        characters.map((character) => (
                            <li key={character.url}>{character.name}</li>
                        )) : 
                        <li>No characters found</li>
                    }
                </ul>
            )}
        </div>
    );
};

export default CharacterList;
```

This looks good to me. Let me make sure it's as optimized as possible:

1. We're using the useDebounce hook to avoid excessive API calls
2. We're handling loading states correctly
3. We have proper error handling
4. We're fetching initial data with an empty search term (as debouncedSearchTerm is initially empty)
5. We're displaying a "No characters found" message when the search returns no results

I think this is a clean, optimized solution that meets all the requirements. Let's finalize it.

### Answer:
```tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Character {
    name: string;
    url: string;
}

const useDebounce = <T,>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        
        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);
    
    return debouncedValue;
};

const CharacterList: React.FC = () => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    
    useEffect(() => {
        const fetchCharacters = async () => {
            setLoading(true);
            try {
                const response = await axios.get('https://swapi.dev/api/people', {
                    params: { search: debouncedSearchTerm }
                });
                setCharacters(response.data.results);
            } catch (error) {
                console.error('Failed to fetch characters:', error);
                setCharacters([]);
            } finally {
                setLoading(false);
            }
        };
        
        fetchCharacters();
    }, [debouncedSearchTerm]);
    
    return (
        <div>
            <input
                type="text"
                placeholder="Search characters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            {loading ? (
                <div>Loading...</div>
            ) : (
                <ul>
                    {characters.length > 0 ? 
                        characters.map((character) => (
                            <li key={character.url}>{character.name}</li>
                        )) : 
                        <li>No characters found</li>
                    }
                </ul>
            )}
        </div>
    );
};

export default CharacterList;
```

### Tokens: {'input_tokens': 478, 'output_tokens': 4769}
### Execution time: 55.94370198249817
