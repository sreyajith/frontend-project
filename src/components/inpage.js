import { useEffect, useRef, useState } from "react";

export let activeTablineRef;
export let activeTabRef;
const InPageNavigation = ({ routes,defaultHidden=[],defaultActiveIndex=0,children }) => {

    let [inPageNavIndex, setInPageNavIndex]=useState(defaultActiveIndex);
    activeTabRef=useRef();
    activeTablineRef=useRef();
    const changePageState=(btn,i)=>{
        let{offsetWidth,offsetLeft}=btn;
        activeTablineRef.current.style.width=offsetWidth+"px";
        activeTablineRef.current.style.left=offsetLeft+"px";
        setInPageNavIndex(i);
    }
    useEffect(()=>{
        changePageState(activeTabRef.current,defaultActiveIndex)
    },[])

  return (
    <>
    <div
      className="position-relative mb-4"
      style={{
        backgroundColor: "white",
        borderBottom: "0.5px solid rgba(245, 242, 242, 0.5)",
        display: "flex",
        flexWrap: "nowrap",
        overflowX: "auto",
      }}
    >
      {routes.map((route, index) => {
        return (
          <button
          ref={index===defaultActiveIndex?activeTabRef:null}
            key={index}
            className={"p-4 px-5 "+(inPageNavIndex===index?"text-black ":"text-secondary ")+(defaultHidden.includes(route)? " d-md-none ":" ")}
            style={{ textTransform: "capitalize" ,background: "none",
            border: "none",}}
            onClick={(e)=>{changePageState(e.target,index)}}
          >
            {route}
          </button>
        );
      })
      
    }
    <hr
        ref={activeTablineRef}
        className="position-absolute bottom-0"
        style={{
          width: "100%",
          transitionDuration: "300ms",
          border: "none",
          borderBottom: "2px solid black",
        }}
      />
    </div>
    {Array.isArray(children)?children[inPageNavIndex]:children}
    </>
    
  );
};
export default InPageNavigation;
