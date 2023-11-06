export interface Character {
  name: string;
  birth_year: string;
  height: string;
  mass: string;
  homeworld: string;
  species: string;
}

interface Props {
  characters: Character[];
}

const Table = ({ characters }: Props) => {
  return (
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Name</th>
          <th>Birthdate</th>
          <th>Height</th>
          <th>Mass</th>
          <th>HomeWorld</th>
          <th>Species</th>
        </tr>
      </thead>
      <tbody>
        {characters &&
          characters.map(
            ({ name, birth_year, height, mass, homeworld, species }) => {
              return (
                <tr key={crypto.randomUUID()}>
                  <td>{name}</td>
                  <td>{birth_year}</td>
                  <td>{height}</td>
                  <td>{mass}</td>
                  <td>{homeworld}</td>
                  <td>{species}</td>
                </tr>
              );
            }
          )}
      </tbody>
    </table>
  );
};

export default Table;
