import request_json from "../../utils/Network";
import API from "../../utils/APIList";
import { updateUserStore } from "../slices/UserSlice";
import { immediateToast } from "izitoast-react";
import { push } from "redux-first-history";
import { updateProjectStore } from "../slices/ProjectSlice";
import { ProjectInfo } from "../ConfigureStore";

const updateUserInfo = async (dispatcher: any): Promise<void> => {
  const user_data = await request_json(API.GET_USER);
  dispatcher(updateUserStore(JSON.stringify(user_data)));
};

const logOut = async (dispatcher: any): Promise<void> => {
  request_json(API.LOGOUT)
    .then((logout_data) => {
      if (logout_data.code === 0) {
        immediateToast("success", {
          title: "成功退出登录",
          position: "topRight",
        });
      } else {
        immediateToast("error", { title: "未登录...", position: "topRight" });
      }
      window.location.href = "/login"; // Force reset states
    })
    .catch(() => {
      immediateToast("error", { title: "连接丢失...", position: "topRight" });
      dispatcher(push("/"));
    });
};

// Backend: [POST] /ums/project => projectStore
// 更新该项目的信息：ir、sr、association...
const updateProjectInfo = async (dispatcher: any, project_id: number) => {
  const projectData = await request_json(API.POST_PROJECT, {
    body: { project: project_id },
  });
  dispatcher(updateProjectStore(JSON.stringify(projectData)));
  return projectData;
};

// Backend: [POST] /ums/create_project/
const createProject = async (dispatcher: any, project: ProjectInfo) => {
  const myBody = {
    title: project.title,
    description: project.description,
    avatar: "X",
  };
  return request_json(API.CREATE_PROJECT, { body: myBody }).then((data) => {
    if (data.code === 0) {
      updateUserInfo(dispatcher);
    }
    return data;
  });
};

// // Backend: [POST] /ums/modify_project
// const modifyProjectInfo = async (dispatcher: any, project_id: number) => {
//   const;
// };

// Backend: [POST] /ums/modify_user_role => userStore
// 更新用户角色
const updateUserRole = async (
  dispatcher: any,
  project_id: number,
  user_id: number,
  role: string
) => {
  const myBody = {
    project: project_id,
    user: user_id,
    role: role,
  };
  // 向后端发送更改用户角色的请求
  request_json(API.MODIFY_USER_ROLE, { body: myBody });
  // 更新 store 里的 project
  updateProjectInfo(dispatcher, project_id);
};

// Backend: [POST] /ums/project_add_user
// 向该项目中加入某个用户
// 需要传入的参数： dispatcher + project_id + 被删除的 user_id + 角色 role
const projectAddUser = async (
  dispatcher: any,
  project_id: number,
  user_id: number,
  role: string
) => {
  const myBody = {
    project: project_id,
    user: user_id,
    role: role,
  };
  // 向后端发送更改用户角色的请求
  request_json(API.ADD_USER, { body: myBody });
  // 更新 store 里的 project
  updateProjectInfo(dispatcher, project_id);
};

// Backend: [POST] /ums/project_rm_user
// 在该项目中删除某个用户
// 需要传入的参数： dispatcher + project_id + 被删除的 user_id
const projectRmUser = async (
  dispatcher: any,
  project_id: number,
  user_id: number
) => {
  const myBody = {
    project: project_id,
    user: user_id,
  };
  // 向后端发送更改用户角色的请求
  request_json(API.RM_USER, { body: myBody });
  // 更新 store 里的 project
  updateProjectInfo(dispatcher, project_id);
};

// userInfo: getUserStore 而来
const getCommitCountInfo = async (dispatcher: any, userInfo: string) => {
  const promise_list: any[] = [];
  const userData = JSON.parse(userInfo).data;
  userData.projects.forEach((project: any) => {
    const myBody = {
      project: project.id,
      digest: true,
      dev_id: [userData.user.id],
      limit: -1,
    };
    const promise = request_json(API.GET_RECENT_ACTIVITY, {
      body: myBody,
    });
    promise_list.push(promise);
  });

  return Promise.all(promise_list).then((data: any) => {
    return data;
  });
};

export {
  updateUserInfo,
  updateProjectInfo,
  createProject,
  updateUserRole,
  projectAddUser,
  projectRmUser,
  logOut,
  getCommitCountInfo,
};
