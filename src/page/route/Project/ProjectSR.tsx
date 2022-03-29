import Home from "../../../layout/Home";
import { useDispatch, useSelector } from "react-redux";
import { getUserStore } from "../../../store/slices/UserSlice";
import { getProjectStore } from "../../../store/slices/ProjectSlice";
import { getSRListStore } from "../../../store/slices/IRSRSlice";
import { useParams } from "react-router-dom";
import {
  updateProjectInfo,
  updateUserInfo,
} from "../../../store/functions/UMS";
import { Redirect, ToastMessage } from "../../../utils/Navigation";
import UISRList from "../../../components/rms/UISRList";

const ProjectSR = () => {
  // Judge if project list in user state
  // If not re-query the user state from the backend
  // Render the project list
  const userInfo = useSelector(getUserStore);
  const projectInfo = useSelector(getProjectStore);
  const SRListInfo = useSelector(getSRListStore);

  const dispatcher = useDispatch();
  const params = useParams<"id">();
  const project_id = params.id;

  if (userInfo === "") {
    // 如果没有用户信息，就去 update
    updateUserInfo(dispatcher);
  } else if (JSON.parse(userInfo).code !== 0) {
    // 如果有用户信息但没登录，就跑去登录
    ToastMessage("error", "未登录", "跳转回登录界面");
    Redirect(dispatcher, "/login");
  } else {
    // 好了有用户信息了
    const user_data = JSON.parse(userInfo);
    console.log("userInfo:  " + userInfo);
    if (
      user_data.data.projects.filter(
        (obj: any) => obj.id.toString() === project_id
      ).length > 0
    ) {
      // 如果这个用户在这个 project 中
      if (projectInfo === "") {
        // store 没有信息，更新一下
        updateProjectInfo(dispatcher, Number(project_id));
      } else {
        const projectData = JSON.parse(projectInfo);
        // 如果得到的 project 信息跟用户键入的 url 中的 project_id 不符
        if (projectData.data.project.id !== Number(project_id)) {
          updateProjectInfo(dispatcher, Number(project_id));
        } else {
          return (
            <Home sidebar={true}>
              <div>
                <UISRList
                  showChoose={true}
                  myIRKey={1}
                  curSRKey={[1]}
                  project_id={2}
                  SRListStr={""}
                  userInfo={""}
                />
              </div>
            </Home>
          );
        }
      }
    } else {
      // 这个用户不在这个 project 中
      Redirect(dispatcher, "/error", 0);
    }
  }

  return (
    <Home sidebar={true}>
      <div></div>
    </Home>
  );
};

export default ProjectSR;
