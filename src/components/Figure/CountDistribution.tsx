import ReactEcharts from "echarts-for-react";
import React, { Component } from "react";
import "./CountDistribution.css";

// interface CountDistributionProps {
//   text: string; // text for parsing
//   title: string; // chart title
// }

const CountDistributionFigure = () => {
  const test =
    '{"data":[{"mr_count":1,"commit_count":2,"issue_count":1},{"mr_count":5,"commit_count":2,"issue_count":4},{"mr_count":3,"commit_count":1,"issue_count":1},' +
    '{"mr_count":10,"commit_count":7,"issue_count":8},{"mr_count":5,"commit_count":4,"issue_count":0},{"mr_count":2,"commit_count":9,"issue_count":6},' +
    '{"mr_count":7,"commit_count":8,"issue_count":4},{"mr_count":8,"commit_count":2,"issue_count":6},{"mr_count":5,"commit_count":3,"issue_count":4}]}';
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
        name: "平均值",
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
