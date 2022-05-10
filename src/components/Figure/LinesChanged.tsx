import ReactEcharts from "echarts-for-react";
import React, { Component } from "react";
import "./LinesChanged.css";

interface LinesChangedProps {
  text: string; // text for parsing
  title: string; // chart title
}

const LinesChanged = (props: LinesChangedProps) => {
  const data = JSON.parse(props.text);

  const roundLine = (value: number) => {
    // Map [0, 50) to 25, [50, 100) to 75, ...
    return Math.floor(value / 50) * 50 + 25;
  };

  // const all_add: number[] = [];
  // const all_del: number[] = [];
  // const all_change: number[] = [];
  let change_out = 0;

  const final_result: any = {}; // [[25, 1], [75, 3], ..., [roundLine(lines), count]]

  data.forEach((value: any) => {
    // Lines >= 500
    if (value >= 500) {
      change_out += 1;
      return;
    }

    if (final_result[roundLine(value)] === undefined) {
      final_result[roundLine(value)] = 1;
    } else {
      final_result[roundLine(value)] += 1;
    }
  });

  // data.forEach((item: any) => {
  //   all_add.push(item.additions);
  //   if (item.additions > max_add) max_add = item.additions;
  //   if (item.additions < min_add) min_add = item.additions;
  //   all_del.push(item.deletions);
  //   if (item.deletions > max_del) max_del = item.deletions;
  //   if (item.deletions < min_del) min_del = item.deletions;
  //   const change = item.additions + item.deletions;
  //   all_change.push(change);
  //   if (change > max_change) max_change = change;
  //   if (change < min_change) min_change = change;
  // });
  // max_add = Math.ceil(max_add / 50) * 50;
  // max_del = Math.ceil(max_del / 50) * 50;
  // max_change = Math.ceil(max_change / 50) * 50;
  // min_add = Math.floor(min_add / 50) * 50;
  // min_del = Math.floor(min_del / 50) * 50;
  // min_change = Math.floor(min_change / 50) * 50;
  // const add_data: any = [];
  // let add_out = 0;
  // let del_out = 0;
  // let change_out = 0;
  // all_add.forEach((value: number) => {
  //   value = Math.floor(value / 50) * 50 + 25;
  //   let if_continue = 0;
  //   if (value > 500) {
  //     add_out += 1;
  //     if_continue = 1;
  //   }
  //   if (if_continue === 0) {
  //     let exist = false;
  //     add_data.forEach((item: any) => {
  //       if (item[0] === value) {
  //         item[1] += 1;
  //         exist = true;
  //       }
  //     });
  //     if (exist === false) {
  //       const new_item = [value, 1];
  //       add_data.push(new_item);
  //     }
  //   }
  // });
  // const del_data: any = [];
  // all_del.forEach((value: number) => {
  //   value = Math.floor(value / 50) * 50 + 25;
  //   let if_continue = 0;
  //   if (value > 500) {
  //     del_out += 1;
  //     if_continue = 1;
  //   }
  //   if (if_continue === 0) {
  //     let exist = false;
  //     del_data.forEach((item: any) => {
  //       if (item[0] === value) {
  //         item[1] += 1;
  //         exist = true;
  //       }
  //     });
  //     if (exist === false) {
  //       const new_item = [value, 1];
  //       del_data.push(new_item);
  //     }
  //   }
  // });
  // const change_data: any = []; // [value, count]
  // all_change.forEach((value: number) => {
  //   value = Math.floor(value / 50) * 50 + 25;
  //   let if_continue = 0; // 0: not out, 1: out
  //   if (value > 500) {
  //     change_out += 1;
  //     if_continue = 1;
  //   }
  //   if (if_continue === 0) {
  //     // not out
  //     let exist = false;
  //     change_data.forEach((item: any) => {
  //       if (item[0] === value) {
  //         item[1] += 1; // count
  //         exist = true;
  //       }
  //     });
  //     if (exist === false) {
  //       const new_item = [value, 1];
  //       change_data.push(new_item);
  //     }
  //   }
  // });
  // console.debug(Object.entries(final_result));
  const option = {
    title: [
      {
        text: props.title,
      },
      {
        subtext: "还有 " + change_out + " 次代码更改行数 >500 行 ",
        left: "50%",
        top: "85%",
        textAlign: "center",
      },
    ],
    tooltip: {},
    legend: {
      data: ["更改行数统计"],
    },
    xAxis: {
      type: "value",
      min: 0,
      max: 500,
      interval: 50,
      name: "\n\n行数",
    },
    yAxis: {
      type: "value",
      name: "数量",
    },
    series: [
      {
        name: "更改行数分段计频",
        type: "bar",
        data: Object.entries(final_result),
      },
    ],
  };

  return (
    <div className={"LinesChangedChart"}>
      <ReactEcharts option={option} />
    </div>
  );
};

export default LinesChanged;
