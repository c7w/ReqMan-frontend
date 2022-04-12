import ReactEcharts from "echarts-for-react";
import React, { Component } from "react";
import "./TimeFigure.css";

// interface ActiveFigureProps {
//   text: string; // text for parsing
//   title: string; // chart title
// }

const TimeFigure = () => {
  const test =
    '[{"user":{"name":"c7w"},"time":[10,20,30,30,40,100,40]},{"user":{"name":"wxy"},"time":[5,10,20,20,30,40,5,10]},{"user":{"name":"hbx"},"time":[10,20,30,70,40,10,40]}]';
  const data = JSON.parse(test);
  // const data = JSON.parse(props.text);
  const allData: any = [];
  const allName: any = [];
  data.forEach((value: any) => {
    const name = value.user.name;
    const time = value.time;
    allData.push(time);
    allName.push(name);
  });
  const option = {
    title: {
      text: "开发工程师能力分析",
      left: "center",
    },
    dataset: [
      {
        source: allData,
      },
      {
        transform: {
          type: "boxplot",
          config: {
            itemNameFormatter: function (params: any) {
              return allName[Number(params.value)];
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
      name: "开发用时(小时)",
      splitArea: {
        show: true,
      },
    },
    series: [
      {
        name: "boxplot",
        type: "boxplot",
        datasetIndex: 1,
      },
      {
        name: "outlier",
        type: "scatter",
        encode: { x: 1, y: 0 },
        datasetIndex: 2,
      },
    ],
  };
  return (
    <div className={"timeChart"}>
      <ReactEcharts option={option} />
    </div>
  );
};

export default TimeFigure;
