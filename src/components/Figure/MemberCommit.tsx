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
  const all_name_id: number[] = [];
  const all_names: string[] = [];
  allUserInfo.forEach((value: any) => {
    all_name_id.push(value.id);
    all_names.push(value.name);
  });
  for (let i = 0; i < all_name_id.length; i++) {
    all_data.push(0);
  }
  data.forEach((item: any) => {
    const id = item.user_committer;
    for (let i = 0; i < all_name_id.length; i++) {
      if (all_name_id[i] === id) {
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
