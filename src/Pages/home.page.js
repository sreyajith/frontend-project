import { useEffect, useState } from "react";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage";
import axios from "axios";
import Loader from "../components/loader";
import BlogPostCard from "../components/blog-post";
import MinimalBlogPost from "../components/minimal";
import { activeTabRef } from "../components/inpage";
import NoDataMessage from "../components/nodata";
import { filterPaginationData } from "../common/filter";
import LoadMoreDataBtn from "../components/loadMore";
const HomePage = () => {
  let [blogs, setBlog] = useState(null);
  let [trendingBlogs, setTrendingBlog] = useState(null);
  let [pageState, setPageState] = useState("home");
  let categories = [
    "hollywood",
    "CGI",
    "Film making",
    "Blockbusters",
    "Streaming",
    "memes",
    "Diverse Representation",
    "Cultural Representation",
    "Tech",
    "Social media",
    "Realism",
    "DirectorialStyles",
  ];

  const fetchLatestBlogs = ({ page = 1 }) => {
    axios
      .post("http://localhost:3000/latest-blogs", { page })
      .then(async ({ data }) => {
        let formatedData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          counteRoute: "/all-latest-blogs-count",
        });
        setBlog(formatedData);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const fetchBlogsByCategory = ({ page = 1 }) => {
    axios
      .post("http://localhost:3000/search-blogs", { tag: pageState, page })
      .then(async ({ data }) => {
        let formatedData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          counteRoute: "/search-blogs-count",
          data_to_send: { tag: pageState }
        });
        setBlog(formatedData);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const fetchTrendingBlogs = () => {
    axios
      .get("http://localhost:3000/trending-blogs")
      .then(({ data }) => {
        setTrendingBlog(data.blogs);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const loadBlogByCategory = (e) => {
    const category = e.target.innerText.toLowerCase();
    setBlog(null);
    if (pageState === category) {
      setPageState("home");
      return;
    }
    setPageState(category);
  };
  useEffect(() => {
    activeTabRef.current.click();
    if (pageState === "home") {
      fetchLatestBlogs({ page: 1 });
    } else {
      fetchBlogsByCategory({ page: 1 });
    }
    if (!trendingBlogs) {
      fetchTrendingBlogs();
    }
  }, [pageState]);
  return (
    <AnimationWrapper>
      <section
        className="h-cover"
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          paddingLeft: "100px",
          paddingRight: "100px",
        }}
      >
        <div className="w-100 pe-5">
          <InPageNavigation
            routes={[pageState, "trending blogs"]}
            defaultHidden={"trending blogs"}
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
                fetchDataFun={
                  (pageState === "home" ? fetchLatestBlogs : fetchBlogsByCategory)
                }
              />
            </>
            {trendingBlogs === null ? (
              <Loader />
            ) : trendingBlogs.length ? (
              trendingBlogs.map((blog, i) => {
                return (
                  <AnimationWrapper
                    transition={{ duration: 1, delay: i * 0.1 }}
                    key={i}
                  >
                    <MinimalBlogPost blog={blog} index={i} />
                  </AnimationWrapper>
                );
              })
            ) : (
              <NoDataMessage message="No trending blogs" />
            )}
          </InPageNavigation>
        </div>

        <div
          className="d-none d-md-block"
          style={{
            minWidth: "40%",
            maxWidth: "400px",
            borderLeft: "0.5px solid rgba(220, 220, 220, 1)",
            paddingLeft: "2rem",
            paddingTop: "0.5rem",
            "@media (maxWidth: 767.98px)": { display: "none" },
          }}
        >
          <div className="d-flex flex-column gap-3 gap-lg-10">
            <div>
              <h6 className="fs-5 mb-4">
                Stories form all interests <i className="bi bi-hearts"></i>
              </h6>
              <div className="d-flex flex-wrap gap-1">
                {categories.map((category, i) => {
                  return (
                    <button
                      onClick={loadBlogByCategory}
                      key={i}
                      className={
                        "btn btn-light px-8 rounded-pill mb-2 " +
                        (pageState === category.toLowerCase()
                          ? "btn btn-dark "
                          : " ")
                      }
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <h6 className="fs-5 mb-4 mt-3">
                <i className="pe-2">Trending</i>
                <i className="bi bi-cup-hot-fill"></i>
              </h6>
              {trendingBlogs === null ? (
                <Loader />
              ) : trendingBlogs.length ? (
                trendingBlogs.map((blog, i) => {
                  return (
                    <AnimationWrapper
                      transition={{ duration: 1, delay: i * 0.1 }}
                      key={i}
                    >
                      <MinimalBlogPost blog={blog} index={i} />
                    </AnimationWrapper>
                  );
                })
              ) : (
                <NoDataMessage message="No blogs published" />
              )}
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};
export default HomePage;
