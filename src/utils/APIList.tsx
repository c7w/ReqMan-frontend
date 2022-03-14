const API = {
  GET_USER: {
    path: "/ums/user",
    method: "get",
  },
  LOGIN: {
    path: " /ums/login",
    method: "post",
  },
  LOGOUT: {
    path: " /ums/logout",
    method: "post",
  },
  REGISTER: {
    path: "/ums/register",
    method: "post",
  },
  CHECK_USERNAME_AVAILABLE: {
    path: "/ums/check_username_available",
    method: "get",
  },
  CHECK_EMAIL_AVAILABLE: {
    path: "/ums/check_email_available",
    method: "get",
  },
};

export default API;
