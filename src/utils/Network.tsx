import SITE_CONFIG from "../settings.js";
import { getCookie } from "./CookieOperation";

interface APIConfig {
  //API 配置
  path: string;
  method: string;
}

interface Settings {
  //请求参数
  headers?: object; //请求头
  body?: object; //请求体
  getParams?: object; //GET 请求的参数列表
}

interface NaiveResponse {
  code: number;
}

//请求函数
const request_json = async (config: APIConfig, settings: Settings = {}) => {
  let path = SITE_CONFIG.BACKEND + config.path;

  settings.body = {
    ...settings.body,
    sessionId: getCookie("sessionId", Math.random().toString()),
  };

  const getParams_ = {
    ...settings.getParams,
    sessionId: getCookie("sessionId", ""),
  };
  const getParams =
    "?" +
    Object.entries(getParams_)
      .map((key) => key[0] + "=" + key[1])
      .join("&");

  let initRequest: RequestInit;
  if (config.method === "post") {
    initRequest = {
      method: config.method,
      headers: {
        ...settings.headers,
        "Content-Type": "application/json",
        // credentials: "include",
      },
      body: JSON.stringify(settings.body),
    };
  } else if (config.method === "get") {
    initRequest = {
      method: config.method,
    };
    path += getParams;
  } else {
    initRequest = {
      method: config.method,
    };
  }
  // console.log("initRequest: " + JSON.stringify(initRequest));
  // console.log("path: " + path);
  return await fetch(path, initRequest)
    .then((data) => data.json())
    .then((json) => {
      console.debug(`Fetched ${path} successfully: ` + JSON.stringify(json));
      return json;
    });
};

export default request_json;
export type { NaiveResponse };
