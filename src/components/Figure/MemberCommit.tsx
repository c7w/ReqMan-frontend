import ReactEcharts from "echarts-for-react";
import React, { Component } from "react";
import "./MemberCommit.css";

interface MemberCommitProps {
  text: string; // text for parsing
  title: string; // chart title
}

const MemberCommit = (props: MemberCommitProps) => {
  const data = JSON.parse(props.text).data;
  // const test =
  //   '{"data":[{"commiter_name":"hxj","additions":10,"deletions":20},{"commiter_name":"glb","additions":20,"deletions":10},{"commiter_name":"wxy","additions":70,"deletions":0},{"commiter_name":"glb","additions":50,"deletions":30}]}';
  const all_data: any = [];
  data.forEach((item: any) => {
    const name = item.commiter_name;
    let exist = -1;
    for (let i = 0; i < all_data.length; i++) {
      if (all_data[i][0] === name) {
        all_data[i][1] += 1;
        exist = 1;
        break;
      }
    }
    if (exist === -1) {
      all_data.push([name, 1]);
    }
  });
  const option = {
    title: {
      text: props.title,
    },
    tooltip: {},
    legend: {
      data: ["个人commit次数"],
    },
    xAxis: {
      type: "category",
      name: "\n\n姓名",
    },
    yAxis: {
      type: "value",
      name: "数量",
    },
    series: [
      {
        name: "个人commit次数",
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
