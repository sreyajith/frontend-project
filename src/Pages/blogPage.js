import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader";
import { getDay } from "../common/date";
import BlogInteraction from "../components/blog.Interaction";
import BlogPostCard from "../components/blog-post";
import BlogContent from "../components/blogContent";
import CommentContainer, { fetchComments } from "../components/comment";

export const blogStructure = {
  title: "",
  des: "",
  content: [],
  author: { personal_info: {} },
  banner: "",
  publishedAt: "",
};

export const BlogContext=createContext({ })

const BlogPage = () => {
  let { blog_id } = useParams();
  const [blog, setBlog] = useState(blogStructure);
  const [similarBlogs,setSimilarBlogs]=useState(null);
  const [loading, setLoading] = useState(true);
  const [islikedByUser,setLikedByUser]=useState(false);
  const [commentsWrapper,setCommentsWrapper]=useState(false);
  const [totalParentCommentsLoaded,setTotalParentCommentsLoaded]=useState(0);
  let {
    title,
    content,
    banner,
    author: {
      personal_info: { fullname, username:author_username, profile_img },
    },
    publishedAt
  } = blog;
  const fetchBlog = () => {
    axios
      .post("http://localhost:3000/get-blog", { blog_id })
      .then(async({ data: { blog } }) => {
        blog.comments
        =await fetchComments({blog_id:blog._id,setParentCommentCountFun:setTotalParentCommentsLoaded})
        
        setBlog(blog);
        
        axios.post("http://localhost:3000/search-blogs",{tag:blog.tags[0],limit:6,eliminate_blog:blog_id})
        .then(({data})=>{
            setSimilarBlogs(data.blogs)
        })
       
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    resetState();
    fetchBlog();
  }, [blog_id]);

  const resetState=()=>{
    setBlog(blogStructure);
    setSimilarBlogs(null);
    setLoading(true);
    setLikedByUser(false);
    setCommentsWrapper(false);
    setTotalParentCommentsLoaded(0);
  }
  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : (
        <BlogContext.Provider value={{blog,setBlog,islikedByUser,setLikedByUser,commentsWrapper,setCommentsWrapper,totalParentCommentsLoaded,setTotalParentCommentsLoaded}}>
          <CommentContainer/>
        <div
          className="mx-auto py-2 ps-5"
          style={{ maxWidth: "900px", alignContent: "center" ,justifyContent:"center"}}
        >
          <img
            src={banner}
            alt="banner"
            className="object-cover"
            style={{ width: "56.25vw", height: "30.25vw", maxHeight: "30.25vw" }}
          />
          <div className="mt-4" >
            <h1 className="fs-1">{title}</h1>
          
          <div className="d-flex flex-column justify-content-between my-4">
            <div className="d-flex gap-3 " style={{ alignItems: 'flex-start'}}>
                <img src={profile_img} alt="profile pic" className="rounded-circle mb-3"
            style={{ width: "80px", height: "80px" }}/>
            <p style={{ textTransform: "capitalize" ,marginTop:"1rem" }}>
                {fullname}
                <br/>
                <Link to={`/user/${author_username}`} className="text-dark text-decoration-underline" style={{ textDecoration: 'none' }}>
                    @{author_username}
                </Link>
            </p>
            </div>
            <p className="fs-6 text-secondary mt-1" style={{ paddingLeft: '4rem' }}>Published on {getDay(publishedAt)}</p>
            </div>
          </div>
          <BlogInteraction/>
           
           <div className="my-4" style={{ fontFamily: 'Gelasio', fontSize: '1.25rem', lineHeight: '2.5rem', '@media (minWidth: 768px)': { fontSize: '1.5rem', lineHeight: '2.5rem' } }}>
            {
                content[0].blocks.map((block,i)=>{
                    return <div key={i} className="my-2">
                        <BlogContent block={block}/>
                    </div>
                })
            }
           </div>
          <BlogInteraction/>
          {
            similarBlogs !==null && similarBlogs.length?
            <>
            <h1 className="fs-5 mt-4">Similar Blogs</h1>
            {
                similarBlogs?.map((blog,i)=>{
                    let {author:{personal_info}}=blog;
                    return <AnimationWrapper key={i} transition={{duration:1,delay:i*0.08}}>
                        <BlogPostCard content={blog} author={personal_info}/>
                    </AnimationWrapper>
                })
            }
            </>
            :""
          }
        </div>
        </BlogContext.Provider>
      )}
    </AnimationWrapper>
  );
};
export default BlogPage;
