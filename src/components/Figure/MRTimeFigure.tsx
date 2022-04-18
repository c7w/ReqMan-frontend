import ReactEcharts from "echarts-for-react";
import React, { Component, useEffect } from "react";
import "./MRTimeFigure.css";
import { useDispatch, useSelector } from "react-redux";
import { getMergeStore } from "../../store/slices/IssueSlice";
import { getRDTSInfo } from "../../store/functions/RDTS";

// interface MRTimeFigureProps {
//   text: string; // text for parsing
//   title: string; // chart title
// }

const MRTimeFigure = () => {
  const dispatcher = useDispatch();
  // let mergedata = {};

  useEffect(() => {
    getRDTSInfo(dispatcher, 2).then((data) => {
      /*
        data[0][0]: issue
        data[0][1]: commit
        data[0][2]: merge
        data[0][3]: mr-sr
        data[1]: SRList
        data[2]: ProjectInfo
      */
      console.log(data);
      // mergedata = data[0][2];
    });
  });

  // put in all the MRs get from an repo
  const test =
    '{"data":[{"reviewedAt":1646906641.84},{"reviewedAt":1649907641.84},{"reviewedAt":1648908641},{"reviewedAt":1647909641.231}]}';
  const data = JSON.parse(test).data;
  // const data = JSON.parse(props.text);
  const all_mr: number[] = [];
  data.forEach((value: any) => {
    const time = value.reviewedAt;
    all_mr.push(time * 1000);
  });
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
