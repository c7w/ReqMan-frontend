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
  getSRIterationStore,
} from "../../../store/slices/IterationSlice";
import {
  getIRIterationInfo,
  getIRListInfo,
  getIRSRInfo,
  getIterationInfo,
  getSRIterationInfo,
  getSRListInfo,
  updateServiceInfo,
} from "../../../store/functions/RMS";
import { useEffect } from "react";
import UIIteration from "../../../components/rms/UIIteration";
import {
  getIRListStore,
  getIRSRStore,
  getSRListStore,
} from "../../../store/slices/IRSRSlice";

const ProjectIteration = () => {
  const userStore = useSelector(getUserStore);
  const projectStore = useSelector(getProjectStore);
  const iterationStore = useSelector(getIterationStore);
  const IRStore = useSelector(getIRListStore);
  const SRStore = useSelector(getSRListStore);
  const IRSRAssociationStore = useSelector(getIRSRStore);
  const SRIterStore = useSelector(getSRIterationStore);

  const dispatcher = useDispatch();
  const params = useParams<"id">();
  const project_id = Number(params.id);

  useEffect(() => {
    // Update initial state of subscribed stores
    updateUserInfo(dispatcher);
    updateProjectInfo(dispatcher, project_id);
    getIterationInfo(dispatcher, project_id);
    getIRListInfo(dispatcher, project_id);
    getSRListInfo(dispatcher, project_id);
    getSRIterationInfo(dispatcher, project_id);
    getIRSRInfo(dispatcher, project_id);
  }, []);

  if (
    userStore === "" ||
    projectStore === "" ||
    iterationStore === "" ||
    IRStore === "" ||
    SRStore === "" ||
    SRIterStore === "" ||
    IRSRAssociationStore === ""
  ) {
    // Waiting for query...
  } else if (JSON.parse(userStore).code !== 0) {
    // Redirect to `Root`
    ToastMessage("error", "未确认登录态", "即将跳转回登录界面");
    Redirect(dispatcher, "/login");
  } else if (
    JSON.parse(projectStore).code !== 0 ||
    JSON.parse(iterationStore).code !== 0
  ) {
    ToastMessage("error", "项目信息拉取失败", "即将跳转回项目列表");
    Redirect(dispatcher, "/projects");
  } else if (false) {
    // TODO: Auth, what is my role???
    Redirect(dispatcher, "/error", 0);
  } else {
    return (
      <Home sidebar={true}>
        <UIIteration />
      </Home>
    );
  }
  return (
    <Home sidebar={true}>
      <Loading />
    </Home>
  );
};

export default ProjectIteration;