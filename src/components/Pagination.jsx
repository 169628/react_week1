function Pagination({ page, getProducts }) {
  return (
    <>
      <div className="d-flex justify-content-center">
        <nav>
          <ul className="pagination">
            <li
              className={`page-item ${
                page.current_page == 1 ? "disabled" : ""
              }`}
            >
              <a
                className="page-link"
                href="#"
                onClick={() => {
                  getProducts(page.current_page - 1);
                }}
              >
                上一頁
              </a>
            </li>
            {[...Array(page.total_pages).keys()].map((i) => {
              return (
                <li
                  key={i}
                  className={`page-item ${
                    i + 1 == page.current_page ? "active" : ""
                  }`}
                >
                  <a
                    className="page-link"
                    href="#"
                    onClick={() => {
                      getProducts(i + 1);
                    }}
                  >
                    {i + 1}
                  </a>
                </li>
              );
            })}
            <li
              className={`page-item ${
                page.current_page == page.total_pages ? "disabled" : ""
              }`}
            >
              <a
                className="page-link"
                href="#"
                onClick={() => {
                  getProducts(page.current_page + 1);
                }}
              >
                下一頁
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}

export default Pagination;
