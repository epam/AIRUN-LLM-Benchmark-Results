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
Here is the modified code with the added character search functionality and optimized to avoid overloading the Backend with requests:

```tsx
import React, { useState, useEffect, useMemo } from 'react';
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

  const fetchCharacters = async (searchTerm: string) => {
    try {
      const params = { search: searchTerm };
      const response = await axios.get('https://swapi.dev/api/people', { params });
      setCharacters(response.data.results);
    } catch (error) {
      console.error('Failed to fetch characters:', error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchCharacters = useMemo(() => debounce(fetchCharacters, 500), []);

  useEffect(() => {
    debouncedFetchCharacters(searchTerm);
  }, [searchTerm, debouncedFetchCharacters]);

  useEffect(() => {
    fetchCharacters('');
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <input type="search" value={searchTerm} onChange={handleSearch} placeholder="Search characters" />
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

I've added the following changes:

* Added a `searchTerm` state variable to store the current search term.
* Created a `fetchCharacters` function that takes a `searchTerm` parameter and makes a GET request to the SWAPI API with the search term as a query parameter.
* Created a debounced version of the `fetchCharacters` function using `lodash.debounce` to avoid making too many requests to the Backend.
* Added a `useEffect` hook that calls the debounced `fetchCharacters` function whenever the `searchTerm` changes.
* Added a `useEffect` hook that calls the `fetchCharacters` function with an empty search term on the initial render.
* Added a search input field and updated the JSX to display the search input field and the character list.
* Updated the `handleSearch` function to update the `searchTerm` state variable whenever the user types something in the search input field.

### Tokens: {'input_tokens': 374, 'output_tokens': 554}
### Execution time: 10.78577208518982
