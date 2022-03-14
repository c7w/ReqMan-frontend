interface APIConfig {
  //API 配置
  path: string;
  method: string;
}

interface Settings {
  //请求参数
  headers?: object; //请求头
  body?: object; //请求体
  getParams?: string; //GET 请求的参数列表
}

//请求函数
const request_json = async (config: APIConfig, settings: Settings = {}) => {
  let path = config.path;
  let initRequest: RequestInit;
  if (config.method == "post") {
    initRequest = {
      method: config.method,
      headers: {
        ...settings.headers,
        "Content-Type": "application/json",
        credentials: "include",
      },
      body: JSON.stringify(settings.body),
    };
  } else if (config.method == "get") {
    initRequest = {
      method: config.method,
    };
    path += "?" + settings.getParams;
  } else {
    initRequest = {
      method: config.method,
    };
  }
  console.debug(initRequest);
  return await fetch(path, initRequest).then((data) => data.json());
};

export default request_json;
