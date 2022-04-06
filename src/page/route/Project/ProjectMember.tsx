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
import Loading from "../../../layout/components/Loading";
import {
  getIRIterationStore,
  getIterationStore,
  getUserIterationStore,
} from "../../../store/slices/IterationSlice";
import { useEffect } from "react";
import {
  getIterationInfo,
  getUserIterationInfo,
} from "../../../store/functions/RMS";

const ProjectMember = () => {
  // Store subscription
  const userInfo = useSelector(getUserStore);
  const projectInfo = useSelector(getProjectStore);
  const iterationStore = useSelector(getIterationStore);
  const userIterStore = useSelector(getUserIterationStore);

  const dispatcher = useDispatch();
  const params = useParams<"id">();
  const project_id = params.id;

  useEffect(() => {
    updateUserInfo(dispatcher);
    updateProjectInfo(dispatcher, Number(project_id));
    getIterationInfo(dispatcher, Number(project_id));
    getUserIterationInfo(dispatcher, Number(project_id));
  }, []);

  if (
    userInfo === "" ||
    projectInfo === "" ||
    iterationStore === "" ||
    userIterStore === ""
  ) {
    // Waiting for Query...
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
      const projectData = JSON.parse(projectInfo);

      if (
        JSON.parse(userInfo).data.projects.filter(
          (project: any) => project.id === Number(project_id)
        )[0].role === "member"
      ) {
        Redirect(dispatcher, "/error", 0);
      }

      if (projectData.data.project.id === Number(project_id)) {
        // Render Page
        return (
          <Home sidebar={true}>
            <div>
              <UIUserManage userInfo={projectInfo} />
            </div>
          </Home>
        );
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
      <Loading />
    </Home>
  );
};

export default ProjectMember;
