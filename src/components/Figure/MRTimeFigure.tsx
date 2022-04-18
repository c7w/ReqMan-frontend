import ReactEcharts from "echarts-for-react";
import React, { Component, useEffect } from "react";
import moment from "moment";
import "./MRTimeFigure.css";
import { useDispatch, useSelector } from "react-redux";
import { getMergeStore } from "../../store/slices/IssueSlice";
import { getRDTSInfo } from "../../store/functions/RDTS";

// interface MRTimeFigureProps {
//   text: string; // text for parsing
//   title: string; // chart title
// }

const MRTimeFigure = () => {
  // const dispatcher = useDispatch();
  // const mergeStore = useSelector(getMergeStore);
  // const mergeData = JSON.parse(mergeStore).data;
  // console.log(mergeData);
  //
  // useEffect(() => {
  //   const repo_info = getRDTSInfo(dispatcher, 1);
  //   console.log(repo_info);
  // });

  // put in all the MRs get from an repo
  const test =
    '{"data":[{"reviewedAt":1649906641.84},{"reviewedAt":1649907641.84}{"reviewedAt":1649908641},{"reviewedAt":1649909641.231}]}';
  const data = JSON.parse(test).data;
  // const data = JSON.parse(props.text);
  const all_mr: number[] = [];
  data.forEach((value: any) => {
    const time = value.reviewedAt;
    all_mr.push(time * 1000);
  });
  all_mr.sort();
  const series1 = [];
  let iter = 0;
  all_mr.forEach((value: any) => {
    series1.push([value, iter]);
    iter++;
  });

  const option = {};

  return (
    <div className={"MRChart"}>
      <ReactEcharts option={option} />
    </div>
  );
};

export default MRTimeFigure;
