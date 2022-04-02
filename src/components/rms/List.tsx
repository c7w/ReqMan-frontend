import React, { useState } from "react";
import "./List.css";
import SRCard from "./SRCard";
import { Divider } from "antd";

interface ListProps {
  readonly name: string;
  readonly stateSRList: string;
}

const List = (props: ListProps) => {
  const tmp_SRList = JSON.parse(props.stateSRList);
  const [SRList, setSRList] = useState(props.stateSRList);
  console.log("list: " + SRList);
  return (
    <div className="list-list">
      <div className="list-header">{props.name}</div>
      <Divider />
      <div className="list-content">
        <p>{SRList}</p>
        <SRCard />
        <SRCard />
        <SRCard />
        <SRCard />
        <SRCard />
      </div>
    </div>
  );
};

export default List;
