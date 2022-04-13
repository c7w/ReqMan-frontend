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
  const tmp_SRList = eval(JSON.parse(props.stateSRList));
  const mySRCardList: any = [];
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
          chargedBy={-1}
          service={-1}
          iter={[]}
        />
      );
    });
  }
  return (
    <div className="list-list">
      <div className="list-header">{props.name}</div>
      <Divider />
      <Droppable droppableId={props.id}>
        {(provided) => (
          <div className="list-content" {...provided.droppableProps}>
            {mySRCardList}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default List;
