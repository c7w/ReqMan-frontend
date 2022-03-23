import { Layout, Menu } from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  AppleOutlined,
  GithubOutlined,
  BarsOutlined,
  BookOutlined,
  CarryOutOutlined,
  CoffeeOutlined,
  CompressOutlined,
  DingtalkOutlined,
  FrownOutlined,
  LoadingOutlined,
  SendOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import "./Sidebar.css";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getIsCollapsed,
  updateIsCollapsed,
} from "../../store/slices/SidebarSlice";

const { SubMenu } = Menu;
const { Sider } = Layout;

const Sidebar = () => {
  const isCollapsed = useSelector(getIsCollapsed);
  const dispatch = useDispatch();

  const onCollapse = (collapsed: boolean) => {
    dispatch(updateIsCollapsed(collapsed));
  };
  return (
    <Sider
      className="sidebar"
      collapsible
      collapsed={isCollapsed}
      onCollapse={(collapsed) => onCollapse(collapsed)}
    >
      <Menu defaultSelectedKeys={["1"]} mode="inline">
        <SubMenu key="sub1" icon={<UserOutlined />} title="User">
          <Menu.Item key="3">Tom</Menu.Item>
          <Menu.Item key="4">Bill</Menu.Item>
        </SubMenu>
        <Menu.Item key="9" icon={<FileOutlined />}>
          Files
        </Menu.Item>
        <Menu.Item key="10" icon={<AppleOutlined />}>
          glb nb!
        </Menu.Item>
        <Menu.Item key="11" icon={<GithubOutlined />}>
          wxy xgg!
        </Menu.Item>
        <Menu.Item key="12" icon={<BarsOutlined />}>
          qc xjj!
        </Menu.Item>
        <Menu.Item key="13" icon={<BookOutlined />}>
          lambda xgg!
        </Menu.Item>
        <Menu.Item key="14" icon={<CarryOutOutlined />}>
          play
        </Menu.Item>
        <Menu.Item key="15" icon={<CoffeeOutlined />}>
          with
        </Menu.Item>
        <Menu.Item key="16" icon={<CompressOutlined />}>
          me
        </Menu.Item>
        <Menu.Item key="17" icon={<DingtalkOutlined />}>
          I
        </Menu.Item>
        <Menu.Item key="18" icon={<FrownOutlined />}>
          am
        </Menu.Item>
        <Menu.Item key="19" icon={<LoadingOutlined />}>
          hbx
        </Menu.Item>
        <Menu.Item key="20" icon={<SendOutlined />}>
          wu
        </Menu.Item>
        <Menu.Item key="21" icon={<SmileOutlined />}>
          hu
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
