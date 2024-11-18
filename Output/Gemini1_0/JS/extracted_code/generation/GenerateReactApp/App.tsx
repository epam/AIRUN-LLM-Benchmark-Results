import { useEffect, useState } from "react";
import axios from "axios";
import { Loader } from "./Loader";
import { Character } from "./Character";

const App = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://swapi.dev/api/people")
      .then((res) => {
        setCharacters(res.data.results);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {loading ? <Loader /> : <ul>{characters.map((character) => <Character key={character.url} character={character} />)}</ul>}
    </div>
  );
};

export default App;