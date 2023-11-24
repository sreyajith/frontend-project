import React, { useContext} from 'react';
import InputBox from '../components/input';
import googleIcon from '../../src/imgs/google.png'
import { Link, Navigate,useNavigate } from 'react-router-dom';
import {Toaster,toast} from 'react-hot-toast';
import axios from 'axios';
import { storeInSession } from '../common/session';
import { UserContext } from '../App';
import { authWithGoogle } from '../common/firebase';
import AnimationWrapper from '../common/page-animation';

const UserAuthForm = ({ type }) => {
  let{userAuth:{access_token},setUserAuth}=useContext(UserContext);
  const navigate = useNavigate();
  
  const userAuthThroughSrver=(serverRoute,formData)=>{
    axios.post("http://localhost:3000"+serverRoute, formData)
    .then(({data})=>{
      storeInSession("user",JSON.stringify(data));
      setUserAuth(data);
      navigate("/");
      toast.success("Login successful!");
    })
    .catch(error => {
      console.log('Response:', error.response); // Log the entire response object
      toast.error("An error occurred"); // Show a generic error message
    })
  }
  const handleGoogleAuth=(e)=>{
    e.preventDefault();
    authWithGoogle().then(user=>{
      let serverRoute="/google-auth";
      let formData={
        access_token:user.accessToken
      }
      console.log(access_token);
      userAuthThroughSrver(serverRoute,formData); 
    })
    .catch(err=>{
      toast.error("Touble login through google!");
      console.log(err)
    })
    
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    let serverRoute=type ==="sign-in"?"/signin":"/signup";
    let form = new FormData(document.getElementById("formElement"));
    let formData = {};
    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,20}$/;
    let {fullname,email,password}=formData;
    if(fullname){
      if(fullname.length<3){
        return toast.error("Fullname must be at least 3 letter long")
      }
    }
    if(!email.length){
      return toast.error("Email is required");
    }
    if(!emailRegex.test(email)){
      return toast.error("Invalid email format");
    }
    if(!passwordRegex.test(password)){
      return toast.error("Password should contain atleast one uppercase letter, have 6 tp 20 characters with a numneric")
    }

    userAuthThroughSrver(serverRoute,formData);
  }

  const message = type === "sign-in" ? "Welcome back" : "Join us today";

  const h1Style = {
    fontFamily: 'Libre Baskerville, serif',
  };

  
  return (
      access_token ? <Navigate to="/" /> : 
      <AnimationWrapper keyValue={type}>
        <section className='vh-100 d-flex flex-column align-items-center justify-content-center'>
          <Toaster/>
          <form id="formElement" className='w-100 max-w-40 text-center'>
            <h1 style={h1Style} className='mb-5'>{message}</h1>
            {type !== "sign-in" ? 
              <InputBox
                name="fullname"
                type="text"
                placeholder="Full Name"
                icon={<i className="bi bi-person"></i>}
              />    
            : null}
            <InputBox
              name="email"
              type="email"
              placeholder="Email"
              icon={<i className="bi bi-envelope-at"></i>}
            /> 
            <InputBox
              name="password"
              type="password"
              placeholder="Password"
              icon={<i className="bi bi-key"></i>}
            /> 
            <button type='submit' className='btn btn-dark mt-3 w-25 rounded-pill' onClick={handleSubmit}>
              {type.replace("-"," ")}
            </button>
            <div className='relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font bold'>
              <hr className='w-1/2 border-black'/>
              <p>or</p>
              <hr className='w-1/2 border-black'/>
            </div>
            <button className='btn-dark btn rounded-pill mt-3 mb-3' onClick={handleGoogleAuth}>
              <img src={googleIcon} className='px-2 py-2 ' alt='google'/>
              continue with google
            </button>
            {type==="sign-in" ?
              <p className='mt-6 text-dark-grey text-xl text-center'>
                Don't have an account?
                <Link to="/signup" className='underline hover:no-underline text-black text-xl ml-1'> Sign up here.</Link>
              </p>
              :
              <p className='mt-6 text-dark-grey text-xl text-center'>
                Already have an account?
                <Link to="/signin" className='underline  hover:no-underline text-black text-xl ml-1'> Sign in here.</Link>
              </p>
            }
          </form>
        </section>
        </AnimationWrapper>
    );
    
};

export default UserAuthForm;