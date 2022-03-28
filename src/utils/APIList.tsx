const API = {
  GET_USER: {
    path: "/ums/user/",
    method: "get",
  },
  LOGIN: {
    path: "/ums/login/",
    method: "post",
  },
  LOGOUT: {
    path: "/ums/logout/",
    method: "post",
  },
  REGISTER: {
    path: "/ums/register/",
    method: "post",
  },
  CHECK_USERNAME_AVAILABLE: {
    path: "/ums/check_username_available/",
    method: "post",
  },
  CHECK_EMAIL_AVAILABLE: {
    path: "/ums/check_email_available/",
    method: "post",
  },
  CREATE_PROJECT: {
    path: "/ums/create_project/",
    method: "post",
  },
  UPLOAD_USER_AVATAR: {
    path: "/ums/upload_user_avatar/",
    method: "post",
  },
  UPLOAD_PROJECT_AVATAR: {
    path: "/ums/upload_project_avatar/",
    method: "post",
  },
  GET_PROJECT_INVITATION: {
    path: "/ums/get_invitation/",
    method: "post",
  },
  REFRESH_PROJECT_INVITATION: {
    path: "/ums/refresh_invitation/",
    method: "post",
  },
  CHANGE_USER_PASSWORD: {
    path: "/ums/modify_password/",
    method: "post",
  },
  POST_PROJECT: {
    path: "/ums/project/",
    method: "post",
  },
  GET_RMS: {
    path: "/rms/project/",
    method: "get",
  },
  POST_RMS: {
    path: "/rms/project/",
    method: "post",
  },
};

export default API;
