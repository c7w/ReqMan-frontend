import React, { useEffect, useState } from "react";
import "./Calendar.css";
import List from "./List";
import { useDispatch, useSelector } from "react-redux";
import { getProjectStore } from "../../store/slices/ProjectSlice";
import { updateProjectInfo } from "../../store/functions/UMS";
import { getSRListInfo } from "../../store/functions/RMS";
import { reviewSR, todoSR, wipSR } from "../../utils/SRClassification";

interface CalendarProps {
  readonly userInfo: string;
}

const Calendar = (props: CalendarProps) => {
  const userData = JSON.parse(props.userInfo).data;
  console.log("Calendar: " + userData);
  const dispatcher = useDispatch();
  const [todoSRList, setTodoSRList] = useState([]); // 所有 to do SR 的列表
  const [wipSRList, setWipSRList] = useState([]); // 所有 to do SR 的列表
  const [reviewSRList, setReviewSRList] = useState([]); // 所有 to do SR 的列表
  // userData.projects.forEach((project: any) => {
  //   const project_id = project.id;
  //   const projectInfo = useSelector(getProjectStore);
  // });
  useEffect(() => {
    const todoSRListData: any = [];
    const wipSRListData: any = [];
    const reviewSRListData: any = [];
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
        setTodoSRList(todoSRListData);
        setWipSRList(wipSRListData);
        setReviewSRList(reviewSRListData);
        // console.log(todoSRListData);
        // console.log(wipSRListData);
        // console.log(reviewSRListData);
      });
    }
  }, []);
  return (
    <div className="calendar">
      <List name={"未开始"} stateSRList={JSON.stringify(todoSRList)} />
      <List name={"进行中"} stateSRList={JSON.stringify(wipSRList)} />
      <List name={"已完成"} stateSRList={JSON.stringify(reviewSRList)} />
    </div>
  );
};

export default Calendar;
