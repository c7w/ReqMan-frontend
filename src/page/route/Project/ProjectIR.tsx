import Home from "../../../layout/Home";
import { useDispatch, useSelector } from "react-redux";
import { getUserStore } from "../../../store/slices/UserSlice";
import {
  updateProjectInfo,
  updateUserInfo,
} from "../../../store/functions/UMS";
import { Redirect, ToastMessage } from "../../../utils/Navigation";
import UIIRList from "../../../components/rms/UIIRList";
import {
  getIRListInfo,
  getIRSRInfo,
  getSRListInfo,
} from "../../../store/functions/RMS";
import {
  getIRListStore,
  getIRSRStore,
  getSRListStore,
} from "../../../store/slices/IRSRSlice";
import { useParams } from "react-router-dom";
import { getProjectStore } from "../../../store/slices/ProjectSlice";
import Loading from "../../../layout/components/Loading";

const ProjectIR = () => {
  // Judge if project list in user state
  // If not re-query the user state from the backend
  // Render the project list
  const userInfo = useSelector(getUserStore);
  const projectInfo = useSelector(getProjectStore);
  const IRListInfo = useSelector(getIRListStore);
  const SRListInfo = useSelector(getSRListStore);
  const IRSRAssociation = useSelector(getIRSRStore);

  const dispatcher = useDispatch();

  const params = useParams<"id">();
  const project_id = params.id;

  if (userInfo === "") {
    updateUserInfo(dispatcher);
  } else if (JSON.parse(userInfo).code !== 0) {
    ToastMessage("error", "未登录", "跳转回登录界面");
    Redirect(dispatcher, "/login");
  } else {
    const user_data = JSON.parse(userInfo); // user data, include all projects belonged to user
    console.log("userInfo:  " + user_data);
    if (
      user_data.data.projects.filter(
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
          if (
            IRListInfo === "" ||
            SRListInfo === "" ||
            IRSRAssociation === ""
          ) {
            // without IR, update from backend
            getIRListInfo(dispatcher, Number(project_id));
            getSRListInfo(dispatcher, Number(project_id));
            getIRSRInfo(dispatcher, Number(project_id));
          } else {
            console.log(JSON.parse(IRListInfo));
            return (
              <Home sidebar={true}>
                <div>
                  <UIIRList
                    IRListStr={IRListInfo}
                    project_id={Number(project_id)}
                    userInfo={userInfo}
                    SRListStr={SRListInfo}
                    IRSRAssociation={IRSRAssociation}
                    onlyShow={true}
                  />
                </div>
              </Home>
            );
          }
        }
      }
    } else {
      // 该用户没有 project
      Redirect(dispatcher, "/error", 0);
    }
  }
  return (
    <Home sidebar={true}>
      <Loading />
    </Home>
  );
};

export default ProjectIR;
