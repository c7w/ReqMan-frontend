import Home from "../../../layout/Home";
import { useDispatch, useSelector } from "react-redux";
import { getUserStore } from "../../../store/slices/UserSlice";
import { updateUserInfo } from "../../../store/functions/UMS";
import { Redirect, ToastMessage } from "../../../utils/Navigation";
import { IRList } from "../../../components/rms/IRList";

const ProjectIR = () => {
  // Judge if project list in user state
  // If not re-query the user state from the backend
  // Render the project list
  const userInfo = useSelector(getUserStore);
  const dispatch = useDispatch();
  if (userInfo === "") {
    updateUserInfo(dispatch);
  } else if (JSON.parse(userInfo).code !== 0) {
    ToastMessage("error", "未登录", "跳转回登录界面");
    Redirect(dispatch, "/login");
  } else {
    const data = JSON.parse(userInfo);
    return (
      <Home sidebar={true}>
        <div>
          <IRList unimportant="nothing" />
        </div>
      </Home>
    );
  }
  return (
    <Home sidebar={true}>
      <div>loading...</div>
    </Home>
  );
};

export default ProjectIR;
