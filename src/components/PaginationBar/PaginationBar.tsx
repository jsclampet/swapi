import { SetStateAction } from "react";

interface Props {
  page: number;
  setPage: (stateSetter: SetStateAction<number>) => void;
}

const PaginationBar = ({ page, setPage }: Props) => {
  const renderList = () => {
    const listItems = [];
    for (let pageNum = 1; pageNum < 10; pageNum++) {
      listItems.push(
        <li
          className={page === pageNum ? "page-item active" : "page-item"}
          onClick={() => setPage(pageNum)}
        >
          <a className="page-link" href="#">
            {pageNum}
          </a>
        </li>
      );
    }
    return listItems;
  };

  return (
    <div>
      <nav aria-label="Page navigation example">
        <ul className="pagination">
          <li
            onClick={() => {
              if (page > 1) setPage(page - 1);
            }}
            className={page > 1 ? "page-item" : "page-item disabled"}
          >
            <a className="page-link" href="#">
              Previous
            </a>
          </li>
          {renderList()}
          <li
            onClick={() => {
              if (page < 9) setPage(page + 1);
            }}
            className={page < 9 ? "page-item" : "page-item disabled"}
          >
            <a className="page-link" href="#">
              Next
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default PaginationBar;
