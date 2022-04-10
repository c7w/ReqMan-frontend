import { useDispatch, useSelector } from "react-redux";
import { getUserStore } from "../../../store/slices/UserSlice";
import { getProjectStore } from "../../../store/slices/ProjectSlice";
import { getIRSRStore, getSRListStore } from "../../../store/slices/IRSRSlice";
import {
  getIterationStore,
  getSRIterationStore,
} from "../../../store/slices/IterationSlice";
import {
  getServiceStore,
  getSRServiceStore,
} from "../../../store/slices/ServiceSlice";
import { getUserSRStore } from "../../../store/slices/UserSRSlice";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import {
  updateProjectInfo,
  updateUserInfo,
} from "../../../store/functions/UMS";
import {
  getIRSRInfo,
  getIterationInfo,
  getSRIterationInfo,
  getSRListInfo,
  getSRServiceInfo,
  getUserSRInfo,
  updateServiceInfo,
} from "../../../store/functions/RMS";
import { Redirect, ToastMessage } from "../../../utils/Navigation";
import Home from "../../../layout/Home";
import UISRList from "../../../components/rms/UISRList";
import Loading from "../../../layout/components/Loading";
import UIMerge from "../../../components/rms/UIMerge";

const ProjectMergeRequest = () => {
  // Judge if project list in user state
  // If not re-query the user state from the backend
  // Render the project list
  const userInfo = useSelector(getUserStore);
  const projectInfo = useSelector(getProjectStore);
  const SRListInfo = useSelector(getSRListStore);
  const IRSRAssociation = useSelector(getIRSRStore);

  const iterationStore = useSelector(getIterationStore);
  const SRIterationStore = useSelector(getSRIterationStore);
  const serviceStore = useSelector(getServiceStore);
  const SRServiceStore = useSelector(getSRServiceStore);
  const UserSRStore = useSelector(getUserSRStore);

  const dispatcher = useDispatch();
  const params = useParams<"id">();
  const project_id = Number(params.id);

  useEffect(() => {
    updateUserInfo(dispatcher);
    updateProjectInfo(dispatcher, project_id);
    getSRListInfo(dispatcher, project_id);
    getIRSRInfo(dispatcher, project_id);
    updateServiceInfo(dispatcher, project_id);
    getIterationInfo(dispatcher, project_id);
    getSRIterationInfo(dispatcher, project_id);
    getSRServiceInfo(dispatcher, project_id);
    getUserSRInfo(dispatcher, project_id);
  }, []);

  if (
    userInfo === "" ||
    projectInfo === "" ||
    SRListInfo === "" ||
    IRSRAssociation === "" ||
    iterationStore === "" ||
    SRIterationStore === "" ||
    serviceStore === "" ||
    SRServiceStore === "" ||
    UserSRStore === ""
  ) {
    // Just let useEffect to re-query!
  } else if (JSON.parse(userInfo).code !== 0) {
    // 如果有用户信息但没登录，就跑去登录
    ToastMessage("error", "未登录", "跳转回登录界面");
    Redirect(dispatcher, "/login");
  } else {
    // 好了有用户信息了
    const user_data = JSON.parse(userInfo);
    if (
      user_data.data.projects.filter((obj: any) => obj.id === project_id)
        .length > 0
    ) {
      // 如果这个用户在这个 project 中

      const projectData = JSON.parse(projectInfo);
      // 如果得到的 project 信息跟用户键入的 url 中的 project_id 不符
      if (projectData.data.project.id === Number(project_id)) {
        if (
          ["supermaster", "qa"].indexOf(
            JSON.parse(userInfo).data.projects.filter(
              (project: any) => project.id === Number(project_id)
            )[0].role
          ) < 0
        ) {
          Redirect(dispatcher, "/error", 0);
        }
        return (
          <Home sidebar={true}>
            <UIMerge />
          </Home>
        );
      }
    } else {
      // 这个用户不在这个 project 中
      Redirect(dispatcher, "/error", 0);
    }
  }

  return (
    <Home sidebar={true}>
      <Loading />
    </Home>
  );
};

export default ProjectMergeRequest;
