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
import { getProjectStore } from "../../../store/slices/ProjectSlice";

const ProjectMember = () => {
  // Judge if project list in user state
  // If not re-query the user state from the backend
  // Render the project list
  const userInfo = useSelector(getUserStore);
  const projectInfo = useSelector(getProjectStore);
  const dispatcher = useDispatch();
  const params = useParams<"id">();
  const project_id = params.id;

  if (userInfo === "") {
    // Re-Query...
    updateUserInfo(dispatcher);
  } else if (JSON.parse(userInfo).code !== 0) {
    // Redirect to `Root`
    ToastMessage("error", "未确认登录态", "即将跳转回登录界面");
    Redirect(dispatcher, "/login");
  } else {
    console.debug(JSON.parse(userInfo));
    if (
      JSON.parse(userInfo).data.projects.filter(
        (obj: any) => obj.id.toString() === project_id
      ).length > 0
    ) {
      if (projectInfo === "") {
        // Re-request
        updateProjectInfo(dispatcher, Number(project_id));
      } else {
        const projectData = JSON.parse(projectInfo);
        if (projectData.data.project.id !== Number(project_id)) {
          updateProjectInfo(dispatcher, Number(project_id));
        } else {
          // Render Page
          console.log(projectData);
          return (
            <Home sidebar={false}>
              <div>
                <UIUserManage userInfo={projectInfo} />
              </div>
            </Home>
          );
        }
      }
    } else {
      // 2. Redirect to notfound
      // console.debug("notfound");
      Redirect(dispatcher, "/error", 0);
    }

    // const user_data = JSON.parse(userInfo);
    // console.log(userInfo);
  }
  return (
    <Home sidebar={true}>
      <div>Loading Member Page</div>
    </Home>
  );
};

export default ProjectMember;
