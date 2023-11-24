import { Link } from "react-router-dom";
import { getDay } from "../common/date";

const BlogPostCard = ({ content, author }) => {
  let {
    publishedAt,
    tags,
    title,
    des,
    banner,
    activity: { total_likes },
    blog_id: id,
  } = content;
  let { fullname, profile_img, username } = author;

  return (
    <Link to={`/blog/${id}`} className="text-dark d-flex gap-8 align-items-center border-bottom border-grey pb-5 mb-4" style={{ textDecoration: 'none' }}>
      <div className="w-100" style={{ paddingLeft: "30px" }}>
        <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
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
          className="mb-3 text-2xl fw-bold"
          style={{
            fontFamily: "Gelasio, sans-serif",
            lineHeight: "1.5715",
          }}
        >
          {title}
        </h6>
        <p
          className="my-3 text-xl pe-4 d-none d-md-block"
          style={{
            fontFamily: "Gelasio, sans-serif",
            lineHeight: "1.5715",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            maxHeight: "2.6em",
            maxWidth: "1100px",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {des}
        </p>
        <div>
          <span className="btn btn-light px-8 rounded-pill mb-2">
            {tags[0]}
          </span>
          <span
            className="btn btn-outline-dark rounded-circle p-2 mb-2 d-inline-flex align-items-center"
            style={{ fontSize: "0.75rem", borderColor: "#ccc" }}
          >
            <i className="bi bi-balloon-heart me-1"></i>
            {total_likes}
          </span>
        </div>
      </div>
      <div className="aspect-ratio-1x1 bg-secondary" style={{ width: "12rem" }}>
  <img
    src={banner}
    alt="banner"
    className="w-100 h-100 object-cover"
    style={{ width: "100%", height: "100%", objectFit: "cover" }}
  />
</div>

    </Link>
  );
};

export default BlogPostCard;
