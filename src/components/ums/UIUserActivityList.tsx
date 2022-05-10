import React from "react";
import UIUserActivity from "./UIUserActivity";
import { Empty } from "antd";

interface UIUserActivityListProps {
  myActivities: string;
  userInfo: string;
}

const UIUserActivityList = (props: UIUserActivityListProps) => {
  const myActivities = JSON.parse(props.myActivities);
  console.debug(myActivities);
  return (
    <div
      className="user-activity-list"
      style={{
        width: "100%",
        overflowY: "scroll",
        maxHeight: "80vh",
        paddingTop: "2rem",
        paddingRight: "1rem",
      }}
    >
      {myActivities.activities.length > 0 ? (
        myActivities.activities.map((activity: any, index: number) => (
          <UIUserActivity
            key={index}
            activity={JSON.stringify(activity)}
            userInfo={props.userInfo}
          />
        ))
      ) : (
        <Empty description="暂无用户活动" />
      )}
    </div>
  );
};

export default UIUserActivityList;
