import React from "react";
import "./Calendar.css";
import List from "./List";

interface CalendarProps {
  readonly userInfo: string;
}

const Calendar = (props: CalendarProps) => {
  const userData = JSON.parse(props.userInfo).data;
  console.log("Calendar: " + props.userInfo);
  return (
    <div className="calendar">
      <List name={"待办事项"} />
      <List name={"进行中"} />
      <List name={"已完成"} />
    </div>
  );
};

export default Calendar;
