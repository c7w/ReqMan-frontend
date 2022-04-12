import ReactEcharts from "echarts-for-react";
import React, { Component } from "react";
import "./ActiveFigure.css";

const ActiveFigure = () => {
  const test =
    '[{"user":{"name":"c7w"},"mr":10,"line":3000},{"user":{"name":"wxy"},"mr":8,"line":1500},{"user":{"name":"hbx"},"mr":7,"line":2000}]';
  const data = JSON.parse(test);
  const MRdata: any = [];
  const LineData: any = [];
  data.forEach((value: any) => {
    const name = value.user.name;
    const MR = value.mr;
    const line = value.line;
    const curDataMR = {
      value: MR,
      name: name,
    };
    const curDataLine = {
      value: line,
      name: name,
    };
    MRdata.push(curDataMR);
    LineData.push(curDataLine);
  });

  const option = {
    title: [
      {
        text: "开发工程师活跃度分析",
        left: "center",
      },
      {
        subtext: "MR数量统计",
        left: "25%",
        top: "80%",
        textAlign: "center",
      },
      {
        subtext: "代码行数统计",
        left: "75%",
        top: "80%",
        textAlign: "center",
      },
    ],
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        name: "MR数量",
        type: "pie",
        radius: "50%",
        data: MRdata,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        left: 0,
        right: "50%",
        top: 0,
        bottom: 0,
      },
      {
        name: "代码行数",
        type: "pie",
        radius: "50%",
        data: LineData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        left: "50%",
        right: 0,
        top: 0,
        bottom: 0,
      },
    ],
  };
  return (
    <div className={"activeChart"}>
      <ReactEcharts option={option} />
    </div>
  );
};

export default ActiveFigure;
