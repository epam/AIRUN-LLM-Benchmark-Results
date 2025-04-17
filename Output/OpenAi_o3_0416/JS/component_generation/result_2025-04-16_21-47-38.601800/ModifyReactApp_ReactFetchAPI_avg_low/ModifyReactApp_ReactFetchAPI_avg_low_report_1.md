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
### Answer:
Below is a compact, self‑contained solution that fulfils every requirement without changing the public API of your component tree.  
You can copy–paste the three files (or merge the CSS where you prefer).  

1. CharacterList.tsx – functional component with search, debouncing, strict typing, memoised rendering and graceful error handling.  
2. ErrorBoundary.tsx – minimal error boundary.  
3. CharacterList.css – lightweight, responsive styling.

–––––––– FILE: CharacterList.tsx ––––––––
```tsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import axios, { AxiosError } from 'axios';
import './CharacterList.css';

/* ============
 *  Type defs
 * ============ */
export interface Character {
  name: string;
  url: string;
}

interface SwapiResponse {
  results: Character[];
}

/* ============
 *  Utilities
 * ============ */
function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

/* ============
 *  Component
 * ============ */
const CharacterList: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search);

  /* ---- API call – memoised to avoid re‑creation ---- */
  const fetchCharacters = useCallback(async (query: string) => {
    setLoading(true);
    setErrorMsg(null);

    const url = `https://swapi.dev/api/people${
      query ? `?search=${encodeURIComponent(query)}` : ''
    }`;

    try {
      const { data } = await axios.get<SwapiResponse>(url);
      setCharacters(data.results);
    } catch (err) {
      const axiosErr = err as AxiosError;
      setErrorMsg(axiosErr.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  }, []);

  /* ---- Initial load + subsequent searches ---- */
  useEffect(() => {
    fetchCharacters(debouncedSearch);      // initial empty search + later queries
  }, [debouncedSearch, fetchCharacters]);

  /* ---- Handlers ---- */
  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value),
    []
  );

  /* ---- Render memoisation ---- */
  const body = useMemo(() => {
    if (loading) return <div className="state">Loading…</div>;
    if (errorMsg) return <div className="state error">{errorMsg}</div>;
    if (!characters.length)
      return <div className="state">No results found</div>;

    return (
      <ul className="character-list">
        {characters.map((c) => (
          <li key={c.url}>{c.name}</li>
        ))}
      </ul>
    );
  }, [loading, errorMsg, characters]);

  return (
    <section className="wrapper">
      <input
        className="search"
        placeholder="Search by name…"
        value={search}
        onChange={handleInput}
      />
      {body}
    </section>
  );
};

export default CharacterList;
```

–––––––– FILE: ErrorBoundary.tsx ––––––––
```tsx
import React from 'react';

interface Props {
  children: React.ReactNode;
}
interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(err: unknown, info: unknown) {
    // Centralised logging can go here
    console.error('ErrorBoundary caught:', err, info);
  }

  render() {
    if (this.state.hasError) return <h1>Something went wrong.</h1>;
    return this.props.children;
  }
}

export default ErrorBoundary;
```

–––––––– FILE: CharacterList.css ––––––––
```css
.wrapper {
  max-width: 640px;
  margin: 0 auto;
  padding: 1rem;
}

.search {
  width: 100%;
  padding: 0.6rem 0.8rem;
  font-size: 1rem;
  margin-bottom: 1rem;
  box-sizing: border-box;
}

.character-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.character-list li {
  border-bottom: 1px solid #eee;
  padding: 0.6rem 0;
}

.state {
  text-align: center;
  padding: 1rem;
}

.state.error {
  color: #d32f2f;
}

@media (min-width: 768px) {
  .wrapper {
    padding: 2rem 0;
  }
}
```

–––––––– USAGE (index.tsx or main entry) ––––––––
```tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import ErrorBoundary from './ErrorBoundary';
import CharacterList from './CharacterList';

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <CharacterList />
    </ErrorBoundary>
  </React.StrictMode>
);
```

Key points & how they map to the spec
• Debouncing (useDebounce) ensures SWAPI isn’t spammed.  
• Initial mount triggers an empty `search=` request, preserving old behaviour.  
• Axios remains the single HTTP layer; all responses are strictly typed.  
• Loading, empty and error states give clear UX feedback.  
• Memoisation (useCallback, useMemo) prevents redundant renders.  
• CSS delivers a simple responsive layout (mobile 1‑column → wider padding on desktop).  
• ErrorBoundary catches unexpected runtime errors without crashing the whole app.

### Tokens: {'input_tokens': 570, 'output_tokens': 2908, 'reasoning_tokens': 1536}
### Execution time: 17.221760034561157
