import React from "react";
import UserActivityType from "../../utils/UserActivityType";

interface UIUserActivityProps {
  activity: string;
  // { type: UserActivityType; timestamp: number; info: any }
}

const UIUserActivity = (props: UIUserActivityProps) => {
  const activity = JSON.parse(props.activity);
  console.log(activity);
  return <div>test</div>;
};

export default UIUserActivity;
