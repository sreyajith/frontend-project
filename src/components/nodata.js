const NoDataMessage = ({ message }) => {
    return (
      <div className="text-center mt-5 p-4 rounded-phill" style={{ backgroundColor:"rgba(245, 242, 242, 0.5)", borderRadius:"40px" }}>
        <p className="text-dark">
          {message}
        </p>
      </div>
    );
  };
  
  export default NoDataMessage;
  