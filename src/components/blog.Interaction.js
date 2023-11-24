import { useContext, useEffect, useState } from "react";
import { BlogContext } from "../Pages/blogPage";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import { Toaster,toast } from "react-hot-toast";
import axios from "axios";
const BlogInteraction = () => {
  let {
    blog,blog: {
      _id,
      title,
      blog_id,
      activity,
      activity: { total_likes, total_comments },
      author: {
        personal_info: { username: author_username },
      },
    },
    setBlog,
    islikedByUser,setLikedByUser,setCommentsWrapper
  } = useContext(BlogContext);

  let {userAuth:{username,access_token}}=useContext(UserContext);

  useEffect(()=>{
    if(access_token){
      axios.post("http://localhost:3000/isliked-by-user",{_id},{
        headers:{
          'Authorization':`Bearer ${access_token}`
        }
      })
      .then(({data:{result}})=>{
        setLikedByUser(Boolean(result))
      })
      .catch(err=>{
        console.log(err);
      })
    }
  },[])
  const handleLike=()=>{
    if(access_token){
      setLikedByUser(preVal=>!preVal);
      !islikedByUser?total_likes++:total_likes--
      setBlog({...blog,activity:{...activity,total_likes}})
      axios.post("http://localhost:3000/liked-blog",{_id,islikedByUser},{
        headers:{
          'Authorization':`Bearer ${access_token}`
        }
      })
      .then(({data})=>{
        console.log(data);
      })
      .catch(err=>{
        console.log(err);
      })
    }
    else{
      toast.error("Please login to like this blog")
    }
  }
  const [hovered, setHovered] = useState(false);
  const iconStyle = {
    color: hovered ? "#1DA1F2" : "",
  };
  return (
    <>
    <Toaster/>
      <hr style={{ borderBottom: "0.5px solid rgba(245, 242, 242, 0.5)" }} />
      <div className="d-flex gap-3 justify-content-between">
        <div className="d-flex gap-2 align-items-center ">
          <button
          onClick={handleLike}
            className={"border-0 rounded-circle align-items-center justify-content-center "+(islikedByUser?"bg-danger text-danger bg-opacity-10":" bg-light")}
            style={{ width: "40px", height: "40px" }}
          >
            <i className={"bi "+(islikedByUser?"bi-heart-fill":"bi-heart")}></i>
          </button>
          <p className="text-secondary fs-5 mt-3">{total_likes}</p>

          <button
          onClick={()=>setCommentsWrapper(preVal=>!preVal)}
            className="border-0 rounded-circle align-items-center justify-content-center bg-light"
            style={{ width: "40px", height: "40px" }}
          >
            <i className="bi bi-chat-dots"></i>
          </button>
          <p className="text-secondary fs-5 mt-3">{total_comments}</p>
        </div>
        <div className="d-flex gap-3 align-items-center">
            
            {
                username===author_username?
                <Link to={`/editor/${blog_id}`} className="text-dark bottom-0">Edit</Link>
                :""
            }

          <Link
            to={`https://twitter.com/intent/tweet?text=Read ${title}&url=${window.location.href}`}
            className="text-dark "
            style={{ textDecoration: "none" }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <i className="bi bi-twitter-x" style={iconStyle}></i>
          </Link>
        </div>
      </div>
      <hr style={{ borderBottom: "0.5px solid rgba(245, 242, 242, 0.5)" }} />
    </>
  );
};
export default BlogInteraction;
