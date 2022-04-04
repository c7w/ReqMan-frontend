import request_json, { NaiveResponse } from "../../../utils/Network";
import API from "../../../utils/APIList";
import { immediateToast } from "izitoast-react";
import { updateUserInfo } from "../../../store/functions/UMS";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import RegisterInterface from "../../../components/ums/RegisterInterface";
import { getUserStore } from "../../../store/slices/UserSlice";
import { useEffect } from "react";
import { push } from "redux-first-history";
import { Redirect, ToastMessage } from "../../../utils/Navigation";

const Register = () => {
  // Hooks
  const dispatcher = useDispatch();
  const userStore = useSelector(getUserStore);

  // Judge if logged in
  if (userStore === "") {
    updateUserInfo(dispatcher);
  } else {
    const userInfo = JSON.parse(userStore);
    if (userInfo.code === 0) {
      // Redirect to dashboard
      ToastMessage("success", "登录成功", "已为您自动登录...");
      Redirect(dispatcher, "/dashboard", 0);
    }
  }

  const submit_register = async (
    name: string,
    password: string,
    email: string,
    invitation: string
  ): Promise<void> => {
    // Toast
    immediateToast("info", {
      title: "正在注册...",
      timeout: 500,
      position: "topRight",
    });

    // Fetch data
    const data = await request_json(API.REGISTER, {
      body: { name, password, email, invitation },
    });

    if (data.code === 0) {
      immediateToast("success", {
        title: "注册成功！",
        timeout: 2000,
        position: "topRight",
      });
      updateUserInfo(dispatcher);
    } else if (data.code === 1) {
      immediateToast("error", {
        title: "注册失败",
        message: "请确保用户名与邮箱是否有效或有滥用行为",
        timeout: 2000,
        position: "topRight",
      });
    } else if (data.code === 2) {
      immediateToast("error", {
        title: "注册失败",
        message: "项目邀请码无效...",
        timeout: 3000,
        position: "topRight",
      });
    }

    return data;
  };
  return <RegisterInterface submit={submit_register} />;
};

export default Register;
