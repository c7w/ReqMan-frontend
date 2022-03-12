const API_CONFIG = {
  LOGIN: {
    path: "/ums/login",
    method: "get",
  },
};

enum API_LIST {
  LOGIN = "LOGIN",
}

const request = async (api: API_LIST) => {
  return await fetch("www.baidu.com"); // fetch certain path, convert to json, and return
};

export { API_LIST, request };
