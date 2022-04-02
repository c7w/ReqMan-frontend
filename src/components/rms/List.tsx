import React from "react";
import "./List.css";
import SRCard from "./SRCard";
import { Divider } from "antd";

interface ListProps {
  readonly name: string;
  readonly stateSRList: string;
}

const List = (props: ListProps) => {
  return (
    <div className="list-list">
      <div className="list-header">{props.name}</div>
      <Divider />
      <div className="list-content">
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
