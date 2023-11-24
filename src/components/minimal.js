import { Link } from "react-router-dom";
import { getDay } from "../common/date";
const MinimalBlogPost = ({ blog, index }) => {
  let {
    title,
    blog_id: id,
    author: {
      personal_info: { fullname, username, profile_img },
    },
    publishedAt,
  } = blog;
  return (
    <Link
      to={`/blog/${id}`}
      className="text-dark  fs-sm-4 fs-lg-5 d-flex gap-3 align-items-center pb-5 mb-5"
      style={{ textDecoration: "none" }}
    >
      <h1
        className="fw-bold text-secondary pe-3"
        style={{ margin: "0", opacity: 0.2, fontSize:"3rem" }}
      >
        {index < 10 ? "0" + (index + 1) : index}
      </h1>
      <div>
      <div className="d-flex flex-wrap gap-2 align-items-center mb-0">
          <img
            src={profile_img}
            alt="profile"
            className="rounded-circle mb-3"
            style={{ width: "40px", height: "40px" }}
          />
          <p
            className="line-clamp-1"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "150px",
            }}
          >
            {fullname} @{username}
          </p>
          <p
            style={{
              minWidth: "fit-content",
              display: "inline-block",
              fontSize: "0.85rem",
              color: "gray",
            }}
          >
            {getDay(publishedAt)}
          </p>
        </div>
        <h6
          className="mb-2 fs-6 fw-bold"
          style={{
            fontFamily: "Gelasio, sans-serif",
            lineHeight: "1.5715",
          }}
        >
          {title}
        </h6>
      </div>
    </Link>
  );
};
export default MinimalBlogPost;
