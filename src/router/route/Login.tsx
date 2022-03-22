import LoginInterface from "../../components/ums/LoginInterface";
import request_json, { NaiveResponse } from "../../utils/Network";
import API from "../../utils/APIList";
import { immediateToast } from "izitoast-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateUserInfo } from "../../store/functions/UpdateUserInfo";
import { getUserStore } from "../../store/slices/UserSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatcher = useDispatch();

  // Judge if logged in
  const userInfo = useSelector(getUserStore);
  if (userInfo !== "") {
    immediateToast("success", {
      title: "您已经登录...",
      timeout: 1500,
      position: "topRight",
    });
    setTimeout(() => navigate("/dashboard"), 1500);
  }

  const submit_login = async (
    identity: string,
    password: string
  ): Promise<void> => {
    // Toast
    immediateToast("success", {
      title: "正在登录...",
      timeout: 1500,
      position: "topRight",
    });

    // Fetch data
    const data = await request_json(API.LOGIN, {
      body: { identity, password },
    });
    console.debug(data);

    if (data.code === 0) {
      immediateToast("success", {
        title: "登录成功！",
        timeout: 3000,
        position: "topRight",
      });
      updateUserInfo(dispatcher);
      setTimeout(() => navigate("/dashboard"), 3000);
    } else if (data.code === 1) {
      immediateToast("success", {
        title: "您已登录！",
        timeout: 3000,
        position: "topRight",
      });
      updateUserInfo(dispatcher);
      setTimeout(() => navigate("/dashboard"), 3000);
    } else if (data.code === 2) {
      immediateToast("error", {
        title: "未确认的身份信息...",
        timeout: 5000,
        position: "topRight",
      });
    } else {
      immediateToast("error", {
        title: "您的密码错误！",
        timeout: 5000,
        position: "topRight",
      });
    }

    return data;
  };

  return <LoginInterface submit={submit_login} />;
};

export default Login;
