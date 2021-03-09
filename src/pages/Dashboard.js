import React from "react";
import { Info, Repos, User, Search, Navbar } from "../components";
import loadingImage from "../images/preloader.gif";
import { GithubContext } from "../context/context";
const Dashboard = () => {
  const { isLoading } = React.useContext(GithubContext);

  if (!isLoading) {
    return (
      <main>
        <Navbar></Navbar>
        <Search />
        <Info />
        <User />
        <Repos />
      </main>
    );
  } else {
    return (
      <main>
        <Navbar></Navbar>
        <Search />
        <img className="loading-img" src={loadingImage} alt="Loading" />
      </main>
    );
  }
};

export default Dashboard;
