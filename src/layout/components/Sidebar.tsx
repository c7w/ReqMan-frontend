import { Layout, Menu } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import "./Sidebar.css";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getIsCollapsed,
  updateIsCollapsed,
} from "../../store/slices/SidebarSlice";
import { getUserStore } from "../../store/slices/UserSlice";
import { useParams } from "react-router-dom";
import { getProjectStore } from "../../store/slices/ProjectSlice";
import { Redirect } from "../../utils/Navigation";

const { SubMenu } = Menu;
const { Sider } = Layout;

const Sidebar = () => {
  const dispatch = useDispatch();

  // Collapse state between pages
  const isCollapsed = useSelector(getIsCollapsed);
  const onCollapse = (collapsed: boolean) => {
    dispatch(updateIsCollapsed(collapsed));
  };

  const userStore = useSelector(getUserStore);
  const projectStore = useSelector(getProjectStore);
  const params = useParams<"id">();
  const project_id = Number(params.id) || 0;

  let role = "developer";

  if (projectStore !== "") {
    const projectInfo = JSON.parse(projectStore);
    // TODO: Read from project info, what is my role ???
    // Show cards according to the role of people!
    role = "supermaster";
  }

  return (
    <Sider
      className="sidebar"
      collapsible
      collapsed={isCollapsed}
      onCollapse={(collapsed) => onCollapse(collapsed)}
    >
      <Menu defaultSelectedKeys={["1"]} mode="inline">
        <Menu.Item
          key="1"
          className={"sidebar-item"}
          onClick={() => Redirect(dispatch, `/project/${project_id}/`, 0)}
          icon={<HomeOutlined />}
        >
          项目概览
        </Menu.Item>
        <Menu.Item
          key="2"
          className={"sidebar-item"}
          onClick={() =>
            Redirect(dispatch, `/project/${project_id}/requirements`, 0)
          }
          icon={<HomeOutlined />}
        >
          需求查看
        </Menu.Item>
        <Menu.Item
          key="3"
          className={"sidebar-item"}
          onClick={() =>
            Redirect(dispatch, `/project/${project_id}/services`, 0)
          }
          icon={<HomeOutlined />}
        >
          服务查看
        </Menu.Item>
        <Menu.Item
          key="23"
          className={"sidebar-item"}
          onClick={() => Redirect(dispatch, `/project/${project_id}/issues`, 0)}
          icon={<HomeOutlined />}
        >
          缺陷查看
        </Menu.Item>
        <Menu.Item
          key="24"
          className={"sidebar-item"}
          onClick={() =>
            Redirect(dispatch, `/project/${project_id}/commits`, 0)
          }
          icon={<HomeOutlined />}
        >
          贡献查看
        </Menu.Item>
        <Menu.Item
          key="25"
          className={"sidebar-item"}
          onClick={() => Redirect(dispatch, `/project/${project_id}/merges`, 0)}
          icon={<HomeOutlined />}
        >
          合并情况查看
        </Menu.Item>

        <Menu.Item
          key="4"
          className={"sidebar-item"}
          onClick={() =>
            Redirect(dispatch, `/project/${project_id}/analyse`, 0)
          }
          icon={<HomeOutlined />}
        >
          周期进度
        </Menu.Item>
        <Menu.Item
          key="14"
          className={"sidebar-item"}
          onClick={() =>
            Redirect(dispatch, `/project/${project_id}/analyse`, 0)
          }
          icon={<HomeOutlined />}
        >
          成员
        </Menu.Item>
        <Menu.Item
          key="5"
          className={"sidebar-item"}
          onClick={() =>
            Redirect(dispatch, `/project/${project_id}/IRManager`, 0)
          }
          icon={<HomeOutlined />}
        >
          原始需求管理
        </Menu.Item>
        <Menu.Item
          key="6"
          className={"sidebar-item"}
          onClick={() =>
            Redirect(dispatch, `/project/${project_id}/SRManager`, 0)
          }
          icon={<HomeOutlined />}
        >
          功能需求管理
        </Menu.Item>
        <Menu.Item
          key="7"
          className={"sidebar-item"}
          onClick={() =>
            Redirect(dispatch, `/project/${project_id}/ServiceManager`, 0)
          }
          icon={<HomeOutlined />}
        >
          项目服务管理
        </Menu.Item>
        <Menu.Item
          key="8"
          className={"sidebar-item"}
          onClick={() =>
            Redirect(dispatch, `/project/${project_id}/settings`, 0)
          }
          icon={<HomeOutlined />}
        >
          项目设置
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
