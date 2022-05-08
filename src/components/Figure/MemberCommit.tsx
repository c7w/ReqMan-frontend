import ReactEcharts from "echarts-for-react";
import React from "react";
import "./MemberCommit.css";
import { useSelector } from "react-redux";
import { getProjectStore } from "../../store/slices/ProjectSlice";

interface MemberCommitProps {
  text: string; // text for parsing
  title: string; // chart title
}

const MemberCommit = (props: MemberCommitProps) => {
  const data = JSON.parse(props.text).data;
  const projectStore = useSelector(getProjectStore);

  const all_data: any = [];
  const allUserInfo = JSON.parse(projectStore).data.users;
  const all_name_id: number[] = [];
  const all_names: any = [];
  allUserInfo.forEach((value: any) => {
    all_name_id.push(value.id);
    all_names.push(value.name);
  });
  for (let i = 0; i < all_name_id.length; i++) {
    all_data.push(0);
  }
  const max_len_per_row = 10;
  const new_all_names: string[] = [];
  all_names.forEach((value: string) => {
    if (value.length > max_len_per_row) {
      new_all_names.push(
        value.substring(0, max_len_per_row) +
          " \n" +
          value.substring(max_len_per_row)
      );
    } else {
      new_all_names.push(value + " ");
    }
  });

  data.forEach((item: any) => {
    const id = item.user_committer;
    for (let i = 0; i < all_name_id.length; i++) {
      if (all_name_id[i] === id) {
        all_data[i] += 1;
        break;
      }
    }
  });

  for (let i = new_all_names.length - 1; i >= 0; i--) {
    if (all_data[i] === 0) {
      new_all_names.splice(i, 1);
      all_data.splice(i, 1);
    }
  }

  const option = {
    title: {
      text: props.title,
    },
    tooltip: {},
    legend: {
      data: ["个人提交次数"],
    },
    xAxis: {
      name: "\n\n姓名",
      data: new_all_names,
      axisLabel: {
        interval: 0,
        rotate: "30",
      },
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
