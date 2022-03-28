import Home from "../../../layout/Home";
import { useDispatch, useSelector } from "react-redux";
import { getUserStore } from "../../../store/slices/UserSlice";
import { updateUserInfo } from "../../../store/functions/UMS";
import { Redirect, ToastMessage } from "../../../utils/Navigation";
import IRList from "../../../components/rms/IRList";
import { updateIRListInfo } from "../../../store/functions/RMS";
import { getIRListStore } from "../../../store/slices/IRSRSlice";

const ProjectIR = () => {
  // Judge if project list in user state
  // If not re-query the user state from the backend
  // Render the project list
  const userInfo = useSelector(getUserStore);
  const IRListInfo = useSelector(getIRListStore);
  const dispatch = useDispatch();

  if (userInfo === "") {
    updateUserInfo(dispatch);
  } else if (JSON.parse(userInfo).code !== 0) {
    console.log("here");
    ToastMessage("error", "未登录", "跳转回登录界面");
    Redirect(dispatch, "/login");
  } else {
    updateIRListInfo(dispatch);

    const user_data = JSON.parse(userInfo);
    return (
      <Home sidebar={true}>
        <div>
          <IRList />
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
