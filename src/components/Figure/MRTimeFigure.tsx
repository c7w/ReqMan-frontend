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
  const dispatcher = useDispatch();
  // const mergeStore = useSelector(getMergeStore);
  // const mergeData = JSON.parse(mergeStore).data;
  // console.log(mergeStore);

  useEffect(() => {
    console.log("updating !");
    const all_list = getRDTSInfo(dispatcher, 1);
    console.log(all_list);
  });

  const test =
    '{"data":[{"mr_count":1,"commit_count":2,"additions":371,"deletions":11,"issue_count":1,"issue_times":[174219],"commit_times":[1649750000,1649760000,1649760000,1649770000,1649775000,1649775000]},{"mr_count":1,"commit_count":2,"additions":371,"deletions":11,"issue_count":1,"issue_times":[174219],"commit_times":[1649780000]}]}';
  const data = JSON.parse(test).data;
  // const data = JSON.parse(props.text);
  const all_commit: number[] = [];
  data.forEach((value: any) => {
    const times = value.commit_times;
    times.forEach((value1: any) => {
      all_commit.push(value1);
    });
  });

  const option = {};

  return (
    <div className={"MRChart"}>
      <ReactEcharts option={option} />
    </div>
  );
};

export default MRTimeFigure;
