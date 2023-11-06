import axios from "axios";
import { useState, useEffect } from "react";
import Table from "./components/Table";

const App = () => {
  const [people, setPeople] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [toggleSearch, setToggleSearch] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    async function updatePeople() {
      const peopleRequest =
        isSearching === false
          ? await axios.get("https://swapi.dev/api/people")
          : await axios.get(
              `https://swapi.dev/api/people/?search=${userInput}`
            );

      const peopleResultsArray = peopleRequest.data.results;

      const homeworldsRequest = await Promise.all(
        peopleResultsArray.map((person: string) =>
          axios.get(`${person.homeworld}`)
        )
      );
      const homeworldsArray = homeworldsRequest.map(
        (homeworld) => homeworld.data.name
      );

      const speciesRequest = await Promise.all(
        peopleResultsArray
          .filter((person) => person.species.length)
          .map((person) => {
            return axios.get(`${person.species[0]}`);
          })
      );
      const speciesArray = peopleResultsArray.map((person, i) => {
        return person.species.length
          ? speciesRequest
              .map((specie) => specie.data)
              .find((specie) => specie.url === person.species[0]).name
          : "unknown";
      });

      const formatBirthDate = (person) => {
        return person.birth_year === "unknown"
          ? "unknown"
          : `${person.birth_year.split("BBY")[0]} BBY`;
      };
      const formatHeight = (person) => {
        return person.height === "unknown" ? "unknown" : `${person.height} cm`;
      };
      const formatMass = (person) => {
        return person.mass === "unknown" ? "unknown" : `${person.mass} kg`;
      };

      const peopleArray = peopleResultsArray.map((person, i) => {
        return {
          name: person.name,
          birthdate: formatBirthDate(person),
          height: formatHeight(person),
          mass: formatMass(person),
          homeworld: homeworldsArray[i],
          species: speciesArray[i],
        };
      });
      setPeople(peopleArray);
    }
    updatePeople();
  }, [toggleSearch]);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setIsSearching(true);
          setToggleSearch(!toggleSearch);
        }}
      >
        <input type="text" onChange={(e) => setUserInput(e.target.value)} />
        <button type="submit">Search</button>
        <button
          type="button"
          onClick={() => {
            setIsSearching(false);
            setToggleSearch(!toggleSearch);
          }}
        >
          Clear Search
        </button>
      </form>
      <Table characters={people} />
    </div>
  );
};

export default App;
