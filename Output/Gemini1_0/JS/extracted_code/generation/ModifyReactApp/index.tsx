import React, {useEffect, useState} from 'react';
import axios from 'axios';

interface Character {
    name: string;
    url: string;
}

const CharacterList: React.FC = () => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchCharacters = async () => {
            try {
                const response = await axios.get(`https://swapi.dev/api/people/?search=${search}`);
                setCharacters(response.data.results);
            } catch (error) {
                console.error('Failed to fetch characters:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCharacters();
    }, [search]);

    if (loading) return <div>Loading...</div>;

    return (
        <>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
            <ul>
                {characters.map((character) => (
                    <li key={character.url}>{character.name}</li>
                ))}
            </ul>
        </>
    );
};

export default CharacterList;