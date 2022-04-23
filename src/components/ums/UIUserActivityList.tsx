import React from "react";
import UIUserActivity from "./UIUserActivity";

interface UIUserActivityListProps {
  myActivities: string;
  userStore: string;
}

const UIUserActivityList = (props: UIUserActivityListProps) => {
  const myActivities = JSON.parse(props.myActivities);
  console.log(myActivities);
  return (
    <div
      className="user-activity-list"
      style={{
        maxWidth: "35vw",
        overflowY: "scroll",
        maxHeight: "80vh",
        paddingTop: "2rem",
        paddingRight: "1rem",
      }}
    >
      {myActivities.activities.map((activity: any, index: number) => (
        <UIUserActivity
          key={index}
          activity={JSON.stringify(activity)}
          userStore={props.userStore}
        />
      ))}
    </div>
  );
};

export default UIUserActivityList;
