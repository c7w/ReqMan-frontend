import Home from "../../../layout/Home";
import { useDispatch, useSelector } from "react-redux";
import { getUserStore } from "../../../store/slices/UserSlice";
import {
  updateProjectInfo,
  updateUserInfo,
} from "../../../store/functions/UMS";
import { Redirect, ToastMessage } from "../../../utils/Navigation";
import { getProjectStore } from "../../../store/slices/ProjectSlice";
import { useParams } from "react-router-dom";

const Project = () => {
  // 1. Judge if user logged in, if not send to `/login`
  // 2. Judge if user has permission to this project, if not, send to `/notfound`
  // 3. Judge if this project has been retrieved from backend

  const userInfo = useSelector(getUserStore);
  const projectInfo = useSelector(getProjectStore);
  const dispatcher = useDispatch();

  const params = useParams<"id">();
  const project_id = params.id;

  // 1. User State Judge
  if (userInfo === "") {
    // Re-Query...
    updateUserInfo(dispatcher);
  } else if (JSON.parse(userInfo).code !== 0) {
    // Redirect to `Root`
    ToastMessage("error", "未确认登录态", "即将跳转回登录界面");
    Redirect(dispatcher, "/login");
  } else {
    // console.debug(JSON.parse(userInfo).data.projects);
    if (
      JSON.parse(userInfo).data.projects.filter(
        (obj: any) => obj.id.toString() === project_id
      ).length > 0
    ) {
      // 3. Continue, lookup projectInfo in cache.
      // If cached projectInfo not exists or cached ID not equal to project_id, then re-request, render Loading.
      // Else render page.
      if (projectInfo === "") {
        // Re-request
        updateProjectInfo(dispatcher, Number(project_id));
      } else {
        const projectData = JSON.parse(projectInfo);
        if (projectData.data.project.id !== Number(project_id)) {
          updateProjectInfo(dispatcher, Number(project_id));
        } else {
          // TODO: Render Page
          return (
            <Home sidebar={true}>
              <div>
                <p>{userInfo}</p>
                <p>{projectInfo}</p>
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
  }

  // Return Loading here...
  return (
    <Home sidebar={true}>
      <div>Loading...</div>
    </Home>
  );
};

export default Project;
