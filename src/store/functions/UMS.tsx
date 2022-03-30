import request_json from "../../utils/Network";
import API from "../../utils/APIList";
import { updateUserStore } from "../slices/UserSlice";
import { immediateToast } from "izitoast-react";
import { push } from "redux-first-history";
import { getProjectStore, updateProjectStore } from "../slices/ProjectSlice";
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
const updateProjectInfo = async (dispatcher: any, project_id: number) => {
  const projectData = await request_json(API.POST_PROJECT, {
    body: { project: project_id },
  });
  dispatcher(updateProjectStore(JSON.stringify(projectData)));
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

export { updateUserInfo, updateProjectInfo, logOut, createProject };
