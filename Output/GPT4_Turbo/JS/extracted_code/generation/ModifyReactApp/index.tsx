import React, { useEffect, useState } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';

interface Character {
  name: string;
  url: string;
}

const CharacterList: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://swapi.dev/api/people/?search=${searchTerm}`);
        setCharacters(response.data.results);
      } catch (error) {
        console.error('Failed to fetch characters:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [searchTerm]);

  const handleSearch = debounce((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, 300);

  return (
    <div>
      <input
        type="text"
        placeholder="Search characters"
        onChange={handleSearch}
        style={{ marginBottom: '20px' }}
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