import { Link, useNavigate, useParams } from "react-router-dom";
import logo from "../imgs/logo.png";
import { uploadImage } from "../common/aws";
import defaultBanner from '../imgs/blog banner.png'
import { useContext, useEffect } from "react";
import { Toaster,toast } from "react-hot-toast"
import './blog-editor.css'
import { EditorContext } from "../Pages/editor.pages";
import EditorJS from '@editorjs/editorjs';
import {tools} from './tools';
import axios from "axios";
import { UserContext } from "../App";
import AnimationWrapper from "../common/page-animation";

const BlogEditor = () => {
    let{blog,blog:{title,banner,content,tags,des},setBlog,textEditor, setTextEditor,setEditorState}=useContext(EditorContext)
    
    let{userAuth:{access_token}}=useContext(UserContext);
    let {blog_id}=useParams();
    let navigate=useNavigate();
    useEffect(()=>{
      if(!textEditor.isReady){
        setTextEditor(new EditorJS({
          holderId:"textEditor",
          data:Array.isArray(content)? content[0]:content,
          tools: tools,
          placeholder:"Let's Write an awesome story"
      }))
      }
        
    },[])

    const handleKeyDown=(e)=>{
        if(e.key===13){
            e.preventDefault();
        }
    }
    const handleTitleChange=(e)=>{
        let input=e.target;
        input.style.height='auto';
        input.style.height=input.scrollHeight+"px";
        setBlog({...blog,title:input.value})
    }
    const handleBannerUpload=(e)=>{
        let img=e.target.files[0];
        if(img){
            let loadingToast=toast.loading("Uploading...")
            uploadImage(img).then((url)=>{
                if(url){
                    toast.dismiss(loadingToast);
                    toast.success("Uploaded 👍")
                    setBlog({...blog,banner:url});
                }
            })
            .catch(err=>{
                toast.dismiss(loadingToast);
                return toast.error(err);
            })
        }
    }
    const handleError=(e)=>{
        let img=e.target
        img.src=defaultBanner
    }
    const handlePublishEvent=()=>{
        if(!banner.length){
          return toast.error("Upload a blog banner to publish it")
        }
        if(!title.length){
          return toast.error("Enter the blog title to publish it");
        }
        if(textEditor.isReady){
          textEditor.save().then(data => {
            if(data.blocks.length){
              setBlog({...blog,content:data});
              setEditorState("publish")
            }else{
              return toast.error('Content cannot be empty')
            }
          })
          .catch((err)=>{
            console.log(err);
          })
        }
    }

    const handleSaveDraft=(e)=>{
      e.preventDefault();
      if(e.target.className.includes("disable")){
        return;
    }
    if(!title.length){
        return toast.error('Please enter a valid title before saving it as draft');
    }
    let loadingToast=toast.loading("Saving Draft...");
    e.target.classList.add('disable');

    if(textEditor.isReady){
      textEditor.save().then(content=>{
        let blogObj={
          title,banner,des,content,tags,draft:true
      }

        axios.post("http://localhost:3000/create-blog",{...blogObj,id:blog_id},{
        headers:{
            'Authorization':`Bearer ${access_token}`
        }
    })
    .then(()=>{
        e.target.classList.remove('disable');
        toast.dismiss(loadingToast);
        toast.success("Saved 👍");

        setTimeout(()=>{
            navigate("/")
        },500);
    })
    .catch(({response})=>{
        e.target.classList.remove('disable');
        toast.dismiss(loadingToast);
        return toast.error(response.data.error);
    })
      })
    }
    
    
    }
  return (
    <>
    <AnimationWrapper>
      <nav className="navbar navbar-expand-md">
        <Link to="/" className="navbar-brand">
          <img
            src={logo}
            className="img-fluid"
            alt="Logo"
            style={{ width: "60px", height: "auto" }}
          />
        </Link>
        <p
          className="ms-2 d-none d-md-inline-flex  text-black overflow-hidden text-nowrap"
          style={{ width: "100%", maxWidth: "100%", textOverflow: "ellipsis" }}
        >
            {title.length?title:"New Blog"}
          
        </p>
        <div className="d-flex gap-4 ms-auto">
          <button className="btn btn-dark rounded-pill btn-sm px-4 py-2" onClick={handlePublishEvent}>
            Publish
          </button>
          <button className="btn btn-secondary rounded-pill btn-sm px-3 py-2 text-nowrap" onClick={handleSaveDraft}>
            Save Draft
          </button>
        </div>
      </nav>
      <Toaster/>
      
      <section  >
        <div className="mx-auto" style={{ maxWidth: "900px" }}>
        <div
            className="position-relative embed-responsive embed-responsive-16by9"
            style={{
              backgroundColor: "white",
              border: "0.5px solid lightgrey",
              position: "relative",
              overflow: "hidden", 
            }}
          >
            <label htmlFor="uploadBanner">
              <img
                src={banner}
                alt="Default Banner"
                onError={handleError}
                className="z-5"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover", 
                  position: "relative",
                  top: "0",
                  left: "0",
                }}
              />
                <input id="uploadBanner"
                type="file"
                accept=".png, .jpg, .jpeg"
                hidden
                onChange={handleBannerUpload}/>
            </label>
          </div>
          <textarea
          defaultValue={title}
          placeholder="Blog Title"
          className="form-control fw-bold mt-3 lh-1-25 placeholder-opacity"
          onKeyDown={handleKeyDown}
          onChange={handleTitleChange}
          style={{
            fontWeight: 500,
            fontSize: '2rem',
            width: '100%',
            height: '20%',
            resize:'none', 
            outline: 'none',
            overflow: "hidden",
          }}
          >
          </textarea>
          <hr className="w-100 opacity-10 mb-5"/>
          <div id="textEditor" className="gelasio-font">

          </div>
        </div>
      </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;
