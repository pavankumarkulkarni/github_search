import React from "react";
import styled from "styled-components";
import { GithubContext } from "../context/context";
import { ExampleChart, Pie3D, Column3D, Bar3D, Doughnut2D } from "./Charts";
const Repos = () => {
  const { repos } = React.useContext(GithubContext);

  let mostLanguages = repos.reduce((item, repo) => {
    const { language, stargazers_count } = repo;
    if (!language) {
      return item;
    } else {
      if (!item[language]) {
        item[language] = { label: language, value: 1, stars: stargazers_count };
      } else {
        item[language] = {
          ...item[language],
          value: item[language].value + 1,
          stars: item[language].stars + 1,
        };
      }
    }
    return item;
  }, {});
  const mostUsedLanguages = Object.values(mostLanguages)
    .sort((a, b) => {
      return b.value - a.value;
    })
    .slice(0, 5);

  const starsGazers = Object.values(mostLanguages)
    .map((item) => {
      return { ...item, value: item.stars };
    })
    .sort((a, b) => {
      return b.value - a.value;
    })
    .slice(0, 5);

  let temp = repos.reduce((item, total) => {
    let { stargazers_count, forks_count, name } = total;
    item[name] = { label: name, stars: stargazers_count, forks: forks_count };

    return item;
  }, {});

  let starredRepos = Object.values(temp)
    .map((item) => {
      return { label: item.label, value: item.stars };
    })
    .sort((a, b) => {
      return b.value - a.value;
    })
    .slice(0, 5);

  let forkedRepos = Object.values(temp)
    .map((item) => {
      return { label: item.label, value: item.forks };
    })
    .sort((a, b) => {
      return b.value - a.value;
    })
    .slice(0, 5);

  return (
    <section className="section">
      <Wrapper className="section-center">
        <Pie3D data={mostUsedLanguages} />
        <Column3D data={starredRepos} />
        <Doughnut2D data={starsGazers} />
        <Bar3D data={forkedRepos} />
        <div></div>
      </Wrapper>
    </section>
  );
};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;
