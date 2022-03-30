import { Breadcrumb, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Redirect } from "../../utils/Navigation";
import { useDispatch } from "react-redux";
import "./UIProject.css";
import Calendar from "./Calendar";

interface UIProjectProps {
  id: number;
  title: string;
  description: string;
  invitation: string;
  disabled: boolean;
  createdAt: string;
}

const UIProject = (props: UIProjectProps) => {
  const dispatcher = useDispatch();
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
          <div className="ui-project-info-right">收藏+点赞</div>
        </div>
        <Avatar.Group className="ui-project-avatar-group">
          <Avatar
            className="ui-project-avatar"
            src="https://joeschmoe.io/api/v1/random"
          />
          <Avatar
            className="ui-project-avatar"
            style={{ backgroundColor: "#f56a00" }}
          >
            K
          </Avatar>
          <Avatar
            className="ui-project-avatar"
            style={{ backgroundColor: "#87d068" }}
            icon={<UserOutlined />}
          />
          <Avatar
            className="ui-project-avatar"
            style={{ backgroundColor: "#1890ff" }}
            icon={<UserOutlined />}
          />
        </Avatar.Group>
        <Calendar />
      </div>
    </>
  );
};

export default UIProject;
