import ReactEcharts from "echarts-for-react";
import React, { Component } from "react";
import "./CommitFigure.css";

interface CommitFigureProps {
  text: string; // text for parsing
  title: string; // chart title
}

const CommitFigure = (props: CommitFigureProps) => {
  const data = JSON.parse(props.text).data;
  // const data = JSON.parse(props.text);
  const all_commit: number[] = [];
  data.forEach((value: any) => {
    const times = value.commit_times;
    times.forEach((value1: any) => {
      all_commit.push(value1);
    });
  });
  function compare(value1: number, value2: number) {
    if (value1 < value2) {
      return -1;
    } else if (value1 > value2) {
      return 1;
    } else {
      return 0;
    }
  }
  all_commit.sort(compare);
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
  const series1 = [];
  const series2 = [];
  for (let i = 0; i < commit_time.length; i++) {
    series1.push([commit_time[i] * 1000, commit_num[i]]);
    series2.push([commit_time[i] * 1000, commit_acc[i]]);
  }

  const option = {
    title: {
      text: props.title,
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["当前commit数量", "累计commit数量"],
    },
    xAxis: {
      type: "time",
      name: "时间",
    },
    yAxis: {
      type: "value",
      name: "数量",
    },
    series: [
      {
        name: "当前commit数量",
        type: "line",
        data: series1,
        smooth: true,
      },
      {
        name: "累计commit数量",
        type: "line",
        data: series2,
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
