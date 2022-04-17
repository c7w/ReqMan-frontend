import ReactEcharts from "echarts-for-react";
import React, { Component } from "react";
import "./CommitFigure.css";

// interface CommitFigureProps {
//   text: string; // text for parsing
//   title: string; // chart title
// }

const CommitFigure = () => {
  const test =
    '{"data":[{"mr_count":1,"commit_count":2,"additions":371,"deletions":11,"issue_count":1,"issue_times":[174219],"commit_times":[1649761649,1649753387]},{"mr_count":1,"commit_count":2,"additions":371,"deletions":11,"issue_count":1,"issue_times":[174219],"commit_times":[1649761649,1649753387]}]}';
  const data = JSON.parse(test).data;
  // const data = JSON.parse(props.text);
  const all_commit = [];
  data.forEach((value: any) => {
    const times = value.commit_times;
    times.forEach((value1: any) => {
      all_commit.push(value1);
    });
  });
  const option = {};
  return (
    <div className={"commitChart"}>
      <ReactEcharts option={option} />
    </div>
  );
};

export default CommitFigure;
