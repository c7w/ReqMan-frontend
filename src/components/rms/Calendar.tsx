import React, { useEffect, useState } from "react";
import "./Calendar.css";
import List from "./List";
import { useDispatch, useSelector } from "react-redux";
import { getProjectStore } from "../../store/slices/ProjectSlice";
import { updateProjectInfo } from "../../store/functions/UMS";
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

interface CalendarProps {
  readonly userInfo: string;
}

const Calendar = (props: CalendarProps) => {
  console.log("--------------------- calendar ===========================");
  const userData = JSON.parse(props.userInfo).data;
  console.log("Calendar: " + userData);
  const dispatcher = useDispatch();
  const counter = useSelector(getCounterStore);
  const todoSRList = useSelector(getTodoSRListStore); // string
  const wipSRList = useSelector(getWipSRListStore); // string
  const reviewSRList = useSelector(getReviewSRListStore); // string
  let todoSRListData: any = [];
  let wipSRListData: any = [];
  let reviewSRListData: any = [];
  useEffect(() => {
    console.log(" ========================== use Effect ! ==================");
    todoSRListData = [];
    wipSRListData = [];
    reviewSRListData = [];
    for (const project of userData.projects) {
      const project_id = Number(project.id);
      getSRListInfo(dispatcher, project_id).then((data: any) => {
        console.log(data);
        const todo_arr = todoSR(JSON.stringify(data));
        const wip_arr = wipSR(JSON.stringify(data));
        const review_arr = reviewSR(JSON.stringify(data));
        todo_arr.forEach((value: any) => {
          todoSRListData.push(value);
        });
        wip_arr.forEach((value: any) => {
          wipSRListData.push(value);
        });
        review_arr.forEach((value: any) => {
          reviewSRListData.push(value);
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
  return (
    <div className="calendar">
      <List name={"未开始"} stateSRList={JSON.stringify(todoSRList)} />
      <List name={"开发中"} stateSRList={JSON.stringify(wipSRList)} />
      <List name={"测试中"} stateSRList={JSON.stringify(reviewSRList)} />
    </div>
  );
};

export default Calendar;
