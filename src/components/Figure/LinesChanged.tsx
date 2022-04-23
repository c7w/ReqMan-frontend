import ReactEcharts from "echarts-for-react";
import React, { Component } from "react";
import "./LinesChanged.css";

interface LinesChangedProps {
  text: string; // text for parsing
  title: string; // chart title
}

const LinesChanged = (props: LinesChangedProps) => {
  // const data = JSON.parse(props.text).data;
  const test =
    '{"data":[{"commiter_name":"hxj","additions":10,"deletions":20},{"commiter_name":"glb","additions":20,"deletions":10},{"commiter_name":"wxy","additions":70,"deletions":0},{"commiter_name":"glb","additions":50,"deletions":30}]}';
  const data = JSON.parse(test).data;

  const option = {
    title: {
      text: props.title,
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["累计commit数量"],
    },
    xAxis: {
      type: "value",
      min: 10,
      max: 100,
      interval: 20,
      name: "\n\n行数",
    },
    yAxis: {
      type: "value",
      name: "数量",
    },
    series: [
      {
        name: "累计commit数量",
        type: "bar",
        data: [
          [12, 1],
          [17, 1],
          [42, 2],
          [31, 1],
        ],
        smooth: true,
      },
    ],
  };

  return (
    <div className={"LinesChangedChart"}>
      <ReactEcharts option={option} />
    </div>
  );
};

export default LinesChanged;
