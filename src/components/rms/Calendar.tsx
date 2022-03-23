import React from "react";
import "./Calendar.css";
import List from "./List";

const Calendar = () => {
  return (
    <div className="calendar">
      <List name={"待办事项"} />
      <List name={"进行中"} />
      <List name={"已完成"} />
    </div>
  );
};

export default Calendar;
