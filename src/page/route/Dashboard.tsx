import Home from "../../layout/Home";
import { useDispatch, useSelector } from "react-redux";
import { getUserStore } from "../../store/slices/UserSlice";
import { updateUserInfo } from "../../store/functions/UMS";
import { immediateToast } from "izitoast-react";
import { push } from "redux-first-history";
import { Breadcrumb } from "antd";
import Calendar from "../../components/rms/Calendar";
import React from "react";
import { Redirect, ToastMessage } from "../../utils/Navigation";
import Loading from "../../layout/components/Loading";
import { getProjectStore } from "../../store/slices/ProjectSlice";
import {
  getIRListStore,
  getIRSRStore,
  getSRListStore,
} from "../../store/slices/IRSRSlice";

// 包含用户的当前项目的 SR 信息
const Dashboard = () => {
  // Detect if logged in
  const dispatcher = useDispatch();
  const userInfo = useSelector(getUserStore); // 该用户的所有 project 信息
  if (userInfo === "") {
    updateUserInfo(dispatcher);
  } else if (JSON.parse(userInfo).code !== 0) {
    ToastMessage("error", "未登录", "跳转回登录界面");
    Redirect(dispatcher, "/login");
  } else {
    // const user_data = JSON.parse(userInfo); // user data, include all projects belonged to user
    return (
      <Home sidebar={false}>
        <div>
          <Breadcrumb style={{ margin: "1rem 0" }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>我的日程</Breadcrumb.Item>
          </Breadcrumb>
          <Calendar userInfo={userInfo} inProject={false} />
        </div>
      </Home>
    );
  }
  return (
    <Home sidebar={false}>
      <div>
        <Loading />
      </div>
    </Home>
  );
};

export default Dashboard;
