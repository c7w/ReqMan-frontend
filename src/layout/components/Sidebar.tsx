import { Layout, Menu } from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import "./Sidebar.css";
import { useSelector, useDispatch } from "react-redux";
import { getIsCollapsed, updateIsCollapsed } from "./sidebarSlice";

const { Sider } = Layout;
const { SubMenu } = Menu;

const Sidebar = () => {
  const isCollapsed = useSelector(getIsCollapsed);
  const dispatch = useDispatch();

  const onCollapse = (collapsed: boolean) => {
    dispatch(updateIsCollapsed(collapsed));
  };

  return (
    <Sider
      collapsible
      collapsed={isCollapsed}
      onCollapse={(collapsed) => onCollapse(collapsed)}
    >
      <div className="logo" />
      <Menu theme="light" defaultSelectedKeys={["1"]} mode="inline">
        <Menu.Item key="1" icon={<PieChartOutlined />}>
          Option 1
        </Menu.Item>
        <Menu.Item key="2" icon={<DesktopOutlined />}>
          Option 2
        </Menu.Item>
        <SubMenu key="sub1" icon={<UserOutlined />} title="User">
          <Menu.Item key="3">Tom</Menu.Item>
          <Menu.Item key="4">Bill</Menu.Item>
          <Menu.Item key="5">Alex</Menu.Item>
        </SubMenu>
        <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
          <Menu.Item key="6">Team 1</Menu.Item>
          <Menu.Item key="8">Team 2</Menu.Item>
        </SubMenu>
        <Menu.Item key="9" icon={<FileOutlined />}>
          Files
        </Menu.Item>
        <Menu.Item key="10" icon={<PieChartOutlined />}>
          Option 1
        </Menu.Item>
        <Menu.Item key="11" icon={<DesktopOutlined />}>
          Option 2
        </Menu.Item>
        <SubMenu key="sub3" icon={<UserOutlined />} title="User">
          <Menu.Item key="12">Tom</Menu.Item>
          <Menu.Item key="13">Bill</Menu.Item>
          <Menu.Item key="14">Alex</Menu.Item>
        </SubMenu>
        <SubMenu key="sub4" icon={<TeamOutlined />} title="Team">
          <Menu.Item key="15">Team 1</Menu.Item>
          <Menu.Item key="16">Team 2</Menu.Item>
        </SubMenu>
        <Menu.Item key="17" icon={<FileOutlined />}>
          Files
        </Menu.Item>
        <Menu.Item key="18" icon={<PieChartOutlined />}>
          Option 1
        </Menu.Item>
        <Menu.Item key="19" icon={<DesktopOutlined />}>
          Option 2
        </Menu.Item>
        <SubMenu key="sub5" icon={<UserOutlined />} title="User">
          <Menu.Item key="20">Tom</Menu.Item>
          <Menu.Item key="21">Bill</Menu.Item>
          <Menu.Item key="22">Alex</Menu.Item>
        </SubMenu>
        <SubMenu key="sub6" icon={<TeamOutlined />} title="Team">
          <Menu.Item key="23">Team 1</Menu.Item>
          <Menu.Item key="24">Team 2</Menu.Item>
        </SubMenu>
        <Menu.Item key="25" icon={<FileOutlined />}>
          Files
        </Menu.Item>
        <Menu.Item key="26" icon={<PieChartOutlined />}>
          Option 1
        </Menu.Item>
        <Menu.Item key="27" icon={<DesktopOutlined />}>
          Option 2
        </Menu.Item>
        <SubMenu key="sub7" icon={<UserOutlined />} title="User">
          <Menu.Item key="28">Tom</Menu.Item>
          <Menu.Item key="29">Bill</Menu.Item>
          <Menu.Item key="30">Alex</Menu.Item>
        </SubMenu>
        <SubMenu key="sub8" icon={<TeamOutlined />} title="Team">
          <Menu.Item key="31">Team 1</Menu.Item>
          <Menu.Item key="32">Team 2</Menu.Item>
        </SubMenu>
        <Menu.Item key="33" icon={<FileOutlined />}>
          Files
        </Menu.Item>
      </Menu>
    </Sider>
  );
};
export default Sidebar;
