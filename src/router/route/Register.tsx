import request_json, { NaiveResponse } from "../../utils/Network";
import API from "../../utils/APIList";
import { immediateToast } from "izitoast-react";
import { updateUserInfo } from "../../store/functions/UpdateUserInfo";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import RegisterInterface from "../../components/ums/RegisterInterface";
import { getUserStore } from "../../store/slices/UserSlice";

const Register = () => {
  // Hooks
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

  const submit_register = async (
    name: string,
    password: string,
    email: string,
    invitation: string
  ): Promise<void> => {
    // Toast
    immediateToast("success", {
      title: "正在注册...",
      timeout: 1500,
      position: "topRight",
    });

    // Fetch data
    const data = await request_json(API.REGISTER, {
      body: { name, password, email, invitation },
    });
    console.debug(data);

    if (data.code === 0) {
      immediateToast("success", {
        title: "注册成功！",
        timeout: 3000,
        position: "topRight",
      });
      updateUserInfo(dispatcher);
      setTimeout(() => navigate("/dashboard"), 3000);
    } else if (data.code === 1) {
      immediateToast("error", {
        title: "注册失败...",
        timeout: 5000,
        position: "topRight",
      });
    } else if (data.code === 2) {
      immediateToast("error", {
        title: "项目邀请码无效...",
        timeout: 5000,
        position: "topRight",
      });
    }

    return data;
  };
  return <RegisterInterface submit={submit_register} />;
};

export default Register;
