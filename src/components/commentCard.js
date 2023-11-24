import { useContext, useState } from "react";
import { getDay } from "../common/date";
import { UserContext } from "../App";
import toast from "react-hot-toast";
import CommentField from "./commentField";
import { BlogContext } from "../Pages/blogPage";
import axios from "axios";

const CommentCard = ({ index, leftVal, commentData }) => {
  let {
    commented_by: {
      personal_info: { profile_img, fullname, username:commented_by_username },
    },
    commentedAt,
    comment,_id,children
  } = commentData;

  let {blog,blog:{comments,activity,activity:{total_parent_comments},comments:{results:commentsArr},author:{personal_info:{username:blog_author}}},setBlog,setTotalParentCommentsLoaded}=useContext(BlogContext);

  let {userAuth:{access_token,username}}=useContext(UserContext);

  const [isReplying,setReplying]=useState(false);


  const getParentIndex=()=>{
    let startingPoint=index-1;
    try{
        while(commentsArr[startingPoint].childrenLevel>=commentData.childrenLevel){
            startingPoint--;
        }
    }catch{
        startingPoint=undefined;
    }
    return startingPoint;
  }

  const removeCommentsCard=(startingPoint,isDelete=false)=>{
    if(commentsArr[startingPoint]){
        while(commentsArr[startingPoint].childrenLevel > commentData.childrenLevel){
            commentsArr.splice(startingPoint,1);
            if(!commentsArr[startingPoint]){
                break;
            }
        }
    }

    if(isDelete){
        let parentIndex=getParentIndex();
        if(parentIndex!==undefined){
            commentsArr[parentIndex].children=commentsArr[parentIndex].children.filter(child=>child != _id)

            if(!commentsArr[parentIndex].children.length){
                commentsArr[parentIndex].isReplyLoaded=false;
            }
        }

        commentsArr.splice(index,1);
    }

    if(commentData.childrenLevel===0 && isDelete){
        setTotalParentCommentsLoaded(preVal=>preVal-1)
    }

    setBlog({...blog,comments:{results:commentsArr},activity:{...activity,total_parent_comments:total_parent_comments-(commentData.childrenLevel===0 && isDelete?1:0)}})
  }

  const loadReplies=({skip=0})=>{
    if(children.length){
        hideReplies();
        axios.post("http://localhost:3000/get-replies",{_id,skip})
        .then(({data:{replies}})=>{
            commentData.isReplyLoaded=true;
            for(let i=0;i<replies.length;i++){
                replies[i].childrenLevel=commentData.childrenLevel+1;
                commentsArr.splice(index+1+i+skip,0,replies[i])
            }
            setBlog({...blog,comments:{...comments,results:commentsArr}})
        })
        .catch(err=>{
            console.log(err);
        })
    }
  }
  const hideReplies=()=>{
    commentData.isReplyLoaded=false;
    removeCommentsCard(index+1);
  }
  const handleReplyClick=()=>{
    if(!access_token){
        return toast.error("Login to reply the comment")
    }
    setReplying(preVal=>!preVal);
  }

  const deleteComment=(e)=>{
    e.target.setAttribute("disabled",true);
    axios.post("http://localhost:3000/delete-comment",{_id},{
        headers:{
            'Authorization':`Bearer ${access_token}`
        }
    })
    .then(()=>{
        e.target.removeAttribute("disabled");
        removeCommentsCard(index+1,true);
    })
    .catch(err=>{
        console.log(err);
    })
  }

  return (
    <div
      className="w-100"
      style={{ paddingLeft: `${leftVal * 10}px` }}
    >
      <div className="my-4 p-4 rounded border border-light-subtle border-opacity-10 " style={{marginLeft:"1rem"}}>
        <div
          className=" d-flex gap-2 mb-2"
          style={{ alignItems: "center" }}
        >
          <img
            src={profile_img}
            className="rounded-circle mb-1"
            style={{ width: "40px", height: "40px" }}
          />
          <p
            style={{
              overflow: "hidden",
              fontSize: "15px",
            }}
          >
            {fullname} @{commented_by_username}
          </p>
          <p className="fs-6">{getDay(commentedAt)}</p>
        </div>
        <p className="fs-5 ml-3" style={{ fontFamily: "monospace" }}>
          {comment}
        </p>
        <div>

          <div className="d-flex gap-1 align-items-center mt-2 ">
            {
                commentData.isReplyLoaded ?
                <button className="btn text-secondary bg-transparent p-2 align-items-center" onClick={hideReplies}
                >
                 <i className="bi bi-chat-dots "></i> Hide Reply
                </button>:
                <button className="btn text-secondary bg-transparent p-1 align-items-center" onClick={loadReplies}>
                    <i className="bi bi-chat-dots"></i> {children.length} Reply
                 </button>
            }
            <button
              className="btn border-0 text-decoration-underline"
              style={{ background: "none" }}
              onClick={handleReplyClick}
            >
              Reply
            </button>
            {
                username===commented_by_username || username===blog_author ?
                <button
          className="btn rounded-circle border border-light bg-transparent" onClick={deleteComment}
          onMouseOver={(e) => {
            e.target.style.color = 'red'; 
            e.target.style.backgroundColor = 'lightcoral'; 
          }}
          onMouseOut={(e) => {
            e.target.style.color = 'black'; 
            e.target.style.backgroundColor = 'transparent';
          }}
        >
          <i className="bi bi-trash px-2 py-1"></i>
        </button>:""
            }
          </div>
          {
            isReplying?
            <div className="mt-3">
                <CommentField action="reply" index={index} replyingTo={_id} setReplying={setReplying}/>
            </div>:""
          }
        </div>
      </div>
    </div>
  );
};
export default CommentCard;
