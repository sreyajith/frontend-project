import { useContext, useState } from "react";
import { UserContext } from "../App";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { BlogContext } from "../Pages/blogPage";

const CommentField = ({action,index=undefined,replyingTo=undefined,setReplying}) => {

    let {blog,blog:{_id,author:{_id:blog_author},comments,comments:{results:commentsArr},activity,activity:{total_comments,total_parent_comments}},setBlog,setTotalParentCommentsLoaded}=useContext(BlogContext);


    let{userAuth:{access_token,username,fullname,profile_img}}=useContext(UserContext)

  const [comment, setComment] = useState("");
  const handleComment=()=>{
    if(!access_token){
        return toast.error("Login first to leave a comment");
    }
    if(!comment.length){
        return toast.error("Write something to leave a comment...")
    }

    axios.post("http://localhost:3000/add-comment",{
        _id,blog_author,comment,replying_to:replyingTo
    },{
        headers:{
            'Authorization':`Bearer ${access_token}`
        }
    })
    .then(({data})=>{
        setComment("");
        data.commented_by={ personal_info:{username,profile_img,fullname}}

        let newCommentArr;
        if(replyingTo){
            commentsArr[index].children.push(data._id);
            data.childrenLevel=commentsArr[index].childrenLevel+1;
            data.parentIndex=index;
            commentsArr[index].isReplyLoaded=true;
            commentsArr.splice(index+1,0,data);

            newCommentArr=commentsArr;
            setReplying(false);
        }else{
            data.childrenLevel=0;
        newCommentArr=[data,...commentsArr];
        }

        

        let parentCommentIncrementval=replyingTo?0:1;

        setBlog({...blog,comments:{...comments,results:newCommentArr},activity:{...activity,total_comments:total_comments+1,total_parent_comments:total_parent_comments+parentCommentIncrementval}})

        setTotalParentCommentsLoaded(preval=>preval+parentCommentIncrementval)
    })
    .catch(err=>{
        console.log(err);
    })
  }
  return (
    <>
    <Toaster/>
    <div style={{paddingLeft:"2rem"}}>
      <textarea
        value={comment}
        onChange={(e)=>setComment(e.target.value)}
        placeholder="Leave a comment..."
        className="form-control w-100  bg-light-subtle border border-secondary-subtle form-control fw-normal mt-3"
        style={{
          maxWidth: "90%",
          minHeight:"160px",
          borderRadius: ".375rem",
          resize:"none"
        }}
      ></textarea>
      <button className="btn btn-dark px-8 rounded-pill mt-4" onClick={handleComment}>{action}</button>
      </div>
    </>
  );
};
export default CommentField;
