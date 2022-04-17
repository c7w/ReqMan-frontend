import ReactEcharts from "echarts-for-react";
import React, { Component } from "react";
import "./CommitFigure.css";

interface CommitFigureProps {
  text: string; // text for parsing
  title: string; // chart title
}

const CommitFigure = (props: CommitFigureProps) => {
  const test =
    '[{"user":{"name":"c7w"},"mr":10,"line":3000},{"user":{"name":"wxy"},"mr":8,"line":1500},{"user":{"name":"hbx"},"mr":7,"line":2000},' +
    '{"user":{"name":"c7w"},"mr":10,"line":3000},{"user":{"name":"wxy"},"mr":8,"line":1500},{"user":{"name":"hbx"},"mr":7,"line":2000},' +
    '{"user":{"name":"c7w"},"mr":10,"line":1000},{"user":{"name":"wxy"},"mr":8,"line":1500},{"user":{"name":"hbx"},"mr":7,"line":2000}]';
  // const data = JSON.parse(test);
  const data = JSON.parse(props.text);
  const option = {
  };
  return (
    <div className={"commitChart"}>
      <ReactEcharts option={option} />
    </div>
  );
};

export default CommitFigure;
