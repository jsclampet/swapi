import axios from "axios";
import { useState, useEffect } from "react";
import Table, { Character } from "./components/Table/Table.tsx";
import "./App.css";
import PaginationBar from "./components/PaginationBar/PaginationBar.tsx";

const App = () => {
  const [people, setPeople] = useState<Character[]>([]);
  const [userInput, setUserInput] = useState("");
  const [toggleSearch, setToggleSearch] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [page, setPage] = useState(1);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    async function updatePeople() {
      const peopleRequest =
        isSearching === false
          ? await axios.get(`https://swapi.py4e.com/api/people/?page=${page}`)
          : await axios.get(
              `https://swapi.py4e.com/api/people/?search=${userInput}`
            );

      const peopleResultsArray: Character[] = peopleRequest.data.results;

      const homeworldsRequest = await Promise.all(
        peopleResultsArray.map((person: Character) =>
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
      const speciesArray = peopleResultsArray.map((person) => {
        return person.species.length
          ? speciesRequest
              .map((specie) => specie.data)
              .find((specie) => specie.url === person.species[0]).name
          : "unknown";
      });

      const formatBirthYear = (person: Character) => {
        return person.birth_year === "unknown"
          ? "unknown"
          : `${person.birth_year.split("BBY")[0]} BBY`;
      };
      const formatHeight = (person: Character) => {
        return person.height === "unknown" ? "unknown" : `${person.height} cm`;
      };
      const formatMass = (person: Character) => {
        return person.mass === "unknown" ? "unknown" : `${person.mass} kg`;
      };

      const peopleArray = peopleResultsArray.map((person, i) => {
        return {
          name: person.name,
          birth_year: formatBirthYear(person),
          height: formatHeight(person),
          mass: formatMass(person),
          homeworld: homeworldsArray[i],
          species: speciesArray[i],
        };
      });
      setPeople(peopleArray);
      setLoading(false);
    }
    updatePeople();
  }, [toggleSearch, page]);

  return (
    <div className="main-container">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/9/9b/Star_Wars_Yellow_Logo.svg"
        alt="Star Wars Logo"
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setIsSearching(true);
          setToggleSearch(!toggleSearch);
        }}
      >
        <input
          type="text"
          placeholder="Search for characters by name"
          onChange={(e) => {
            setUserInput(e.target.value);
            if (e.target.value === "") {
              setToggleSearch(!toggleSearch);
              setIsSearching(false);
            }
          }}
          className="form-control input"
          value={userInput}
        />
        <button type="submit" className="btn btn-light">
          Search
        </button>
        <button
          className={isSearching ? `btn btn-light clear-btn` : "hidden"}
          type="button"
          onClick={() => {
            setIsSearching(false);
            setToggleSearch(!toggleSearch);
            setUserInput("");
          }}
        >
          Clear
        </button>
      </form>
      {isLoading ? (
        <h2 className="text-light">Loading, please wait!</h2>
      ) : (
        <>
          <Table characters={people} />
          {!isSearching && <PaginationBar page={page} setPage={setPage} />}
        </>
      )}
    </div>
  );
};

export default App;
