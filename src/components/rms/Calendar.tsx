import React, { useEffect, useState } from "react";
import "./Calendar.css";
import List from "./List";
import { useDispatch, useSelector } from "react-redux";
import { getProjectStore } from "../../store/slices/ProjectSlice";
import { updateProjectInfo } from "../../store/functions/UMS";
import { DragDropContext } from "react-beautiful-dnd";
import { getSRListInfo } from "../../store/functions/RMS";
import { reviewSR, todoSR, wipSR } from "../../utils/SRClassification";
import {
  getCounterStore,
  getReviewSRListStore,
  getTodoSRListStore,
  getWipSRListStore,
  updateReviewSRList,
  updateTodoSRList,
  updateWipSRList,
} from "../../store/slices/CalendarSlice";
import { getSRListStore } from "../../store/slices/IRSRSlice";
import { useParams } from "react-router-dom";

interface CalendarProps {
  readonly userInfo: string;
  readonly inProject: boolean; // 是否是要展示当前项目的开发日程表
}

const Calendar = (props: CalendarProps) => {
  const userData = JSON.parse(props.userInfo).data;
  const dispatcher = useDispatch();
  const counter = useSelector(getCounterStore);
  const todoSRList = useSelector(getTodoSRListStore); // string
  const wipSRList = useSelector(getWipSRListStore); // string
  const reviewSRList = useSelector(getReviewSRListStore); // string
  let todoSRListData: any = [];
  let wipSRListData: any = [];
  let reviewSRListData: any = [];
  let allSRListData: any = [];
  const params = useParams();
  const project_id = Number(params.id);
  useEffect(() => {
    todoSRListData = [];
    wipSRListData = [];
    reviewSRListData = [];
    allSRListData = [];
    let projectIdList = [];
    if (props.inProject) {
      projectIdList.push(project_id);
    } else {
      projectIdList = userData.projects.map((project: any) =>
        Number(project.id)
      );
    }
    for (const project_id of projectIdList) {
      getSRListInfo(dispatcher, project_id).then((data: any) => {
        const todo_arr = todoSR(JSON.stringify(data));
        const wip_arr = wipSR(JSON.stringify(data));
        const review_arr = reviewSR(JSON.stringify(data));
        todo_arr.forEach((value: any) => {
          todoSRListData.push(value);
          allSRListData.push(value);
        });
        wip_arr.forEach((value: any) => {
          wipSRListData.push(value);
          allSRListData.push(value);
        });
        review_arr.forEach((value: any) => {
          reviewSRListData.push(value);
          allSRListData.push(value);
        });
        dispatcher(updateTodoSRList(JSON.stringify(todoSRListData)));
        dispatcher(updateWipSRList(JSON.stringify(wipSRListData)));
        dispatcher(updateReviewSRList(JSON.stringify(reviewSRListData)));
        // console.log(todoSRListData);
        // console.log(wipSRListData);
        // console.log(reviewSRListData);
      });
    }
  }, [counter]);

  const onDragEnd = (result: any) => {
    //Todo
  };

  return (
    // <DragDropContext onDragEnd={onDragEnd}>
    <div className="calendar">
      <List name={"未开始"} stateSRList={todoSRList} id={"1"} />
      <List name={"开发中"} stateSRList={wipSRList} id={"2"} />
      <List name={"测试中"} stateSRList={reviewSRList} id={"3"} />
    </div>
    // </DragDropContext>
  );
};

export default Calendar;
