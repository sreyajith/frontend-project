import { Link } from "react-router-dom";
import { getFullDay } from "../common/date";

const AboutUser=({className,bio,social_links, joinedAt})=>{
    return(
        <div className={"mt-3 d-flex flex-column align-items-center"+className} style={{justifyContent:"center" ,alignItems:"center"}}>
            <p className="fs-6 fw-normal  ">{bio.length?bio:"Nothing to read here"}</p>
            <div className=" d-flex text-secondary gap-4 ps-1" style={{ whiteSpace: 'nowrap' }}>
                {
                    Object.keys(social_links).map((key)=>{
                        let link=social_links[key];
                        return link? <Link to={link} key={key} target="_blank"className="text-secondary fs-4" style={{ textDecoration: 'none',whiteSpace: 'nowrap' }}><i className={"bi "+(key !=='website'?"bi-"+key:"bi-globe")}></i></Link>:" "
                    })
                }
            </div>
            <p className="fs-6 text-secondary mt-3 ">Joined on {getFullDay(joinedAt)}</p>
        </div>
    )
}
export default AboutUser;