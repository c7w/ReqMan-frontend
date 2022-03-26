import LoginInterface from "../../../components/ums/LoginInterface";
import request_json, { NaiveResponse } from "../../../utils/Network";
import API from "../../../utils/APIList";
import { immediateToast } from "izitoast-react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserInfo } from "../../../store/functions/UMS";
import { getUserStore } from "../../../store/slices/UserSlice";
import { useEffect } from "react";
import { push } from "redux-first-history";
import { Redirect, ToastMessage } from "../../../utils/Navigation";

const Login = () => {
  const dispatcher = useDispatch();
  const userStore = useSelector(getUserStore);

  // Judge if logged in
  if (userStore === "") {
    updateUserInfo(dispatcher);
  } else {
    const userInfo = JSON.parse(userStore);
    if (userInfo.code === 0) {
      // Redirect to dashboard
      ToastMessage("success", "已登录", "您已经成功登录...");
      Redirect(dispatcher, "/dashboard", 0);
    }
  }

  const submit_login = async (
    identity: string,
    password: string
  ): Promise<void> => {
    // Toast
    immediateToast("info", {
      title: "正在登录...",
      timeout: 500,
      position: "topRight",
    });

    // Fetch data
    const data = await request_json(API.LOGIN, {
      body: { identity, password },
    });

    if (data.code === 0 || data.code === 1) {
      ToastMessage("success", "登录成功", "登录成功...");
      Redirect(dispatcher, "/dashboard", 0);
    } else if (data.code === 2 || data.code === 3) {
      ToastMessage("error", "登录失败", "无效的用户名或密码");
    } else if (data.code === -3) {
      ToastMessage("error", "登录失败", "您的请求过于频繁");
    }

    return data;
  };

  return <LoginInterface submit={submit_login} />;
};

export default Login;
