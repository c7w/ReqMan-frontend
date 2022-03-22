import request_json from "../../utils/Network";
import API from "../../utils/APIList";
import { updateUserStore } from "../slices/UserSlice";

const updateUserInfo = async (
  dispatcher: (arg0: { payload: any; type: string }) => void
) => {
  const user_data = await request_json(API.GET_USER);
  dispatcher(updateUserStore(JSON.stringify(user_data)));
  console.debug(user_data);
};

export { updateUserInfo };
