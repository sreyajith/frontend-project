import { useContext } from "react";
import toast, { Toaster } from "react-hot-toast";
import { EditorContext } from "../Pages/editor.pages";
import "./publish-form.css";
import Tag from "./tags-component";
import axios from "axios";
import { UserContext } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import AnimationWrapper from '../common/page-animation'
function PublishForm() {
  let characterLimit = 200;
  let tagLimit = 8;
  let {blog_id}=useParams();
  let {
    blog,
    blog: { banner, title, tags, des,content },
    setEditorState,
    setBlog,
  } = useContext(EditorContext);

  let{userAuth:{access_token}}=useContext(UserContext);

  let navigate=useNavigate();

  const handleCloseEvent = () => {
    setEditorState("editor");
  };
  const handleBlogTitleChange = (e) => {
    let input = e.target;
    setBlog({ ...blog, title: input.value });
  };

  const handleBlogDesChange = (e) => {
    let input = e.target;
    setBlog({ ...blog, des: input.value });
  };
  const handleKeyDown = (e) => {
    if (e.key === 13) {
      e.preventDefault();
    }
  };
  const handleKeyDownn = (e) => {
    if (e.keyCode === 13 || e.keyCode === 188) {
      e.preventDefault();
      let tag = e.target.value;
      if (tags.length < tagLimit) {
        if (!tags.includes(tag) && tag.length) {
          setBlog({ ...blog, tags: [...tags, tag] });
        }
      } else {
        toast.error(`You can add max ${tagLimit} tags`);
      }
      e.target.value = "";
    }
  };

  const publishBlog=(e)=>{
    if(e.target.className.includes("disable")){
        return;
    }
    if(!title.length){
        return toast.error('Please enter a valid title before publishing');
    }
    if(!des.length || des.length>characterLimit){
        return toast.error(`Please enter a description for your post withing ${characterLimit} characters to publish`);
    }
    if(!tags.length){
        return toast.error('Please enter at least one tag to help us rank your blog')
    }
    let loadingToast=toast.loading("Publishing...");
    e.target.classList.add('disable');
    let blogObj={
        title,banner,des,content,tags,draft:false
    }
    axios.post("http://localhost:3000/create-blog",{...blogObj,id:blog_id},{
        headers:{
            'Authorization':`Bearer ${access_token}`
        }
    })
    .then(()=>{
        e.target.classList.remove('disable');
        toast.dismiss(loadingToast);
        toast.success("Published 👍");

        setTimeout(()=>{
            navigate("/")
        },500);
    })
    .catch(({response})=>{
        e.target.classList.remove('disable');
        toast.dismiss(loadingToast);
        return toast.error(response.data.error);
    })
  }

  return (
    <>
    <AnimationWrapper>
      <button
        className="position-absolute top-0 end-0 bg-transparent border-0"
        style={{
          zIndex: "10",
          top: "5%",
        }}
        onClick={handleCloseEvent}
      >
        <i className="bi bi-x fs-3 text-dark"></i>
      </button>
      <section className=" py-16 position-relative customsection">
        <Toaster />

        <div className="mx-auto" style={{ maxWidth: "550px" }}>
          <p className="mb-1 text-secondary">Preview</p>

          <div
            className="position-relative embed-responsive embed-responsive-16by9 mt-4"
            style={{
              backgroundColor: "white",
              border: "0.5px solid lightgrey",
              overflow: "hidden",
              borderRadius: "8px",
            }}
          >
            <img
              src={banner}
              alt="banner"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                position: "absolute",
                top: "0",
                left: "0",
                borderRadius: "8px",
              }}
            />
          </div>
          <h2 className="mt-3 fw-bold lh-1-25" style={{ fontSize: "2rem" }}>
            {title}
          </h2>
          <p className="gelasio-font mt-4">{des}</p>
        </div>
        <div className="p-lg-3 p-2 mt-2">
          <p className="mb-3 text-secondary">Blog Title</p>
          <input
            type="text"
            placeholder="Blog Title"
            defaultValue={title}
            className="input-box pl-4"
            style={{
              border: "1px solid lightgrey",
              borderRadius: "4px",
              width: "100%",
            }}
            onChange={handleBlogTitleChange}
          />

          <p className="p-lg-3 p-2 mt-2 text-secondary">
            Short description about your blog
          </p>
          <textarea
            maxLength={characterLimit}
            defaultValue={des}
            className="mb-2"
            style={{
              width: "100%",
              height: "120px",
              resize: "none",
              overflow: "hidden",
              borderRadius: "4px",
              border: "1px solid lightgrey",
            }}
            onChange={handleBlogDesChange}
            onKeyDown={handleKeyDown}
          ></textarea>

          <p className="text-end text-secondary small">
            {characterLimit - des.length} Characters left
          </p>
          <p className="p-lg-3 p-2 mt-2 text-secondary">
            Topics- (Helps in searching and ranking your blog post)
          </p>

          <div
            className="position-relative input-box ps-2 pe-2 py-2 pb-4 border focus"
            style={{ backgroundColor: "#EFEEEE" }}
          >
            <input
              type="text"
              placeholder="Topic"
              class="form-control sticky bg-white px-4 py-2 mb-3"
              onKeyDown={handleKeyDownn}
            />
            {tags.map((tag, i) => {
              return <Tag tag={tag} tagIndex={i} />;
            })}
          </div>
          <p className="text-end text-secondary small">
            {tagLimit - tags.length} Tags left
          </p>
          <button className="btn btn-dark px-8 rounded-pill" onClick={publishBlog}>Publish</button>
        </div>
      </section>
      </AnimationWrapper>
    </>
  );
}

export default PublishForm;
