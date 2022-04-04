import React, { useEffect } from "react";
import "./Root.css";
import logo from "../../../assets/Reqman-1.svg";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import request_json from "../../../utils/Network";
import API from "../../../utils/APIList";

import {
  generateRandomString,
  getCookie,
  setCookie,
} from "../../../utils/CookieOperation";
import { immediateToast } from "izitoast-react";
import { useDispatch } from "react-redux";
import { updateUserStore } from "../../../store/slices/UserSlice";
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
            timeout: 2000,
          });
          setTimeout(() => {
            dispatcher(push("/dashboard")); // Use this way to redirect
          }, 2000);
        } else {
          immediateToast("success", {
            title: "连接成功",
            message: "欢迎来到 ReqMan，请登录！",
            position: "topRight",
            timeout: 2000,
          });
          setTimeout(() => {
            dispatcher(push("/login"));
          }, 2000);
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
        <img src={logo} width={800} height={400} alt="logo" />
      </div>
      <div className={"root-proj-slogan"}>
        Your <span style={{ fontWeight: "bold" }}>Req</span>uirement{" "}
        <span style={{ fontWeight: "bold" }}>Man</span>agement Servant
      </div>
      <div className={"root-loading"}>
        <Loading3QuartersOutlined
          style={{ fontSize: "72px", color: "black" }}
          className={"root-spinner"}
        />
      </div>
      <div className={"root-footer"}>
        © 2022 undefined. All rights reserved.
      </div>
    </div>
  );
};

export default Root;
