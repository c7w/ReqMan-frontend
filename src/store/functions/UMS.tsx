import request_json from "../../utils/Network";
import API from "../../utils/APIList";
import { updateUserStore } from "../slices/UserSlice";
import { immediateToast } from "izitoast-react";
import { push } from "redux-first-history";

const updateUserInfo = async (dispatcher: any): Promise<void> => {
  const user_data = await request_json(API.GET_USER);
  dispatcher(updateUserStore(JSON.stringify(user_data)));
  console.debug(user_data);
};

const logOut = async (dispatcher: any): Promise<void> => {
  request_json(API.LOGOUT)
    .then((logout_data) => {
      if (logout_data.code === 0) {
        dispatcher(updateUserStore(JSON.stringify("")));
        immediateToast("success", {
          title: "成功退出登录",
          position: "topRight",
        });
      } else {
        immediateToast("error", { title: "未登录...", position: "topRight" });
      }
      dispatcher(push("/"));
    })
    .catch(() => {
      immediateToast("error", { title: "连接丢失...", position: "topRight" });
      dispatcher(push("/"));
    });
};

export { updateUserInfo, logOut };
