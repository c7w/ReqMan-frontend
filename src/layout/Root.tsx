import React, { useEffect } from "react";
import "./Root.css";
import Home from "./Home";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import request_json from "../utils/Network";
import API from "../utils/APIList";
import iziToast from "izitoast";
import {
  generateRandomString,
  getCookie,
  setCookie,
} from "../utils/CookieOperation";
import CryptoJS from "crypto-js";

const Root = () => {
  // Set cookies if not exist
  const cookie = getCookie("sessionId", "");
  if (cookie === "") {
    setCookie("sessionId", generateRandomString(32));
  }

  // Get user
  useEffect(() => {
    request_json(API.GET_USER)
      .then((data) => {
        console.debug(data);
      })
      .catch(() => {
        iziToast.error({ title: "连接错误", message: "网络开小差啦..." });
      });
  }, []);

  return (
    <div className={"root-screen"}>
      <div className={"root-proj-name"}>ReqMan</div>
      <div className={"root-proj-slogan"}>
        Your Requirement Management Servant
      </div>
      <div className={"root-loading"}>
        <FontAwesomeIcon
          icon={faSpinner as IconProp}
          style={{
            color: "lightyellow",
            fontSize: "64px",
            textAlign: "center",
          }}
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
