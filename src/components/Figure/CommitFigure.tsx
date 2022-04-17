import ReactEcharts from "echarts-for-react";
import React, { Component } from "react";
import moment from 'moment';
import "./CommitFigure.css";

// interface CommitFigureProps {
//   text: string; // text for parsing
//   title: string; // chart title
// }

const CommitFigure = () => {
  const test =
    '{"data":[{"mr_count":1,"commit_count":2,"additions":371,"deletions":11,"issue_count":1,"issue_times":[174219],"commit_times":[1649761649,1649761649,1649761649,1649761649,1649761649,1649753387]},{"mr_count":1,"commit_count":2,"additions":371,"deletions":11,"issue_count":1,"issue_times":[174219],"commit_times":[1649761649,1649761660,1649761700,1649753387,1649762345]}]}';
  const data = JSON.parse(test).data;
  // const data = JSON.parse(props.text);
  const all_commit: number[] = [];
  data.forEach((value: any) => {
    const times = value.commit_times;
    times.forEach((value1: any) => {
      all_commit.push(value1);
    });
  });
  all_commit.sort();
  const commit_num = [];
  const commit_acc: number[] = [];
  const commit_time = [];
  for (let i = 0; i < all_commit.length; i++) {
    if (i === 0) {
      commit_num.push(1);
      commit_acc.push(1);
      commit_time.push(all_commit[i]);
    } else {
      if (all_commit[i] === all_commit[i - 1]) {
        commit_num[commit_num.length - 1] += 1;
        commit_acc[commit_num.length - 1] += 1;
      } else {
        commit_num.push(1);
        commit_acc.push(commit_acc[commit_acc.length - 1] + 1);
        commit_time.push(all_commit[i]);
      }
    }
  }
  console.log(commit_num);
  console.log(commit_acc);
  console.log(commit_time);

  const option = {
    title: {
      text: "Commit数量统计表",
    },
    // tooltip: {
    //   trigger: "axis",
    //   formatter: function (params) {
    //     params = params[0];
    //     const date = new Date(params.name);
    //     return (
    //       date.getDate() +
    //       "/" +
    //       (date.getMonth() + 1) +
    //       "/" +
    //       date.getFullYear() +
    //       " : " +
    //       params.value[1]
    //     );
    //   },
    //   axisPointer: {
    //     animation: false,
    //   },
    // },
    xAxis: {
      type: "time",
      data: commit_time,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "total_commit",
        type: "line",
        data: commit_acc,
        smooth: true,
      },
      {
        name: "commit_number",
        type: "line",
        data: commit_num,
        smooth: true,
      },
    ],
  };

  return (
    <div className={"commitChart"}>
      <ReactEcharts option={option} />
    </div>
  );
};

export default CommitFigure;
