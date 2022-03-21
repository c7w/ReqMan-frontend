import React from "react";
import "./Calendar.css";
import List from "./List";

const Calendar = () => {
  return (
    <div className="calendar">
      <List name={"to do list"} />
      <List name={"wip list"} />
      <List name={"done list"} />
    </div>
  );
};

export default Calendar;
