import echarts from "echarts";
import ReactEcharts from "echarts-for-react";
import React, { Component } from "react";
import "./IssueFigure.css";

const IssueFigure = () => {
  const test =
    '{"iterations":["iter1","iter2","iter3","iter4"],"all_sr_count":[12,14,16,18],"issues":[1,2,4,2]}';
  const data = JSON.parse(test);
  const iterations = data.iterations;
  const allSR = data.all_sr_count;
  const issues = data.issues;

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        crossStyle: {
          color: "#999",
        },
      },
    },
    toolbox: {
      feature: {
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ["line", "bar"] },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    legend: {
      data: ["Total SR", "Issues", "Error Rate"],
    },
    xAxis: [
      {
        type: "category",
        data: iterations,
        axisPointer: {
          type: "shadow",
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        name: "Precipitation",
        min: 0,
        max: 260,
        interval: 50,
        axisLabel: {
          formatter: "{value} ml",
        },
      },
      {
        type: "value",
        name: "Temperature",
        min: 0,
        max: 25,
        interval: 5,
        axisLabel: {
          formatter: "{value} °C",
        },
      },
    ],
    series: [
      {
        name: "Evaporation",
        type: "bar",
        tooltip: {
          valueFormatter: function (value: any) {
            return value + " ml";
          },
        },
        data: [
          2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3,
        ],
      },
      {
        name: "Precipitation",
        type: "bar",
        tooltip: {
          valueFormatter: function (value: any) {
            return value + " ml";
          },
        },
        data: [
          2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3,
        ],
      },
      {
        name: "Temperature",
        type: "line",
        yAxisIndex: 1,
        tooltip: {
          valueFormatter: function (value: any) {
            return value + " °C";
          },
        },
        data: [
          2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2,
        ],
      },
    ],
  };
  return (
    <div className={"issueChart"}>
      <ReactEcharts option={option} />
    </div>
  );
};

export default IssueFigure;
