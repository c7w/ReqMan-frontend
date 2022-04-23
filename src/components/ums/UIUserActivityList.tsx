import React from "react";
import UIUserActivity from "./UIUserActivity";

interface UIUserActivityListProps {
  myActivities: string;
}

const UIUserActivityList = (props: UIUserActivityListProps) => {
  const myActivities = JSON.parse(props.myActivities);
  console.log(myActivities);
  return (
    <div
      className="user-activity-list"
      style={{
        maxWidth: "50vw",
        overflowY: "scroll",
        maxHeight: "70vh",
        paddingTop: "1rem",
        paddingRight: "1rem",
      }}
    >
      {myActivities.activities.map((activity: any, index: number) => (
        <UIUserActivity key={index} activity={JSON.stringify(activity)} />
      ))}
    </div>
  );
};

export default UIUserActivityList;
