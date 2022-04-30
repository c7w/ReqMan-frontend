import ReactEcharts from "echarts-for-react";
import React, { Component } from "react";
import "./IssueFigure.css";

interface IssueFigureProps {
  text: string; // text for parsing
  title: string; // chart title
}

const IssueFigure = (props: IssueFigureProps) => {
  const test =
    '{"iterations":["iter1","iter2","iter3","iter4"],"all_sr_count":[12,14,16,18],"issues":[1,2,4,2]}';
  // const data = JSON.parse(test);
  const data = JSON.parse(props.text);
  const iterations = data.iterations;
  const allSR = data.all_sr_count;
  let maxSR = 0;
  allSR.forEach((value: number) => {
    if (value > maxSR) {
      maxSR = value;
    }
  });
  const issues = data.issues;
  let maxIssue = 0;
  allSR.forEach((value: number) => {
    if (value > maxIssue) {
      maxIssue = value;
    }
  });
  const maxNum = maxIssue > maxSR ? maxIssue : maxSR;
  const errors = [];
  for (let i = 0; i < issues.length; i++) {
    const curErr = ((issues[i] / allSR[i]) * 100).toFixed(2);
    errors.push(curErr);
  }

  const option = {
    title: {
      text: props.title,
      // text: props.title,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        crossStyle: {
          color: "#999",
        },
      },
    },
    toolbox: {
      feature: {
        dataView: { show: false },
        magicType: { show: true, type: ["line", "bar"] },
        restore: { show: true },
        saveAsImage: { show: false },
      },
    },
    legend: {
      data: ["功能需求数量", "问题数量", "错误率"],
    },
    xAxis: [
      {
        type: "category",
        data: iterations,
        axisPointer: {
          type: "shadow",
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        name: "数量",
        min: 0,
        max: maxNum + 2,
        axisLabel: {
          formatter: "{value}",
        },
      },
      {
        type: "value",
        name: "错误率",
        min: 0,
        max: 100,
        axisLabel: {
          formatter: "{value} %",
        },
      },
    ],
    series: [
      {
        name: "功能需求数量",
        type: "bar",
        tooltip: {
          valueFormatter: function (value: any) {
            return value;
          },
        },
        data: allSR,
      },
      {
        name: "问题数量",
        type: "bar",
        tooltip: {
          valueFormatter: function (value: any) {
            return value;
          },
        },
        data: issues,
      },
      {
        name: "错误率",
        type: "line",
        yAxisIndex: 1,
        tooltip: {
          valueFormatter: function (value: any) {
            return value + "%";
          },
        },
        data: errors,
      },
    ],
  };
  return (
    <div className={"issueChart"}>
      <ReactEcharts option={option} />
    </div>
  );
};

export default IssueFigure;
