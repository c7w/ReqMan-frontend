import { useDispatch, useSelector } from "react-redux";
import { getUserStore } from "../../../store/slices/UserSlice";
import { getProjectStore } from "../../../store/slices/ProjectSlice";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import {
  updateProjectInfo,
  updateUserInfo,
} from "../../../store/functions/UMS";
import { getRDTSInfo } from "../../../store/functions/RDTS";
import Home from "../../../layout/Home";
import Loading from "../../../layout/components/Loading";
import { Redirect } from "../../../utils/Navigation";
import UIFile from "../../../components/rdts/UIFile";
import { getRepoStore } from "../../../store/slices/RepoSlice";

const ProjectFile = () => {
  const userInfo = useSelector(getUserStore);
  const projectInfo = useSelector(getProjectStore);
  const repoStore = useSelector(getRepoStore);

  const dispatcher = useDispatch();
  const params = useParams<"id">();
  const project_id = Number(params.id);

  useEffect(() => {
    updateUserInfo(dispatcher);
    updateProjectInfo(dispatcher, Number(project_id));
    getRDTSInfo(dispatcher, Number(project_id));
  }, []);

  if (
    userInfo === "" ||
    projectInfo === "" ||
    repoStore === "" ||
    JSON.parse(projectInfo).data.project.id !== project_id
  ) {
    // Just wait for response...
  } else if (
    JSON.parse(userInfo).data.projects.filter(
      (obj: any) => obj.id === project_id
    ).length <= 0
  ) {
    // Error: User not in project!
    Redirect(dispatcher, "/error", 0);
  } else {
    return (
      <Home sidebar={true}>
        <UIFile />
      </Home>
    );
  }

  return (
    <Home sidebar={true}>
      <Loading />
    </Home>
  );
};

export default ProjectFile;
