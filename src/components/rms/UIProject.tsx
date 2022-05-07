import { Breadcrumb, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Redirect } from "../../utils/Navigation";
import { useDispatch, useSelector } from "react-redux";
import "./UIProject.css";
import Calendar from "./Calendar";
import { getProjectStore } from "../../store/slices/ProjectSlice";
import CryptoJS from "crypto-js";
import { UIUserCardPreview } from "../ums/UIUserCard";

interface UIProjectProps {
  id: number;
  title: string;
  description: string;
  invitation: string;
  disabled: boolean;
  createdAt: string;
  userInfo: string;
}

const UIProject = (props: UIProjectProps) => {
  const dispatcher = useDispatch();
  const projectStore = useSelector(getProjectStore);
  const allUserInfo = JSON.parse(projectStore).data.users;
  const avatarList: any = [];
  allUserInfo.forEach((user: any) => {
    avatarList.push(
      <UIUserCardPreview
        projectStore={projectStore}
        userId={user.id}
        key={user.id}
      />
    );
  });
  return (
    <>
      <div className="ui-project">
        <Breadcrumb className="ui-project-breadcrumb">
          <Breadcrumb.Item
            className="ui-project-breadcrumb-item"
            onClick={() => Redirect(dispatcher, "/projects", 0)}
          >
            项目列表
          </Breadcrumb.Item>
          <Breadcrumb.Item className="ui-project-breadcrumb-item">
            {props.title}
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className="ui-project-info">
          <div className="ui-project-info-left">
            {props.title.toUpperCase()} 工作面板
          </div>
          <div className="ui-project-info-right"></div>
        </div>
        <Avatar.Group className="ui-project-avatar-group">
          {avatarList}
        </Avatar.Group>
        <Calendar userInfo={props.userInfo} inProject={true} />
      </div>
    </>
  );
};

export default UIProject;
