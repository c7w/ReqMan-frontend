import Home from "../../../layout/Home";
import { useDispatch, useSelector } from "react-redux";
import { getUserStore } from "../../../store/slices/UserSlice";
import { getProjectStore } from "../../../store/slices/ProjectSlice";
import { getIRSRStore, getSRListStore } from "../../../store/slices/IRSRSlice";
import { useParams } from "react-router-dom";
import {
  updateProjectInfo,
  updateUserInfo,
} from "../../../store/functions/UMS";
import { Redirect, ToastMessage } from "../../../utils/Navigation";
import UISRList from "../../../components/rms/UISRList";
import {
  getIRListInfo,
  getIRSRInfo,
  getIterationInfo,
  getSRIterationInfo,
  getSRListInfo,
  getSRServiceInfo,
  getUserSRInfo,
  updateServiceInfo,
} from "../../../store/functions/RMS";
import Loading from "../../../layout/components/Loading";
import { useEffect } from "react";
import {
  getIterationStore,
  getSRIterationStore,
} from "../../../store/slices/IterationSlice";
import {
  getServiceStore,
  getSRServiceStore,
} from "../../../store/slices/ServiceSlice";
import { getUserSRStore } from "../../../store/slices/UserSRSlice";
import { getRDTSInfo } from "../../../store/functions/RDTS";

const ProjectSR = () => {
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

    getRDTSInfo(dispatcher, project_id);
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
    // ???????????????????????????????????????????????????
    ToastMessage("error", "?????????", "?????????????????????");
    Redirect(dispatcher, "/login");
  } else {
    // ????????????????????????
    const user_data = JSON.parse(userInfo);
    if (
      user_data.data.projects.filter((obj: any) => obj.id === project_id)
        .length > 0
    ) {
      // ??????????????????????????? project ???

      const projectData = JSON.parse(projectInfo);
      // ??????????????? project ???????????????????????? url ?????? project_id ??????
      if (projectData.data.project.id === Number(project_id)) {
        if (
          ["supermaster", "sys", "dev", "qa"].indexOf(
            JSON.parse(userInfo).data.projects.filter(
              (project: any) => project.id === Number(project_id)
            )[0].role
          ) < 0
        ) {
          Redirect(dispatcher, "/error", 0);
        }
        return (
          <Home sidebar={true}>
            <div>
              <UISRList
                showChoose={false}
                onlyShow={false}
                project_id={Number(project_id)}
                SRListStr={SRListInfo}
                userInfo={userInfo}
                IRSRAssociation={IRSRAssociation}
                IR_id={-1}
              />
            </div>
          </Home>
        );
      }
    } else {
      // ???????????????????????? project ???
      Redirect(dispatcher, "/error", 0);
    }
  }

  return (
    <Home sidebar={true}>
      <Loading />
    </Home>
  );
};

export default ProjectSR;
