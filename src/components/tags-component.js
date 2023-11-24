import { useContext } from "react";
import { EditorContext } from "../Pages/editor.pages";


const Tag = ({ tag ,tagIndex}) => {
    let{blog,blog:{tags},setBlog}=useContext(EditorContext);


    const addEditable=(e)=>{
        e.target.setAttribute("contentEditable",true);
        e.target.focus();
    }
    const handleTagEdit=(e)=>{
        if(e.keyCode===13||e.keyCode===188){
            e.preventDefault();
            let currentTag=e.target.innerText;
            tags[tagIndex]=currentTag;
            setBlog({...blog,tags});
            e.target.setAttribute("contentEditable",false);
        }
        
    }

    const handleTagDelete = () => {
        tags=tags.filter(t=>t !== tag);
        setBlog({...blog,tags});
    };
  
    return (
        <div className="d-inline-flex align-items-center">
        <span className="position-relative">
          <span className="position-relative px-2 py-2 pe-4 ps-3 bg-light rounded-pill d-inline-flex align-items-center">
            <span className="me-2" onKeyDown={handleTagEdit} onClick={addEditable} style={{ outline: 'none' }}>{tag}</span>
            <button
              className="position-absolute top-50 translate-middle-y end-0 bg-transparent border-0 p-0 pe-1"
              onClick={handleTagDelete}
            >
              <i className="bi bi-x fs-4 text-dark" style={{ pointerEvents: 'none' }}></i>
            </button>
          </span>
        </span>
      </div>
      
    );
  };
  
  export default Tag;
  