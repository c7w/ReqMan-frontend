import Home from "../../../layout/Home";
import { useDispatch, useSelector } from "react-redux";
import { getUserStore } from "../../../store/slices/UserSlice";
import { getProjectStore } from "../../../store/slices/ProjectSlice";
import { useParams } from "react-router-dom";
import {
  updateProjectInfo,
  updateUserInfo,
} from "../../../store/functions/UMS";
import { Redirect, ToastMessage } from "../../../utils/Navigation";
import UIProject from "../../../components/rms/UIProject";
import Loading from "../../../layout/components/Loading";
import UIProjectSetting from "../../../components/rms/UIProjectSetting";
import { useEffect } from "react";
import { getRepoStore, updateRepoStore } from "../../../store/slices/RepoSlice";
import { getRepoInfo } from "../../../store/functions/RDTS";

const ProjectSetting = () => {
  // 1. Judge if user logged in, if not send to `/login`
  // 2. Judge if user has permission to this project, if not, send to `/notfound`
  // 3. Judge if this project has been retrieved from backend

  const userInfo = useSelector(getUserStore);
  const projectInfo = useSelector(getProjectStore);
  const repoStore = useSelector(getRepoStore);
  const dispatcher = useDispatch();

  const params = useParams<"id">();
  const project_id = params.id;

  useEffect(() => {
    updateUserInfo(dispatcher);
    updateProjectInfo(dispatcher, Number(project_id));
    getRepoInfo(dispatcher, Number(project_id));
  }, []);
  console.debug(repoStore);

  // 1. User State Judge
  if (userInfo === "" || projectInfo === "" || repoStore === "") {
    // Re-Query...
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
          if (
            ["supermaster"].indexOf(
              JSON.parse(userInfo).data.projects.filter(
                (project: any) => project.id === Number(project_id)
              )[0].role
            ) < 0
          ) {
            Redirect(dispatcher, "/error", 0);
          }

          return (
            <Home sidebar={true}>
              <UIProjectSetting />
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
      <Loading />
    </Home>
  );
};

export default ProjectSetting;
