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
  MODIFY_USER_ROLE: {
    path: "/ums/modify_user_role/",
    method: "post",
  },
  ADD_USER: {
    path: "/ums/project_add_user/",
    method: "post",
  },
  RM_USER: {
    path: "/ums/project_rm_user/",
    method: "post",
  },
  MODIFY_PROJECT: {
    path: "/ums/modify_project/",
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
  GET_RDTS: {
    path: "/rdts/project/",
    method: "get",
  },
  POST_RDTS: {
    path: "/rdts/project/",
    method: "post",
  },
  CREATE_REPO: {
    path: "/rdts/repo_op/",
    method: "post",
  },
  JOIN_PROJECT: {
    path: "/ums/user_join_project_invitation/",
    method: "post",
  },
};

export default API;
