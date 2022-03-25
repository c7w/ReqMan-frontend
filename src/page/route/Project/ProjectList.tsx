import Home from "../../../layout/Home";
import { useDispatch, useSelector } from "react-redux";
import { getUserStore } from "../../../store/slices/UserSlice";
import { immediateToast } from "izitoast-react";
import { Redirect, ToastMessage } from "../../../utils/Navigation";
import { updateUserInfo } from "../../../store/functions/UMS";
import Project from "./ProjectList";

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
    const data = JSON.parse(userInfo);
    return (
      <Home sidebar={true}>
        <div>
          <ProjectList />
          <p>{userInfo}</p>
        </div>
      </Home>
    );
  }

  // Loading Page
  return (
    <Home sidebar={true}>
      <div>Loading...</div>
    </Home>
  );
};

export default ProjectList;
