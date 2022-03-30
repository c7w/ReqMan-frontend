import Home from "../../../layout/Home";
import { useDispatch, useSelector } from "react-redux";
import { getUserStore } from "../../../store/slices/UserSlice";
import { Redirect, ToastMessage } from "../../../utils/Navigation";
import { updateUserInfo } from "../../../store/functions/UMS";
import UIProjectList from "../../../components/rms/UIProjectList";
import Loading from "../../../layout/components/Loading";

const ProjectList = () => {
  // Judge if project list in user state
  // If not re-query the user state from the backend
  // Render the project list
  const userInfo = useSelector(getUserStore);
  const dispatcher = useDispatch();

  if (userInfo === "") {
    // Re-Query...
    updateUserInfo(dispatcher);
  } else if (JSON.parse(userInfo).code !== 0) {
    // Redirect to `Root`
    ToastMessage("error", "未确认登录态", "即将跳转回登录界面");
    Redirect(dispatcher, "/login");
  } else {
    // Render Page
    const user_data = JSON.parse(userInfo);
    console.log(user_data.data.projects);
    return (
      <Home sidebar={false}>
        <div>
          <UIProjectList userInfo={userInfo} />
        </div>
      </Home>
    );
  }

  // Loading Page
  return (
    <Home sidebar={false}>
      <Loading />
    </Home>
  );
};

export default ProjectList;
