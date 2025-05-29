Your task is to modify the application on React 18.x, which utilizes the SWAPI open API.
You should add a character search functionality and optimize it efficiently (avoid overloading the Backend with requests).

<source_code>
```tsx
// index.tsx
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

</source_code>

Please follow these steps:

1. Implement a search functionality for a React 18.x application:
   - Add a search input field to filter characters by name
   - Do not overload the backend with requests
   - Preserve initial data loading behavior

2. API Integration requirements:
   - Continue using axios for API requests
   - Send an initial empty search query on component mount
   - Format search requests according to the API specifications
   - Handle API errors gracefully with appropriate user feedback

3. User Interface requirements:
   - Display a loading indicator during API requests
   - Show search results dynamically as users type
   - Implement responsive design for the search component
   - Provide visual feedback when no results are found

4. Technical implementation requirements:
   - Use TypeScript with proper type definitions for all components and functions
   - Maintain strict typing for API responses and component props
   - Implement proper state management for search queries and results
   - Apply performance optimizations where applicable (useMemo, useCallback)

5. Code quality standards:
   - Write clean, production-ready code without TODOs or commented-out code
   - Follow React best practices and patterns
   - Ensure all components are properly typed
   - Implement error boundaries where appropriate
## Run 1:
### Thoughts:
The user wants me to modify a React 18.x application that uses the SWAPI API to add character search functionality. The key requirements are:

1. Add search functionality
2. Optimize to avoid overloading the backend (debouncing)
3. Preserve initial data loading behavior
4. Use axios for API requests
5. Implement proper TypeScript typing
6. Add loading indicators and error handling
7. Make it responsive with good UX

I'll need to:
1. Add a search input field
2. Implement debouncing to avoid too many API calls
3. Use the SWAPI search endpoint (https://swapi.dev/api/people/?search=)
4. Maintain the initial load of all characters
5. Add proper error handling and loading states
6. Use React hooks like useMemo, useCallback for optimization
7. Add proper TypeScript types

Let me implement this step by step:

### Answer:
Here's the modified React 18.x application with search functionality and optimizations:

```tsx
// index.tsx
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios, { AxiosError } from 'axios';

interface Character {
    name: string;
    url: string;
    height: string;
    mass: string;
    birth_year: string;
}

interface APIResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Character[];
}

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, placeholder }) => {
    return (
        <div className="search-container">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder || "Search characters..."}
                className="search-input"
                aria-label="Search characters"
            />
        </div>
    );
};

const CharacterList: React.FC = () => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchDebounceTimer, setSearchDebounceTimer] = useState<NodeJS.Timeout | null>(null);

    const fetchCharacters = useCallback(async (search: string = '') => {
        setLoading(true);
        setError(null);
        
        try {
            const url = search 
                ? `https://swapi.dev/api/people/?search=${encodeURIComponent(search)}`
                : 'https://swapi.dev/api/people';
            
            const response = await axios.get<APIResponse>(url);
            setCharacters(response.data.results);
        } catch (err) {
            const axiosError = err as AxiosError;
            const errorMessage = axiosError.response?.status === 404
                ? 'No characters found'
                : 'Failed to fetch characters. Please try again later.';
            setError(errorMessage);
            console.error('Failed to fetch characters:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCharacters();
    }, [fetchCharacters]);

    const handleSearchChange = useCallback((value: string) => {
        setSearchQuery(value);
        
        if (searchDebounceTimer) {
            clearTimeout(searchDebounceTimer);
        }
        
        const newTimer = setTimeout(() => {
            fetchCharacters(value);
        }, 300);
        
        setSearchDebounceTimer(newTimer);
    }, [searchDebounceTimer, fetchCharacters]);

    useEffect(() => {
        return () => {
            if (searchDebounceTimer) {
                clearTimeout(searchDebounceTimer);
            }
        };
    }, [searchDebounceTimer]);

    const renderContent = useMemo(() => {
        if (loading) {
            return (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading characters...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="error-container">
                    <p className="error-message">{error}</p>
                    <button 
                        onClick={() => fetchCharacters(searchQuery)}
                        className="retry-button"
                    >
                        Retry
                    </button>
                </div>
            );
        }

        if (characters.length === 0) {
            return (
                <div className="no-results">
                    <p>No characters found matching "{searchQuery}"</p>
                </div>
            );
        }

        return (
            <ul className="character-list">
                {characters.map((character) => (
                    <li key={character.url} className="character-item">
                        <h3>{character.name}</h3>
                        <div className="character-details">
                            <span>Height: {character.height}cm</span>
                            <span>Mass: {character.mass}kg</span>
                            <span>Birth Year: {character.birth_year}</span>
                        </div>
                    </li>
                ))}
            </ul>
        );
    }, [loading, error, characters, searchQuery, fetchCharacters]);

    return (
        <div className="app-container">
            <header className="app-header">
                <h1>Star Wars Characters</h1>
                <SearchInput 
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search by name..."
                />
            </header>
            <main className="app-main">
                {renderContent}
            </main>
        </div>
    );
};

export default CharacterList;
```

And here's the accompanying CSS for styling:

```css
/* styles.css */
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background-color: #f5f5f5;
    color: #333;
}

.app-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.app-header {
    background-color: #fff;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 24px;
}

.app-header h1 {
    font-size: 2rem;
    margin-bottom: 16px;
    color: #1a1a1a;
}

.search-container {
    width: 100%;
}

.search-input {
    width: 100%;
    padding: 12px 16px;
    font-size: 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    outline: none;
    transition: border-color 0.2s ease;
}

.search-input:focus {
    border-color: #4CAF50;
}

.app-main {
    background-color: #fff;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    min-height: 400px;
}

.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #4CAF50;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.loading-container p {
    color: #666;
    font-size: 1.1rem;
}

.error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px;
}

.error-message {
    color: #d32f2f;
    font-size: 1.1rem;
    margin-bottom: 16px;
}

.retry-button {
    padding: 10px 24px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.retry-button:hover {
    background-color: #45a049;
}

.no-results {
    text-align: center;
    padding: 48px;
    color: #666;
    font-size: 1.1rem;
}

.character-list {
    list-style: none;
}

.character-item {
    padding: 16px;
    border-bottom: 1px solid #e0e0e0;
    transition: background-color 0.2s ease;
}

.character-item:last-child {
    border-bottom: none;
}

.character-item:hover {
    background-color: #f9f9f9;
}

.character-item h3 {
    font-size: 1.2rem;
    margin-bottom: 8px;
    color: #1a1a1a;
}

.character-details {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
}

.character-details span {
    font-size: 0.9rem;
    color: #666;
    background-color: #f0f0f0;
    padding: 4px 8px;
    border-radius: 4px;
}

@media (max-width: 768px) {
    .app-container {
        padding: 12px;
    }
    
    .app-header,
    .app-main {
        padding: 16px;
    }
    
    .app-header h1 {
        font-size: 1.5rem;
    }
    
    .character-details {
        font-size: 0.85rem;
    }
}
```

Key features implemented:

1. **Search Functionality**: Added a controlled search input component that filters characters by name using the SWAPI search endpoint.

2. **Debouncing**: Implemented a 300ms debounce mechanism to avoid overloading the backend with requests while the user is typing.

3. **TypeScript**: Full TypeScript support with proper interfaces for API responses, component props, and state management.

4. **Error Handling**: Comprehensive error handling with user-friendly messages and a retry button.

5. **Loading States**: Visual loading indicators during API requests.

6. **Performance Optimizations**: 
   - Used `useCallback` for functions to prevent unnecessary re-renders
   - Used `useMemo` for render logic optimization
   - Proper cleanup of timers in useEffect

7. **Responsive Design**: Mobile-friendly design with media queries.

8. **User Experience**:
   - Clear visual feedback for loading, errors, and no results
   - Displays additional character information (height, mass, birth year)
   - Smooth transitions and hover effects

The application maintains the initial behavior of loading all characters on mount and efficiently handles search queries without overwhelming the API.

### Tokens: {'input_tokens': 687, 'output_tokens': 3006}
### Execution time: 36.040568113327026
