import { useContext, useState } from "react";
import { NavLink, Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../App";
import'./sideNavBar.css';

const SideNav = () => {
  let {
    userAuth: { access_token },
  } = useContext(UserContext);
  let [page,setPageState]=useState();
  return access_token === null ? (
    <Navigate to="/signin" />
  ) : (
    <>
      <section
        style={{ position: "relative"}}
        className="d-flex flex-column flex-md-row gap-2 py-0 m-0"
      >
        
        <div
          style={{ position: "sticky", top: "0", marginInlineStart:"2rem"  }}
          className="mt-3 z-index-3 sticky-container p-3"
        >
          <div style={{ minWidth: '200px', height: '100vh', overflowY: 'auto', padding: '4px' }} className="position-sticky top-md-0 top-24 d-flex flex-column">
            <p className=" mb-0" style={{ fontSize: "1.50rem" ,  color: "#6c757d"}}>Dashboard</p>
            <hr className="border border-secondary mx-6 my-8"/>
            <NavLink to="/dashboard/blogs" onClick={(e)=>setPageState(e.target.innerText)} className="link p-2 text-decoration-none fs-5 text-muted">
            <i className="bi bi-file-earmark-richtext px-3"></i>
                Blogs
                </NavLink>
                <NavLink to="/dashboard/notification" onClick={(e)=>setPageState(e.target.innerText)} className="link p-2 text-decoration-none fs-5 text-muted">
                <i className="bi bi-bell fs-5 mt-3 px-3"></i>
                Notification
                </NavLink>
                <NavLink to="/editor" onClick={(e)=>setPageState(e.target.innerText)} className="link p-2 text-decoration-none fs-5 text-muted">
                <i className="bi bi-pencil-square fs-5 px-3"></i>
                Write
                </NavLink>
                <p className=" mb-0 mt-5" style={{ fontSize: "1.50rem" ,  color: "#6c757d"}}>Settings</p>
            <hr className="border border-secondary mx-6 my-8"/>
            <NavLink to="/settings/edit-profile" onClick={(e)=>setPageState(e.target.innerText)} className="link p-2 text-decoration-none fs-5 text-muted ">
            <i className="bi bi-person px-3 " ></i>
                Edit Profile
                </NavLink>
                <NavLink to="/settings/change-password" onClick={(e)=>setPageState(e.target.innerText)} className="link p-2 text-decoration-none fs-5 text-muted" activeClassName="active">
                <i className="bi bi-lock px-3"></i>
                Change Password
                </NavLink>
          </div>
        </div>
        <div className="w-full mt-4 " style={{ paddingInlineStart: "4rem" }}>
      <Outlet />
      </div>
      </section>
      
    </>
  );
};
export default SideNav;
