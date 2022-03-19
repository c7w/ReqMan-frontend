import React from "react";
import "./Calendar.css";
import List from "./List";

class Calendar extends React.Component {
  render() {
    return (
      <div className="calendar">
        <List name={"to do list"} />
        <List name={"wip list"} />
        <List name={"done list"} />
      </div>
    );
  }
}

export default Calendar;
