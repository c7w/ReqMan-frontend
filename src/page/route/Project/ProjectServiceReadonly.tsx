import Home from "../../../layout/Home";
import UIServiceReadonly from "../../../components/rms/UIServiceReadonly";
import { useDispatch, useSelector } from "react-redux";
import { getUserStore } from "../../../store/slices/UserSlice";
import { getProjectStore } from "../../../store/slices/ProjectSlice";
import { useParams } from "react-router-dom";
import {
  updateProjectInfo,
  updateUserInfo,
} from "../../../store/functions/UMS";
import { Redirect, ToastMessage } from "../../../utils/Navigation";
import UIProjectSetting from "../../../components/rms/UIProjectSetting";
import Loading from "../../../layout/components/Loading";
import {
  getSRIterationInfo,
  getSRListInfo,
  getSRServiceInfo,
  updateServiceInfo,
} from "../../../store/functions/RMS";
import {
  getServiceStore,
  getSRServiceStore,
} from "../../../store/slices/ServiceSlice";
import { getSRIterationStore } from "../../../store/slices/IterationSlice";
import { getSRListStore } from "../../../store/slices/IRSRSlice";
import { useEffect } from "react";

const ProjectServiceReadonly = () => {
  // 1. Judge if user logged in, if not send to `/login`
  // 2. Judge if user has permission to this project, if not, send to `/notfound`
  // 3. Judge if this project has been retrieved from backend

  const userInfo = useSelector(getUserStore);
  const projectInfo = useSelector(getProjectStore);
  const serviceStore = useSelector(getServiceStore);
  const SRIterationAssociationStore = useSelector(getSRIterationStore);
  const SRServiceAssociationStore = useSelector(getSRServiceStore);
  const SRListStore = useSelector(getSRListStore);

  const dispatcher = useDispatch();

  const params = useParams<"id">();
  const project_id = params.id;

  useEffect(() => {
    updateUserInfo(dispatcher);
    updateProjectInfo(dispatcher, Number(project_id));
    updateServiceInfo(dispatcher, Number(project_id));
    getSRIterationInfo(dispatcher, Number(project_id));
    getSRServiceInfo(dispatcher, Number(project_id));
    getSRListInfo(dispatcher, Number(project_id));
  }, []);

  // 1. User State Judge
  if (
    userInfo === "" ||
    projectInfo === "" ||
    serviceStore === "" ||
    SRIterationAssociationStore === "" ||
    SRListStore === "" ||
    SRServiceAssociationStore === ""
  ) {
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

      const projectData = JSON.parse(projectInfo);
      if (projectData.data.project.id === Number(project_id)) {
        return (
          <Home sidebar={true}>
            <UIServiceReadonly />
          </Home>
        );
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

export default ProjectServiceReadonly;
