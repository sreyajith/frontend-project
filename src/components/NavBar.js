import React, { useContext, useState } from "react";
import logo from "../imgs/logo.png";
import "./navbar.css";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import UserNavigationPanel from "./user-navigation-component";

const NavBar = () => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [userNavPanel, setUserNavPanel] = useState(false);
  let navigate = useNavigate();

  const toggleSearchBar = () => {
    setSearchVisible(!searchVisible);
  };

  const { userAuth } = useContext(UserContext);
  const access_token = userAuth ? userAuth.access_token : null;
  const profile_img = userAuth ? userAuth.profile_img : null;

  const handleSearch = (e) => {
    let query = e.target.value;
    if (e.keyCode === 13 && query.length) {
      navigate(`/search/${query}`);
    }
  };

  const handleUserNavPanel = () => {
    setUserNavPanel((currentVal) => !currentVal);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setUserNavPanel(false);
    }, 200);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-brand">
        <div className="d-flex align-items-center">
          <Link to="/">
            <img src={logo} className="navbar-icon" alt="Logo" />
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <button
            className="toggle-search-btn bg-transparent border-0 d-lg-none"
            onClick={toggleSearchBar}
          >
            <i className="bi bi-search"></i>
          </button>

          <div className={`search-container ${searchVisible ? "visible" : ""}`}>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-0">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                placeholder="Search"
                className="form-control bg-grey py-2 pl-6 pr-12 md-pr-6 rounded-pill border-1"
                onKeyDown={handleSearch}
              />
            </div>
          </div>
        </div>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/editor" className="nav-link">
                <i className="bi bi-pencil-square fs-4"></i> <span>Write</span>
              </Link>
            </li>

            {access_token ? (
              <>
              <Link
                  to="/dashboard/notification"
                  className="btn btn-secondary rounded-pill position-relative hover:bg-black-10"
                  style={{ width: "3rem", height: "3rem" }}
                >
                  <i className="bi bi-bell fs-5 mt-3"></i>
                </Link>
                <div
                  className="position-relative end-0"
                  onClick={handleUserNavPanel}
                  onBlur={handleBlur}
                  style={{ marginLeft: "8px" }}
                >
                  <button
                    className="btn btn-secondary rounded-circle align-items-center p-0 hover:bg-black-10"
                    style={{
                      width: "fit-content",
                      height: "fit-content",
                      border: "none",
                    }}
                  >
                    <img
                      src={profile_img}
                      alt="Profile"
                      className="rounded-circle p-0"
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        padding: "0",
                      }}
                    />
                  </button>
                  {userNavPanel ? (
                    <UserNavigationPanel className="user-navigation-panel" />
                  ) : (
                    ""
                  )}
                </div>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/signin" className="nav-link bg-dark text-light sign px-4">
                    Sign In
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/signup" className="nav-link sign bg-light-grey px-4">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default NavBar;
