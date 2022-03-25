import Home from "../../layout/Home";
import { useDispatch, useSelector } from "react-redux";
import { getUserStore } from "../../store/slices/UserSlice";
import { updateUserInfo } from "../../store/functions/UMS";
import { immediateToast } from "izitoast-react";
import { push } from "redux-first-history";
import { Breadcrumb } from "antd";
import Calendar from "../../components/rms/Calendar";
import React from "react";

const Dashboard = () => {
  // Detect if logged in
  const dispatcher = useDispatch();
  const userInfo = useSelector(getUserStore);
  if (userInfo.length < 10) {
    // Re-request userInfo
    updateUserInfo(dispatcher).catch(() => {
      immediateToast("error", {
        id: "dashboard-to-root-conn-lost",
        displayMode: 1,
        title: "连接丢失...",
        position: "topRight",
      });
      dispatcher(push("/"));
    });
  } else {
    // Right?
  }

  return (
    <Home sidebar={true}>
      <div>
        <Breadcrumb style={{ margin: "1rem 0" }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>我的日程</Breadcrumb.Item>
        </Breadcrumb>
        <Calendar />
      </div>
    </Home>
  );
};

export default Dashboard;
