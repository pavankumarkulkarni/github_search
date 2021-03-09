import React, { useState, useEffect } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const GithubContext = React.createContext();
const GithubProvider = ({ children }) => {
  const [reqRemaining, setReqRemaining] = useState("");
  const [reqLimit, setReqLimit] = useState("");
  const [error, setError] = useState({ show: false, msg: "" });
  const [user, setUser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);
  const [isLoading, setIsLoading] = useState(false);

  const remainingRequests = () => {
    fetch(`${rootUrl}/rate_limit`)
      .then((res) => {
        return res.json();
      })
      .then(({ rate }) => {
        let { limit, remaining } = rate;
        if (remaining === 0) {
          toggleError(true, "You exceeded hourly rates!");
        }
        setReqLimit(limit);
        setReqRemaining(remaining);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const toggleError = (show = false, msg = "") => {
    setError({ show, msg });
  };

  const setGithubUser = async (usr) => {
    setIsLoading(true);
    const response = await fetch(`${rootUrl}/users/${usr}`);
    const data = await response.json();
    if (response.status === 200) {
      toggleError();
      setUser(data);
      const { repos_url, followers_url } = data;
      await Promise.allSettled([
        fetch(repos_url).then((res) => res.json()),
        fetch(followers_url).then((res) => res.json()),
      ]).then((res) => {
        const [repos_response, followers_response] = res;
        const stat = "fulfilled";
        if (repos_response.status === stat) {
          setRepos(repos_response.value);
        }
        if (followers_response.status === stat) {
          setFollowers(followers_response.value);
        }
      });
    } else {
      toggleError(true, data.message);
    }
    remainingRequests();
    setIsLoading(false);
  };
  useEffect(remainingRequests, []);
  return (
    <GithubContext.Provider
      value={{
        error,
        reqRemaining,
        reqLimit,
        user,
        repos,
        followers,
        setGithubUser,
        isLoading,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export { GithubContext, GithubProvider };
