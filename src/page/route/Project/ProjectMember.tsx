import Home from "../../../layout/Home";
import { useDispatch, useSelector } from "react-redux";
import { getUserStore } from "../../../store/slices/UserSlice";
import {
  updateProjectInfo,
  updateUserInfo,
} from "../../../store/functions/UMS";
import { Redirect, ToastMessage } from "../../../utils/Navigation";
import UIProjectList from "../../../components/rms/UIProjectList";
import UIUserManage from "../../../components/rms/UIUserManage";
import { useParams } from "react-router-dom";
import UIProject from "../../../components/rms/UIProject";

const ProjectMember = () => {
  // Judge if project list in user state
  // If not re-query the user state from the backend
  // Render the project list
  const userInfo = useSelector(getUserStore);
  const dispatcher = useDispatch();
  const project_id = useParams<"id">();
  if (userInfo === "") {
    // Re-Query...
    updateUserInfo(dispatcher);
  } else if (JSON.parse(userInfo).code !== 0) {
    // Redirect to `Root`
    ToastMessage("error", "未确认登录态", "即将跳转回登录界面");
    Redirect(dispatcher, "/login");
  } else {
    if (
      JSON.parse(userInfo).data.projects.filter(
        (obj: any) => obj.id.toString() === project_id
      ).length > 0
    ) {
      // Render Page
      updateProjectInfo(dispatcher, Number(project_id));
      return (
        <Home sidebar={false}>
          <div>
            <UIUserManage userInfo={userInfo} />
          </div>
        </Home>
      );
    } else {
      // 2. Redirect to notfound
      // console.debug("notfound");
      Redirect(dispatcher, "/error", 0);
    }

    const user_data = JSON.parse(userInfo);
    console.log(userInfo);
  }
  return (
    <Home sidebar={true}>
      <div>Loading Member Page</div>
    </Home>
  );
};

export default ProjectMember;
