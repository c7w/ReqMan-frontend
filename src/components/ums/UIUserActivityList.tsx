import React from "react";
import UIUserActivity from "./UIUserActivity";

interface UIUserActivityListProps {
  myActivities: string;
  userInfo: string;
}

const UIUserActivityList = (props: UIUserActivityListProps) => {
  const myActivities = JSON.parse(props.myActivities);
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
          userInfo={props.userInfo}
        />
      ))}
    </div>
  );
};

export default UIUserActivityList;