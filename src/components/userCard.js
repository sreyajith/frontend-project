import { Link } from "react-router-dom";

const UserCard=({user})=>{
    let{personal_info:{fullname,username,profile_img}}=user;
    return(
        <Link to={`/user/${username}`} className="text-dark d-flex gap-2 align-items-center pb-2 mb-1" style={{ textDecoration: 'none' }}>
            <img src={profile_img} alt="profile" className="rounded-circle mb-3"
            style={{ width: "30px", height: "30px",borderBottom: "0.5px solid rgba(245, 242, 242, 0.5)" }}/>
            <div>
            <h6
            className="line-clamp-1"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "150px",
            }}
          >
            {fullname}
          </h6>
          <p className="text-secondary fs-6">@{username}</p>
            </div>
            
        </Link>
    )
}
export default UserCard;