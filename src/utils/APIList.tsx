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
  EMAIL_MODIFY_PASSWORD_REQUEST: {
    path: "/ums/email_modify_password_request/",
    method: "post",
  },
  EMAIL_MODIFY_PASSWORD_CALLBACK: {
    path: "/ums/email_modify_password_callback/",
    method: "post",
  },
  REMOTE_LIST: {
    path: "/ums/urls_to_set_remote_name/",
    method: "get",
  },
  SET_REMOTE_USERNAME: {
    path: "/ums/set_remote_username/",
    method: "post",
  },
  EMAIL_REQUEST: {
    path: "/ums/email_request/",
    method: "post",
  },
  GET_RECENT_ACTIVITY: {
    path: "/rdts/get_recent_activity/",
    method: "post",
  },
  GET_USER_ACTIVITY: {
    path: "/rdts/get_user_activity/",
    method: "post",
  },
  TEST_ACCESS_TOKEN: {
    path: "/rdts/test_access_token/",
    method: "get",
  },
  GET_PROJECT_REPO_BRANCH: {
    path: "/rdts/forward_branches/",
    method: "get",
  },
  GET_FORWARD_CODE_SR: {
    path: "/rdts/forward_code_sr/",
    method: "get",
  },
  GET_FORWARD_TREE: {
    path: "/rdts/forward_tree/",
    method: "get",
  },
  GET_MERGES_PAGED: {
    path: "/rdts/project_merges/",
    method: "get",
  },
  GET_BUGS_PAGED: {
    path: "/rdts/project_bugs/",
    method: "get",
  },
  GET_COMMITS_PAGED: {
    path: "/rdts/project_commits/",
    method: "get",
  },
  GET_PROJECT_SINGLE_MERGE: {
    path: "/rdts/project_single_merge/",
    method: "get",
  },
  GET_PROJECT_SINGLE_BUG: {
    path: "/rdts/project_single_bug/",
    method: "get",
  },
  GET_PROJECT_SINGLE_COMMIT: {
    path: "/rdts/project_single_commit/",
    method: "get",
  },
  GET_PROJECT_SINGLE_SR: {
    path: "/rms/project_single_sr/",
    method: "get",
  },
  GET_SR_PAGED: {
    path: "/rms/project_sr/",
    method: "get",
  },
  GET_RMS_LIST_SR: {
    path: "/rms/search_sr/",
    method: "post",
  },
};

export default API;
