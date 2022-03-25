import Home from "../../layout/Home";
import { useDispatch, useSelector } from "react-redux";
import { getUserStore } from "../../store/slices/UserSlice";
import { updateUserInfo } from "../../store/functions/UMS";
import { immediateToast } from "izitoast-react";
import { push } from "redux-first-history";
import { useEffect } from "react";
import request_json from "../../utils/Network";
import API from "../../utils/APIList";
import { initSRList } from "../../store/slices/rmsSlice";

const Dashboard = () => {
  // Detect if logged in
  const dispatcher = useDispatch();
  const userInfo = useSelector(getUserStore);
  if (userInfo === "") {
    // Re-request userInfo
    updateUserInfo(dispatcher).catch(() => {
      immediateToast("error", {
        id: "dashboard-to-root-conn-lost",
        displayMode: 1,
        title: "连接丢失...",
        position: "topRight",
      });
      // test
      dispatcher(push("/dashboard"));
    });
  } else {
    // Right?
  }

  useEffect(() => {
    const settings = {
      getParams: "project=1&type=ir",
    };
    request_json(API.GET_RMS, settings)
      .then((data) => {
        if (data.code === 0) {
          dispatcher(initSRList(JSON.stringify(data)));
          immediateToast("success", {
            title: "加载SR成功",
            message: "hello world",
            position: "topRight",
            timeout: 4000,
          });
        } else {
          immediateToast("success", {
            title: "连接成功",
            message: "欢迎来到 ReqMan，请登录！",
            position: "topRight",
            timeout: 4000,
          });
          dispatcher(push("/login"));
        }
      })
      .catch(() => {
        immediateToast("error", {
          title: "加载失败",
          message: "完蛋",
          position: "topRight",
          timeout: 4000,
        });
      });
  }, []);

  return <Home />;
};

export default Dashboard;
