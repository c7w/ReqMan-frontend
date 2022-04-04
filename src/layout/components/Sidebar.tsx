import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  SettingOutlined,
  AppstoreOutlined,
  AppstoreAddOutlined,
  CalendarOutlined,
  OrderedListOutlined,
  BugOutlined,
  PullRequestOutlined,
  UserOutlined,
  ClockCircleOutlined,
  RiseOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import "./Sidebar.css";

import React from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import {
  getIsCollapsed,
  updateIsCollapsed,
} from "../../store/slices/SidebarSlice";
import { getUserStore } from "../../store/slices/UserSlice";
import { useParams } from "react-router-dom";
import { getProjectStore } from "../../store/slices/ProjectSlice";
import { Redirect } from "../../utils/Navigation";

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
  const store = useStore();

  const path = store
    .getState()
    .router.location.pathname.split("/")
    .filter((item: string) => item);
  if (path.length !== 3) {
    path.push("/");
  }

  const item_list = [{ url: "/" }];

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
      theme={"light"}
      collapsible
      collapsed={isCollapsed}
      onCollapse={(collapsed) => onCollapse(collapsed)}
    >
      <Menu defaultSelectedKeys={[path[2]]} mode="inline" id={"sidebar-column"}>
        <Menu.Item
          key="/"
          className={"sidebar-item"}
          onClick={() => Redirect(dispatch, `/project/${project_id}/`, 0)}
          icon={<HomeOutlined />}
        >
          项目概览
        </Menu.Item>
        <Menu.Item
          key="requirements"
          className={"sidebar-item"}
          onClick={() =>
            Redirect(dispatch, `/project/${project_id}/requirements`, 0)
          }
          icon={<CalendarOutlined />}
        >
          需求查看
        </Menu.Item>
        <Menu.Item
          key="services"
          className={"sidebar-item"}
          onClick={() =>
            Redirect(dispatch, `/project/${project_id}/services`, 0)
          }
          icon={<AppstoreOutlined />}
        >
          服务查看
        </Menu.Item>
        {/*<Menu.Item*/}
        {/*  key="issues"*/}
        {/*  className={"sidebar-item"}*/}
        {/*  onClick={() => Redirect(dispatch, `/project/${project_id}/issues`, 0)}*/}
        {/*  icon={<BugOutlined />}*/}
        {/*>*/}
        {/*  缺陷查看*/}
        {/*</Menu.Item>*/}
        {/*<Menu.Item*/}
        {/*  key="commits"*/}
        {/*  className={"sidebar-item"}*/}
        {/*  onClick={() =>*/}
        {/*    Redirect(dispatch, `/project/${project_id}/commits`, 0)*/}
        {/*  }*/}
        {/*  icon={<RiseOutlined />}*/}
        {/*>*/}
        {/*  贡献查看*/}
        {/*</Menu.Item>*/}
        {/*<Menu.Item*/}
        {/*  key="merges"*/}
        {/*  className={"sidebar-item"}*/}
        {/*  onClick={() => Redirect(dispatch, `/project/${project_id}/merges`, 0)}*/}
        {/*  icon={<PullRequestOutlined />}*/}
        {/*>*/}
        {/*  合并情况查看*/}
        {/*</Menu.Item>*/}

        <Menu.Item
          key="analyse"
          className={"sidebar-item"}
          onClick={() =>
            Redirect(dispatch, `/project/${project_id}/iteration`, 0)
          }
          icon={<ClockCircleOutlined />}
        >
          迭代周期
        </Menu.Item>
        <Menu.Item
          key="member"
          className={"sidebar-item"}
          onClick={() => Redirect(dispatch, `/project/${project_id}/member`, 0)}
          icon={<UserOutlined />}
        >
          项目成员
        </Menu.Item>
        <Menu.Item
          key="IRManager"
          className={"sidebar-item"}
          onClick={() =>
            Redirect(dispatch, `/project/${project_id}/IRManager`, 0)
          }
          icon={<OrderedListOutlined />}
        >
          原始需求管理
        </Menu.Item>
        <Menu.Item
          key="SRManager"
          className={"sidebar-item"}
          onClick={() =>
            Redirect(dispatch, `/project/${project_id}/SRManager`, 0)
          }
          icon={<UnorderedListOutlined />}
        >
          功能需求管理
        </Menu.Item>
        <Menu.Item
          key="ServiceManager"
          className={"sidebar-item"}
          onClick={() =>
            Redirect(dispatch, `/project/${project_id}/ServiceManager`, 0)
          }
          icon={<AppstoreAddOutlined />}
        >
          项目服务管理
        </Menu.Item>
        <Menu.Item
          key="settings"
          className={"sidebar-item"}
          onClick={() =>
            Redirect(dispatch, `/project/${project_id}/settings`, 0)
          }
          icon={<SettingOutlined />}
        >
          项目设置
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
