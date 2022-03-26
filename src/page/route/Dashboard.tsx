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

const Dashboard = () => {
  // Detect if logged in
  const dispatcher = useDispatch();
  const userInfo = useSelector(getUserStore);
  if (userInfo === "") {
    updateUserInfo(dispatcher);
  } else {
    const data = JSON.parse(userInfo);
    if (data.code === 0) {
      return (
        <Home sidebar={false}>
          <div>
            <Breadcrumb style={{ margin: "1rem 0" }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>我的日程</Breadcrumb.Item>
            </Breadcrumb>
            <Calendar />
          </div>
        </Home>
      );
    } else {
      ToastMessage("error", "未确认登录态", "即将跳转回登录界面");
      Redirect(dispatcher, "/login", 0);
    }
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
