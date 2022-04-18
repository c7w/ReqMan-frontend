import ReactEcharts from "echarts-for-react";
import React, { Component } from "react";
import "./TimeFigure.css";

// interface CountDistributionProps {
//   text: string; // text for parsing
//   title: string; // chart title
// }

const CountDistributionFigure = () => {
  const test =
    '{"data":[{"mr_count":1,"commit_count":2,"additions":371,"deletions":11,"issue_count":1,"issue_times":[174219],"commit_times":[1649750000,1649760000,1649760000,1649770000,1649775000,1649775000]},{"mr_count":1,"commit_count":2,"additions":371,"deletions":11,"issue_count":1,"issue_times":[174219],"commit_times":[1649780000]}]}';
  const data = JSON.parse(test).data;
  // const data = JSON.parse(props.text);
  const commit_cnt: number[] = [];
  const mr_cnt: number[] = [];
  const issue_cnt: number[] = [];
  data.forEach((value: any) => {
    commit_cnt.push(value.commit_count);
    mr_cnt.push(value.mr_count);
    issue_cnt.push(value.issue_count);
  });
  const all_name: string[] = ["MR数量", "Commit数量", "Issue数量"];
  const all_cnt: any = [mr_cnt, commit_cnt, issue_cnt];
  const option = {
    title: {
      text: "MR,commit及Issue数量分析",
      left: "center",
    },
    dataset: [
      {
        source: all_cnt,
      },
      {
        transform: {
          type: "boxplot",
          config: {
            itemNameFormatter: function (params: any) {
              return all_name[Number(params.value)];
            },
          },
        },
      },
      {
        fromDatasetIndex: 1,
        fromTransformResult: 1,
      },
    ],
    tooltip: {
      trigger: "item",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      left: "10%",
      right: "10%",
      bottom: "15%",
    },
    yAxis: {
      type: "category",
      boundaryGap: true,
      nameGap: 30,
      splitArea: {
        show: false,
      },
      splitLine: {
        show: false,
      },
    },
    xAxis: {
      type: "value",
      name: "数量",
      splitArea: {
        show: true,
      },
    },
    series: [
      {
        name: "Issue 解决时间",
        type: "boxplot",
        datasetIndex: 1,
      },
      {
        name: "特殊点",
        type: "scatter",
        encode: { x: 1, y: 0 },
        datasetIndex: 2,
      },
    ],
  };
  return (
    <div className={"DistributionChart"}>
      <ReactEcharts option={option} />
    </div>
  );
};

export default CountDistributionFigure;
