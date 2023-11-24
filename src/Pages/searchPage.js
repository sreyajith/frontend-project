import { useParams } from "react-router-dom";
import InPageNavigation from "../components/inpage";
import { useEffect, useState } from "react";
import Loader from "../components/loader";
import AnimationWrapper from "../common/page-animation";
import NoDataMessage from "../components/nodata";
import LoadMoreDataBtn from "../components/loadMore";
import BlogPostCard from "../components/blog-post";
import axios from "axios";
import { filterPaginationData } from "../common/filter";
import UserCard from "../components/userCard";

const SearchPage = () => {
  let { query } = useParams();
  let [blogs, setBlog] = useState(null);
  const [users, setUsers] = useState(null);

  const searchBlog = ({ page = 1, create_new_arr = false }) => {
    axios
      .post("http://localhost:3000/search-blogs", { query, page })
      .then(async ({ data }) => {
        console.log(data.blogs);
        let formatedData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          counteRoute: "/search-blogs-count",
          data_to_send: { query },
          create_new_arr,
        });
        console.log(formatedData);
        setBlog(formatedData);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const fetchUsers = () => {
    axios
      .post("http://localhost:3000/search-users", { query })
      .then(({ data: { users } }) => {
        setUsers(users);
      });
  };
  useEffect(() => {
    resetState();
    searchBlog({ page: 1, create_new_arr: true });
    fetchUsers();
  }, [query]);

  const resetState = () => {
    setBlog(null);
    setUsers(null);
  };
  const UserCardWrapper = () => {
    return (
      <>
        {users === null ? (
          <Loader />
        ) : users.length ? (
          users.map((user, i) => {
            return (
              <AnimationWrapper
                key={i}
                transition={{ duration: 1, delay: i * 0.08 }}
              >
                <UserCard user={user} />
              </AnimationWrapper>
            );
          })
        ) : (
          <NoDataMessage message="No user found" />
        )}
      </>
    );
  };
  return (
    <section
    className="h-cover"
    style={{
      display: "flex",
      justifyContent: "center",
      gap: "10px",
      paddingLeft: "100px",
      paddingRight: "50px",
    }}
    >
      <div className="w-100 pe-5">
        <InPageNavigation
          routes={[`Search Results from "${query}"`, "Accounts Matched"]}
          defaultHidden={["Accounts Matched"]}
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
            <LoadMoreDataBtn state={blogs} fetchDataFun={searchBlog} />
          </>
          <UserCardWrapper />
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
        <p className="fs-5 mb-4 fw-normal ">User related search <i className="bi bi-person"></i></p>
        <UserCardWrapper/>
      </div>
    </section>
  );
};
export default SearchPage;
