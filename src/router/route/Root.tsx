import React, { useEffect } from "react";
import "./Root.css";
import logo from "../../assets/undefined.png";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import request_json from "../../utils/Network";
import API from "../../utils/APIList";

import {
  generateRandomString,
  getCookie,
  setCookie,
} from "../../utils/CookieOperation";
import { immediateToast, useToast } from "izitoast-react";
import { useDispatch } from "react-redux";
import { updateUserStore } from "../../store/slices/UserSlice";
import { push } from "redux-first-history";

const Root = () => {
  const dispatcher = useDispatch();

  // Set cookies if not exist
  const cookie = getCookie("sessionId", "");
  if (cookie === "") {
    setCookie("sessionId", generateRandomString(32));
  }

  // Get user
  useEffect(() => {
    request_json(API.GET_USER)
      .then((data) => {
        if (data.code === 0) {
          dispatcher(updateUserStore(JSON.stringify(data))); // Maybe use UMS better
          const username = data.data.user.name;
          console.debug(data);
          immediateToast("success", {
            title: "连接成功",
            message: `欢迎回来，${username}！`,
            position: "topRight",
            timeout: 4000,
          });
          setTimeout(() => {
            dispatcher(push("/dashboard")); // Use this way to redirect
          }, 4000);
        } else {
          immediateToast("success", {
            title: "连接成功",
            message: "欢迎来到 ReqMan，请登录！",
            position: "topRight",
            timeout: 4000,
          });
          setTimeout(() => {
            dispatcher(push("/login"));
          }, 4000);
        }
      })
      .catch(() => {
        immediateToast("error", {
          title: "连接错误",
          message: "网络开小差啦...",
          position: "topRight",
        });
      });
  }, []);
  // useEffect Hook: Would be executed when the variables in the dependence list are initialized or changed value.
  // If you define an empty list as variable dependence, this function would just execute for once, just like didMount().

  return (
    <div className={"root-screen"}>
      <div className={"root-proj-name"}>
        <img src={logo} width={200} height={200} />
      </div>
      <div className={"root-proj-slogan"}>
        Your Requirement Management Servant
      </div>
      <div className={"root-loading"}>
        <Loading3QuartersOutlined
          style={{ fontSize: "72px", color: "lightyellow" }}
          className={"root-spinner"}
        />
      </div>
      <div className={"root-footer"}>
        © 2022 undefined. All rights reversed.
      </div>
    </div>
  );
};

export default Root;
