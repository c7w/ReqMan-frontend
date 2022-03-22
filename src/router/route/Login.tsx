import LoginInterface from "../../components/ums/LoginInterface";
import request_json, { NaiveResponse } from "../../utils/Network";
import API from "../../utils/APIList";
import { immediateToast } from "izitoast-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

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
      navigate("/register");
    } else if (data.code === 1) {
      immediateToast("success", {
        title: "您已登录！",
        timeout: 3000,
        position: "topRight",
      });
      navigate("/register");
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
