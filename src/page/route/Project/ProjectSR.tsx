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
} from "../../../store/functions/RMS";
import Loading from "../../../layout/components/Loading";
import { useEffect } from "react";
import { getSRIterationStore } from "../../../store/slices/IterationSlice";

const ProjectSR = () => {
  // Judge if project list in user state
  // If not re-query the user state from the backend
  // Render the project list
  const userInfo = useSelector(getUserStore);
  const projectInfo = useSelector(getProjectStore);
  const SRListInfo = useSelector(getSRListStore);
  const IRSRAssociation = useSelector(getIRSRStore);

  const SRIterationStore = useSelector(getSRIterationStore);
  const userSRStore = useSelector();

  const dispatcher = useDispatch();
  const params = useParams<"id">();
  const project_id = Number(params.id);

  useEffect(() => {
    updateUserInfo(dispatcher);
    updateProjectInfo(dispatcher, project_id);
    getIRListInfo(dispatcher, project_id);
    getSRListInfo(dispatcher, project_id);
    getIRSRInfo(dispatcher, project_id);
    getSRIterationInfo(dispatcher, project_id);
    getIterationInfo(dispatcher, project_id);
  }, []);

  if (userInfo === "") {
    // 如果没有用户信息，就去 update
    // Just let useEffect to re-query!
  } else if (JSON.parse(userInfo).code !== 0) {
    // 如果有用户信息但没登录，就跑去登录
    ToastMessage("error", "未登录", "跳转回登录界面");
    Redirect(dispatcher, "/login");
  } else {
    // 好了有用户信息了
    const user_data = JSON.parse(userInfo);
    console.log("userInfo:  " + userInfo);
    if (
      user_data.data.projects.filter((obj: any) => obj.id === project_id)
        .length > 0
    ) {
      // 如果这个用户在这个 project 中
      if (projectInfo === "") {
        // store 没有信息，更新一下
        // Just let useEffect to re-query!
      } else {
        const projectData = JSON.parse(projectInfo);
        console.log(projectInfo);
        // 如果得到的 project 信息跟用户键入的 url 中的 project_id 不符
        if (projectData.data.project.id !== Number(project_id)) {
          // Just let useEffect to re-query!
        } else {
          if (SRListInfo === "" || IRSRAssociation === "") {
            // Just let useEffect to re-query!
          } else {
            console.log("SRList:  " + SRListInfo);
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
        }
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

export default ProjectSR;
