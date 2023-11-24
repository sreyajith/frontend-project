
const Img =({url,caption})=>{
    return(
        <div>
            <img className="w-100"
            src={url}/>
            {caption.length?<p className="w-100 text-align-center my-3 text-secondary fs-6">{caption}</p>:""}
            
        </div>
    )
}
const Quote=({quote,caption})=>{
    return(
        <div className="p-2 pl-4" style={{borderLeft:"4px solid purple",backgroundColor:"rgba(238, 111, 177, 0.21)"}}>
            <p className="fs-6" style={{fontFamily:"cursive"}}>{quote}</p>
            {caption.length?<p className="w-100 fs-6" style={{color:"purple"}}>{caption}</p>:""}
        </div>
    )
}

const List =({style,items})=>{
    return(
        <ul className={`pl-4 ${style === "ordered" ? "list-group-numbered" : "list-group"}`}>
      {items.map((listItem, i) => {
        return (
          <li key={i} className={`pl-4 ${style === "ordered" ? "list-group-item" : ""}`} dangerouslySetInnerHTML={{ __html: listItem }}></li>
        );
      })}
    </ul>
    )
}
const BlogContent=({block})=>{
    let{type,data}=block;

    if(type==="paragraph"){
        return <p dangerouslySetInnerHTML={{__html:data.text}}></p>
    }
    if(type==="header"){
        if(data.level===3){
            return <h3 className="fs-3 fw-bold" dangerouslySetInnerHTML={{__html:data.text}}></h3>
        }
        return <h2 className="fs-2 fw-bold" dangerouslySetInnerHTML={{__html:data.text}}></h2>
    }
    if(type==="image"){
        return <Img url={data.file.url} caption={data.caption}/>
    }
    if(type==="quote"){
        return <Quote quote={data.text} caption={data.caption}/>
    }
    if(type==="list"){
        return <List style={data.style} items={data.items}/> 
    }
}
export default BlogContent;