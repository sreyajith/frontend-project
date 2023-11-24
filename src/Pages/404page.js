import { Link } from "react-router-dom";
import pageNotFoundImg from "../imgs/404.png";
import fulllogo from "../imgs/full-logo.png";
const PageNotFound = () => {
  return (
    <section
      className="position-relative p-10 text-center"
      style={{
        minHeight: "100px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img
        src={pageNotFoundImg}
        className="border border-2 border-grey rounded-3"
        style={{
          width: "14rem",
          height: "14rem",
          objectFit: "cover",
          marginBottom: "-1rem",
        }}
        alt="Page Not Found"
      />
      <p
        className="fs-2 fw-bold mt-4"
        style={{ fontFamily: "Gelasio, sans-serif", marginTop: "-1rem" }}
      >
        Page not found
      </p>
      <p className="mt-3 mb-4 text-secondary">
        The page you looking for does not exists. Head back to{" "}
        <Link to="/" className="text-decoration-underline text-dark">
          home page
        </Link>
      </p>
      <div className="mt-5">
        <img
          src={fulllogo}
          alt="logo"
          className="mx-auto"
          style={{ height: "4rem", maxWidth: "100%", userSelect: "none" }}
        />
        <p className="mt-2 text-secondary" style={{ fontSize: '0.875rem' }}>Take a Bite of Cinematic Delight: Join MovieBite and Share Your Film Feasts!</p>
      </div>
    </section>
  );
};
export default PageNotFound;
