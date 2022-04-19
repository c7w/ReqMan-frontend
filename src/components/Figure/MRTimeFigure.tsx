import ReactEcharts from "echarts-for-react";
import React, { Component, useEffect } from "react";
import "./MRTimeFigure.css";
import { useDispatch, useSelector } from "react-redux";
import { getMergeStore } from "../../store/slices/IssueSlice";
import { getRDTSInfo } from "../../store/functions/RDTS";

interface MRTimeFigureProps {
  text: string; // text for parsing
  title: string; // chart title
}

const MRTimeFigure = (props: MRTimeFigureProps) => {
  const data = JSON.parse(props.text).data;
  const all_mr: number[] = [];
  data.forEach((value: any) => {
    const time = value.authoredAt;
    all_mr.push(time * 1000);
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
  all_mr.sort(compare);
  const series1: any = [];
  let iter = 1;
  all_mr.forEach((value: any) => {
    series1.push([value, iter]);
    iter++;
  });

  const option = {
    title: {
      text: "MR数量统计表",
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["累计 MR 数量"],
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
        name: "累计 MR 数量",
        type: "line",
        data: series1,
        smooth: true,
      },
    ],
  };

  return (
    <div className={"MRChart"}>
      <ReactEcharts option={option} />
    </div>
  );
};

export default MRTimeFigure;
