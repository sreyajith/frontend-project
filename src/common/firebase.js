import { initializeApp } from "firebase/app";
import{GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
const firebaseConfig = {
  apiKey: "AIzaSyCXXVhqnibUzMWcXkHBCOYA-WxIqTe9AwM",
  authDomain: "react-js-blog-f154c.firebaseapp.com",
  projectId: "react-js-blog-f154c",
  storageBucket: "react-js-blog-f154c.appspot.com",
  messagingSenderId: "199678856416",
  appId: "1:199678856416:web:673dccccb9e0124bcb5485"
};
// eslint-disable-next-line
const app = initializeApp(firebaseConfig);

const provider=new GoogleAuthProvider();
const auth =getAuth();
export const authWithGoogle=async()=>{
    let user=null;
    await signInWithPopup(auth,provider)
    .then((result)=>{
        user=result.user
    })
    .catch((err)=>{
       console.log(err)
    })
    return user;
}