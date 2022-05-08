import React, { useEffect, useState } from "react";
import "./List.css";
import SRCard from "./SRCard";
import { Droppable } from "react-beautiful-dnd";
import { Divider } from "antd";

interface ListProps {
  readonly name: string;
  readonly stateSRList: string;
  readonly id: string;
}

const List = (props: ListProps) => {
  const [mySRCardList, setMySRCardList] = useState([]);
  useEffect(() => {
    const tmp_SRList = Array.from(JSON.parse(props.stateSRList));
    const newSRCardList: any = [];
    if (tmp_SRList && tmp_SRList !== []) {
      // console.log(tmp_SRList);
      tmp_SRList.forEach((value: any) => {
        newSRCardList.push(
          <SRCard
            id={value.id}
            key={value.id}
            title={value.title}
            priority={value.priority}
            disabled={value.disabled}
            description={value.description}
            currState={value.currState}
            project={value.project}
            rank={value.rank}
            createdBy={value.createdBy}
            createdAt={value.createdAt}
            chargedBy={value.chargedBy}
            service={value.service}
            iter={value.iter}
          />
        );
      });
    }
    setMySRCardList(newSRCardList);
  }, [props.stateSRList]);
  return (
    <div className="list-list">
      <div className="list-header">{props.name}</div>
      <Divider />
      <div className="list-content">{mySRCardList}</div>
    </div>
  );
};

export default List;
