import React, { useEffect, useState } from "react";
import "./Calendar.css";
import List from "./List";
import { useDispatch, useSelector } from "react-redux";
import { getProjectStore } from "../../store/slices/ProjectSlice";
import { updateProjectInfo } from "../../store/functions/UMS";
import { DragDropContext } from "react-beautiful-dnd";
import {
  getIterationInfo,
  getSRIterationInfo,
  getSRListInfo,
  getSRServiceInfo,
  getUserSRInfo,
  updateServiceInfo,
} from "../../store/functions/RMS";
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
import { SRId2SRInfo } from "../../utils/Association";

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
  const params = useParams();
  const project_id = Number(params.id);
  useEffect(() => {
    todoSRListData = [];
    wipSRListData = [];
    reviewSRListData = [];
    let projectIdList = [];
    if (props.inProject) {
      projectIdList.push(project_id);
    } else {
      projectIdList = userData.projects.map((project: any) =>
        Number(project.id)
      );
    }
    for (const project_id of projectIdList) {
      Promise.all([
        getSRListInfo(dispatcher, project_id),
        getUserSRInfo(dispatcher, project_id),
        getSRIterationInfo(dispatcher, project_id),
        getIterationInfo(dispatcher, project_id),
        updateProjectInfo(dispatcher, project_id),
        getSRServiceInfo(dispatcher, project_id),
        updateServiceInfo(dispatcher, project_id),
      ]).then((data: any) => {
        // data[0]: SRList
        // data[1]: user-sr association
        // data[2]: sr-iteration
        // data[3]: iteration
        // data[4]: projectInfo
        // data[5]: sr-service
        // data[6]: service
        const assoSRIdList = data[1].data
          .map((asso: any) => {
            if (asso.user === userData.user.id) return asso.sr;
          })
          .filter((asso: any) => asso);
        // TODO: change to async
        const assoSRList = assoSRIdList.map((sr_id: string) =>
          SRId2SRInfo(Number(sr_id), JSON.stringify(data[0]), project_id)
        );
        const todo_arr = todoSR(
          JSON.stringify(assoSRList),
          JSON.stringify(data[2]),
          JSON.stringify(data[3]),
          JSON.stringify(data[1]),
          JSON.stringify(data[4]),
          JSON.stringify(data[5]),
          JSON.stringify(data[6])
        );
        const wip_arr = wipSR(
          JSON.stringify(assoSRList),
          JSON.stringify(data[2]),
          JSON.stringify(data[3]),
          JSON.stringify(data[1]),
          JSON.stringify(data[4]),
          JSON.stringify(data[5]),
          JSON.stringify(data[6])
        );
        const review_arr = reviewSR(
          JSON.stringify(assoSRList),
          JSON.stringify(data[2]),
          JSON.stringify(data[3]),
          JSON.stringify(data[1]),
          JSON.stringify(data[4]),
          JSON.stringify(data[5]),
          JSON.stringify(data[6])
        );
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
      });
    }
  }, [counter]);

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
