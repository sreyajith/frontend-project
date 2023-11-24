import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader";
import { UserContext } from "../App";
import AboutUser from "../components/about";
import { filterPaginationData } from "../common/filter";
import InPageNavigation from "../components/inpage";
import BlogPostCard from "../components/blog-post";
import NoDataMessage from "../components/nodata";
import LoadMoreDataBtn from "../components/loadMore";
import PageNotFound from "./404page";

export const profileDataStructure = {
  personal_info: {
    fullname: "",
    username: "",
    profile_img: "",
    bio: "",
  },
  account_info: {
    total_posts: 0,
    total_reads: 0,
  },
  social_links: {},
  joinedAt: " ",
};

const ProfilePage = () => {
  let { id: profileId } = useParams();
  let [profile, setProfile] = useState(profileDataStructure);
  let [loading, setLoading] = useState(true);
  let [blogs, setBlogs] = useState(null);
  let[profileLoaded,setProfileLoaded]=useState("");
  let {
    userAuth: { username },
  } = useContext(UserContext);
  let {
    personal_info: { fullname, username: profile_username, profile_img, bio },
    account_info: { total_posts, total_reads },
    social_links,
    joinedAt,
  } = profile;

  const fetchUserProfile = () => {
    axios
      .post("http://localhost:3000/get-profile", { username: profileId })
      .then(({ data: user }) => {
        if(user !==null){
            setProfile(user);
        }
        
        setProfileLoaded(profileId)
        getBlogs({ user_id: user._id });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const getBlogs = ({ page = 1, user_id }) => {
    user_id = user_id === undefined ? blogs.user_id : user_id;
    axios
      .post("http://localhost:3000/search-blogs", { page, author: user_id })
      .then(async ({ data }) => {
        let formatedDate = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          counteRoute: "/search-blogs-count",
          data_to_send: { author: user_id },
        });
        formatedDate.user_id = user_id;
        setBlogs(formatedDate);
      });
  };
  useEffect(() => {
    if(profileId !==profileLoaded){
        setBlogs(null);
    }
    if(blogs===null){
        resetState();
        fetchUserProfile();
    }
    
  }, [profileId,blogs]);

  const resetState = () => {
    setProfile(profileDataStructure);
    setLoading(true);
    setProfileLoaded("");
  };
  return (
    <AnimationWrapper>
      {loading ? 
        <Loader />
       : profile_username.length?<section
      className="h-100 d-md-flex flex-row-reverse justify-content-start gap-5 gap-md-12 pe-4"
      style={{ minHeight: "1100px", paddingRight:"100px", paddingLeft:"100px" }}
    >
      <div className="d-flex flex-column align-items-center mx-auto  mt-5" style={{paddingRight:"120px", alignItems:"center"}}>
        <img
          src={profile_img}
          alt="profile image"
          className="rounded-circle bg-grey"
          style={{
            width: "100px",
            height: "100px",
            "@media (max-width: 768px)": {
              width: "32px",
              height: "32px",
              
            },
          }}
        />
        <h6 className="mt-3 fs-5 fw-normal">@{profile_username}</h6>
        <p className="fs-6 mt-3 " style={{ textTransform: "capitalize" }}>
          {fullname}
        </p>
        <p>
          {total_posts.toLocaleString()} Blogs -{" "}
          {total_reads.toLocaleString()} Reads
        </p>
        <div className="d-flex gap-4 mt-2">
          {profileId === username ? (
            <Link
              to={"/settings/edit-profile"}
              className="text-dark btn btn-light px-8 rounded-pill mb-2"
              style={{ textDecoration: "none" }}
            >
              Edit Profile
            </Link>
          ) : (
            " "
          )}
        </div>
        <AboutUser
          className="d-md-none d-sm-none d-lg-block"
          bio={bio}
          social_links={social_links}
          joinedAt={joinedAt}
        />
      </div>
      <div
        className="w-100 pe-4"
      >
        <InPageNavigation
          routes={["Blogs Published", "About"]}
          defaultHidden={"About"}
        >
          <>
            {blogs === null ? (
              <Loader />
            ) : blogs.results.length ? (
              blogs.results.map((blog, i) => {
                return (
                  <AnimationWrapper
                    transition={{ duration: 1, delay: i * 0.1 }}
                    key={i}
                  >
                    <BlogPostCard
                      content={blog}
                      author={blog.author.personal_info}
                    />
                  </AnimationWrapper>
                );
              })
            ) : (
              <NoDataMessage message="No blogs published" />
            )}
            <LoadMoreDataBtn
              state={blogs}
              fetchDataFun={getBlogs}
            />
          </>
          <AboutUser bio={bio} social_links={social_links} joinedAt={joinedAt}/>
        </InPageNavigation>
      </div>
    </section>
        :<PageNotFound/>
      }
    </AnimationWrapper>
  );
};

export default ProfilePage;
