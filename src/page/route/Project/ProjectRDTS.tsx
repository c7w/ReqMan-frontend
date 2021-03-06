import { useDispatch, useSelector } from "react-redux";
import { getUserStore } from "../../../store/slices/UserSlice";
import { getProjectStore } from "../../../store/slices/ProjectSlice";
import { getIRSRStore, getSRListStore } from "../../../store/slices/IRSRSlice";
import {
  getIterationStore,
  getSRIterationStore,
  updateIterationStore,
} from "../../../store/slices/IterationSlice";
import {
  getServiceStore,
  getSRServiceStore,
} from "../../../store/slices/ServiceSlice";
import { getUserSRStore } from "../../../store/slices/UserSRSlice";
import { useParams } from "react-router-dom";
import { ReactElement, useEffect } from "react";
import {
  updateProjectInfo,
  updateUserInfo,
} from "../../../store/functions/UMS";
import {
  getIterationInfo,
  getSRIterationInfo,
  getSRListInfo,
} from "../../../store/functions/RMS";
import { Redirect, ToastMessage } from "../../../utils/Navigation";
import Home from "../../../layout/Home";
import UISRList from "../../../components/rms/UISRList";
import Loading from "../../../layout/components/Loading";
import UIMerge from "../../../components/rdts/UIMerge";
import { getRepoStore } from "../../../store/slices/RepoSlice";
import {
  getCommitStore,
  getIssueSRAssociationStore,
  getIssueStore,
  getMergeStore,
  getMRSRAssociationStore,
} from "../../../store/slices/IssueSlice";
import { getRDTSInfo } from "../../../store/functions/RDTS";

interface ProjectRDTSProps {
  children: ReactElement;
}

const ProjectRDTS = (props: ProjectRDTSProps) => {
  // Judge if project list in user state
  // If not re-query the user state from the backend
  // Render the project list
  const userInfo = useSelector(getUserStore);
  const projectInfo = useSelector(getProjectStore);
  const SRListInfo = useSelector(getSRListStore);
  const iterationStore = useSelector(getIterationStore);
  const SRIterationStore = useSelector(getSRIterationStore);

  const repoInfo = useSelector(getRepoStore);
  const commitInfo = useSelector(getCommitStore);
  const mergeInfo = useSelector(getMergeStore);
  const issueInfo = useSelector(getIssueStore);

  const MRSRStore = useSelector(getMRSRAssociationStore);
  const issueSRStore = useSelector(getIssueSRAssociationStore);

  const dispatcher = useDispatch();
  const params = useParams<"id">();
  const project_id = Number(params.id);

  useEffect(() => {
    updateUserInfo(dispatcher);
    updateProjectInfo(dispatcher, project_id);
    getIterationInfo(dispatcher, project_id);
    getSRListInfo(dispatcher, project_id);
    getSRIterationInfo(dispatcher, project_id);
    getRDTSInfo(dispatcher, project_id);
  }, []);

  if (
    userInfo === "" ||
    projectInfo === "" ||
    SRListInfo === "" ||
    repoInfo === "" ||
    commitInfo === "" ||
    mergeInfo === "" ||
    issueInfo === "" ||
    MRSRStore === "" ||
    issueSRStore === "" ||
    iterationStore === "" ||
    SRIterationStore === ""
  ) {
    // Just let useEffect to re-query!
    console.debug("ProjectRDTS: Loading...");
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
          ["supermaster", "qa"].indexOf(
            JSON.parse(userInfo).data.projects.filter(
              (project: any) => project.id === Number(project_id)
            )[0].role
          ) < 0
        ) {
          Redirect(dispatcher, "/error", 0);
        }
        return <Home sidebar={true}>{props.children}</Home>;
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

export default ProjectRDTS;
