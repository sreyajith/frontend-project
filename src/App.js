import React, { createContext, useEffect, useState } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import NavBar from "./components/NavBar";
import { Route, Routes } from "react-router-dom";
import UserAuthForm from "./Pages/userAuthForm.page";
import { lookInSession } from './common/session';
import Editor from './Pages/editor.pages';
import HomePage from './Pages/home.page';
import SearchPage from './Pages/searchPage';
import PageNotFound from './Pages/404page';
import ProfilePage from './Pages/profile';
import BlogPage from './Pages/blogPage';

export const UserContext=createContext({})
function App() {

  const[userAuth,setUserAuth]=useState();
  useEffect(()=>{
    let userInSession=lookInSession("user");
    userInSession?setUserAuth(JSON.parse(userInSession)):setUserAuth({access_token:null})
  },[])
  return (
    <div>
      <UserContext.Provider value={{userAuth,setUserAuth}}>
      <Routes>
        <Route path="/editor" element={<Editor/>} />
        <Route path="/editor/:blog_id" element={<Editor/>} />
        <Route path="/" element={<NavBar />}>
          <Route index element={<HomePage/>} />
          <Route path="/signin" element={<UserAuthForm type="sign-in" />}/> 
          <Route path="/signup" element={<UserAuthForm type="sign-up" />}/>
          <Route path='search/:query' element={<SearchPage/>}/>
          <Route path='/user/:id' element={<ProfilePage/>}/>
          <Route path='blog/:blog_id' element={<BlogPage/>}/>
          <Route path='*' element={<PageNotFound/>}/>
        </Route>
        
      </Routes>
      </UserContext.Provider>
    </div>
  );
}

export default App;
