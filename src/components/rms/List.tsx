import React, { useEffect, useState } from "react";
import "./List.css";
import SRCard from "./SRCard";
import { Divider } from "antd";

interface ListProps {
  readonly name: string;
  readonly stateSRList: string;
}

const List = (props: ListProps) => {
  console.log("list: " + props.stateSRList);
  const tmp_SRList = eval(JSON.parse(props.stateSRList));
  // const [SRList, setSRList] = useState(props.stateSRList);
  // console.log("list: " + SRList);
  const mySRCardList: any = [];
  console.log(tmp_SRList);
  // console.log(tmp_SRList[0]);
  if (tmp_SRList) {
    tmp_SRList.forEach((value: any) => {
      mySRCardList.push(
        <SRCard
          id={value.id}
          title={value.title}
          priority={value.priority}
          disabled={value.disabled}
          description={value.description}
          currState={value.state}
          project={value.project}
          rank={value.rank}
          createdBy={value.createdBy}
          createdAt={value.createdAt}
        />
      );
    });
  }
  return (
    <div className="list-list">
      <div className="list-header">{props.name}</div>
      <Divider />
      <div className="list-content">{mySRCardList}</div>
    </div>
  );
};

export default List;
