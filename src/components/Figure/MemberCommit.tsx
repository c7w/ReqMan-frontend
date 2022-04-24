import ReactEcharts from "echarts-for-react";
import React, { Component } from "react";
import "./MemberCommit.css";
import { useSelector } from "react-redux";
import { getProjectStore } from "../../store/slices/ProjectSlice";

interface MemberCommitProps {
  text: string; // text for parsing
  title: string; // chart title
}

const MemberCommit = (props: MemberCommitProps) => {
  const data = JSON.parse(props.text).data;
  const all_data: number[] = [];
  const projectStore = useSelector(getProjectStore);
  const allUserInfo = JSON.parse(projectStore).data.users;
  const all_names: string[] = [];
  allUserInfo.forEach((value: any) => {
    all_names.push(value.name);
  });
  for (let i = 0; i < all_names.length; i++) {
    all_data.push(0);
  }
  data.forEach((item: any) => {
    const name = item.commiter_name;
    for (let i = 0; i < all_names.length; i++) {
      if (all_names[i] === name) {
        all_data[i] += 1;
        break;
      }
    }
  });
  const option = {
    title: {
      text: props.title,
    },
    tooltip: {},
    legend: {
      data: ["个人提交次数"],
    },
    xAxis: {
      type: "category",
      name: "\n\n姓名",
      data: all_names,
    },
    yAxis: {
      type: "value",
      name: "数量",
    },
    series: [
      {
        name: "个人提交次数",
        type: "bar",
        data: all_data,
      },
    ],
  };

  return (
    <div className={"MemberCommitChart"}>
      <ReactEcharts option={option} />
    </div>
  );
};

export default MemberCommit;
