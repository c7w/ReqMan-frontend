import ReactEcharts from "echarts-for-react";
import React, { Component } from "react";
import "./IssueFigure.css";

const ActiveFigureMR = () => {
  const test =
    '[{"user":{"name":"c7w"},"mr":10,"line":3000},{"user":{"name":"wxy"},"mr":8,"line":1500},{"user":{"name":"hbx"},"mr":7,"line":2000}]';
  const data = JSON.parse(test);
  const MRdata: any = [];
  data.forEach((value: any) => {
    const name = value.user.name;
    const MR = value.mr;
    const curData = {
      value: MR,
      name: name,
    };
    MRdata.push(curData);
  });

  const option = {
    title: {
      text: "开发工程师活跃度：MR查看",
      left: "center",
    },
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
        radius: "60%",
        data: MRdata,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };
  return (
    <div className={"issueChart"}>
      <ReactEcharts option={option} />
    </div>
  );
};

export default ActiveFigureMR;
