import request_json from "../../utils/Network";
import API from "../../utils/APIList";
import { updateUserStore } from "../slices/UserSlice";
import { immediateToast } from "izitoast-react";
import { push } from "redux-first-history";
import { updateProjectStore } from "../slices/ProjectSlice";

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

export { updateUserInfo, updateProjectInfo, logOut };
