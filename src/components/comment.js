import { useContext } from "react";
import { BlogContext } from "../Pages/blogPage";
import CommentField from "./commentField";
import axios from "axios";
import NoDataMessage from "./nodata";
import AnimationWrapper from "../common/page-animation";
import CommentCard from "./commentCard";

export const fetchComments=async({skip=0,blog_id,setParentCommentCountFun,comment_array=null})=>{
    let res;
    await axios.post("http://localhost:3000/get-blog-comments",{blog_id,skip})
    .then(({data})=>{
        data.map(comment=>{
            comment.childrenLevel=0;
        })
        setParentCommentCountFun(preVal=>preVal+data.length)

        if(comment_array==null){
            res={results:data}
        }else{
            res={results:[...comment_array,...data]}
        }
    })
    return res;
}

const CommentContainer = () => {
  let {
    blog,blog: {_id, title,comments:{results:commentsArr},activity:{total_parent_comments} },
    commentsWrapper,
    setCommentsWrapper,totalParentCommentsLoaded,setTotalParentCommentsLoaded,setBlog
  } = useContext(BlogContext);


  const loadMoreComments=async()=>{
    let newCommentArr=await fetchComments({skip:totalParentCommentsLoaded,blog_id:_id,setParentCommentCountFun:setTotalParentCommentsLoaded,comment_array:commentsArr})
    setBlog({...blog,comments:newCommentArr})
  }
  return (
    <div
      className={
        "w-sm-50 h-100 position-fixed bg-white shadow " +
        (commentsWrapper ? "top-0 end-0" : "d-none end-0")
      }
      style={{
        transition: "opacity 700ms ease-in-out",
        minWidth: "400px",
        zIndex: 10,
        overflowX: "hidden",
        overflowY: "auto",
        alignItems:"center", justifyContent:"center",
        "@media (maxWidth: 576px)": {
          width: "100%",
        },
      }}
    >
      <div className="position-relative">
        <h1 className="fs-3 fw-normal ps-4">Comments</h1>
        <p
          className="fs-5 mt-2 w-75 ps-4 text-secondary"
          style={{ overflow: "none" }}
        >
          {title}
        </p>
        <button
        onClick={()=>setCommentsWrapper(preVal=>!preVal)}
          className="position-absolute top-0 mt-3 end-0 d-flex justify-content-center align-items-center rounded-circle bg-secondary bg-opacity-10"
          style={{ width: "30px", height: "30px", border: "none" }}
        >
          <i className="bi bi-x-lg fs-5"></i>
        </button>
      </div>
      <hr className="border border-bottom-0 border-secondary-subtle border-opacity-10"/>
      
      <CommentField action="Comment"/>
      {
        commentsArr && commentsArr.length?
        commentsArr.map((comment,i)=>{
            return <AnimationWrapper key={i}>
                <CommentCard index={i} leftVal={comment.childrenLevel*4} commentData={comment}/>
            </AnimationWrapper>
        }):<NoDataMessage message="No comments"/>
      }
      {
        total_parent_comments>totalParentCommentsLoaded?
        <div className="mb-4" style={{paddingLeft:"2rem"}}>
        <button className="btn btn-light px-8 rounded-pill mt-4 justify-content-center align-items-center d-flex"
        onClick={loadMoreComments} >
            Load more
        </button>
        </div>
        :""
      }
    </div>
  );
};
export default CommentContainer;
