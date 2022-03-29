import Home from "../../../layout/Home";
import { useDispatch, useSelector } from "react-redux";
import { getUserStore } from "../../../store/slices/UserSlice";
import { updateUserInfo } from "../../../store/functions/UMS";
import { Redirect, ToastMessage } from "../../../utils/Navigation";
import UIProjectList from "../../../components/rms/UIProjectList";
import UIUserManage from "../../../components/rms/UIUserManage";

const ProjectMember = () => {
  // Judge if project list in user state
  // If not re-query the user state from the backend
  // Render the project list
  const userInfo = useSelector(getUserStore);
  const dispatcher = useDispatch();

  if (userInfo === "") {
    // Re-Query...
    updateUserInfo(dispatcher);
  } else if (JSON.parse(userInfo).code !== 0) {
    // Redirect to `Root`
    ToastMessage("error", "未确认登录态", "即将跳转回登录界面");
    Redirect(dispatcher, "/login");
  } else {
    // Render Page
    const user_data = JSON.parse(userInfo);
    console.log(user_data.data);
    return (
      <Home sidebar={false}>
        <div>
          <UIUserManage
            userInfo={
              "[{id: 1, name: 'hahah', email: 'c7w@nb.com', avatar: '...'}]"
            }
          />
        </div>
      </Home>
    );
  }

  return (
    <Home sidebar={true}>
      <div>Loading Member Page</div>
    </Home>
  );
};

export default ProjectMember;
