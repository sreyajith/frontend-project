import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../App";
import { removeFromSession } from "../common/session";
import './user-navi.css'
const UserNavigationPanel = () => {
  const { userAuth: { username }, setUserAuth } = useContext(UserContext);
  
  const signOutUser = () => {
    removeFromSession("user");
    setUserAuth({ access_token: null });
  };

  return (
    <div className="user-navigation-container bg-white position-fixed end-0 border border-2 border-gray  transition d-flex flex-column">
      <Link to="/editor" className="link-md-only p-2 text-decoration-none text-muted">
        <i className="bi bi-pencil-square"></i> Write
      </Link>
      <Link to={`/user/${username}`} className="link p-2 text-decoration-none text-muted">
        Profile
      </Link>
      <Link to={`/user/${username}`} className="link p-2 text-decoration-none text-muted">
        Dashboard
      </Link>
      <Link to={`/settings/edit-profile`} className="link p-2 text-decoration-none text-muted">
        Settings
      </Link>
      <span className="position-absolute border-top border-2 w-100"></span>
      <button className="btn text-start py-2 w-100 ps-1" onClick={signOutUser}>
        <h1 className="fw-bold fs-5">Sign Out</h1>
        <p className="text-dark">@{username}</p>
      </button>
    </div>
  );
};

export default UserNavigationPanel;
