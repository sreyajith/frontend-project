const LoadMoreDataBtn = ({ state, fetchDataFun }) => {
  if (state !== null && state.totalDocs > state.results.length) {
    return (
      <button
        onClick={() => fetchDataFun({ page: state.page + 1 })}
        className="btn btn-primary btn-light px-8 rounded-pill d-flex align-items-center gap-2 mb-4"
      >
        Load More
      </button>
    );
  }
};
export default LoadMoreDataBtn;
