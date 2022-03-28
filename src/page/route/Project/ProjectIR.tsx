import Home from "../../../layout/Home";
import { useDispatch, useSelector } from "react-redux";
import { getUserStore } from "../../../store/slices/UserSlice";
import {
  updateProjectInfo,
  updateUserInfo,
} from "../../../store/functions/UMS";
import { Redirect, ToastMessage } from "../../../utils/Navigation";
import UIIRList from "../../../components/rms/UIIRList";
import { updateIRListInfo } from "../../../store/functions/RMS";
import { getIRListStore } from "../../../store/slices/rmsSlice";
import { useParams } from "react-router-dom";
import { getProjectStore } from "../../../store/slices/ProjectSlice";

const ProjectIR = () => {
  // Judge if project list in user state
  // If not re-query the user state from the backend
  // Render the project list
  const userInfo = useSelector(getUserStore);
  const projectInfo = useSelector(getProjectStore);
  const IRListInfo = useSelector(getIRListStore);
  const dispatcher = useDispatch();

  const params = useParams<"id">();
  const project_id = params.id;

  if (userInfo === "") {
    updateUserInfo(dispatcher);
  } else if (JSON.parse(userInfo).code !== 0) {
    console.log("here");
    ToastMessage("error", "未登录", "跳转回登录界面");
    Redirect(dispatcher, "/login");
  } else {
    const user_data = JSON.parse(userInfo); // user data, include all projects belonged to user
    console.log(user_data);
    if (
      JSON.parse(userInfo).data.projects.filter(
        (obj: any) => obj.id.toString() === project_id
      ).length > 0
    ) {
      if (projectInfo === "") {
        // without project, update from backend
        updateProjectInfo(dispatcher, Number(project_id));
      } else {
        const projectData = JSON.parse(projectInfo);
        console.log(projectData);
        // the project id is false, update from backend
        if (projectData.data.project.id !== Number(project_id)) {
          updateProjectInfo(dispatcher, Number(project_id));
        } else {
          if (IRListInfo === "") {
            // without IR, update from backend
            updateIRListInfo(dispatcher, Number(project_id));
          } else {
            console.log(JSON.parse(IRListInfo));
            return (
              <Home sidebar={true}>
                <div>
                  <UIIRList IRListStr={IRListInfo} />
                </div>
              </Home>
            );
          }
        }
      }
    } else {
      // without projects
      Redirect(dispatcher, "/error", 0);
    }
  }
  return (
    <Home sidebar={true}>
      <div>loading...</div>
    </Home>
  );
};

export default ProjectIR;
