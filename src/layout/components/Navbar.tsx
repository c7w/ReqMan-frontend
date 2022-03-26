import { Layout, Menu, Dropdown, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import React from "react";
import "./Navbar.css";
import logo from "../../assets/ReqMan.png";
import { logOut } from "../../store/functions/UMS";
import { useDispatch } from "react-redux";
import { push } from "redux-first-history";
import { Redirect } from "../../utils/Navigation";

const { Header } = Layout;

const Navbar = () => {
  const dispatcher = useDispatch();
  const menu = (
    <Menu>
      <Menu>
        <Menu.Item>
          <a onClick={() => dispatcher(push("/settings"))}>个人设置</a>
        </Menu.Item>
        <Menu.Item danger onClick={() => logOut(dispatcher)}>
          退出登录
        </Menu.Item>
      </Menu>
    </Menu>
  );
  return (
    <div>
      <Header className="header">
        <div className="header-left">
          <div className="undefined">
            <img src={logo} alt="undefined" width={133} height={36} />
          </div>
          <div
            className="header-item"
            onClick={() => Redirect(dispatcher, "/dashboard", 1)}
          >
            我的日程
          </div>
          <div
            className="header-item"
            onClick={() => Redirect(dispatcher, "/projects", 1)}
          >
            我的项目
          </div>
          <div
            className="header-item"
            onClick={() => Redirect(dispatcher, "/about", 0)}
          >
            关于
          </div>
        </div>
        <div className="header-right">
          <Dropdown
            className="avatar-wrapper"
            placement="bottomRight"
            overlay={menu}
            trigger={["click"]}
            arrow={{ pointAtCenter: true }}
          >
            <Avatar
              className="ant-dropdown-link"
              size="large"
              icon={<UserOutlined />}
            />
          </Dropdown>
        </div>
      </Header>
    </div>
  );
};

export default Navbar;
