import { Layout, Menu, Dropdown, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import React from "react";
import "./Navbar.css";
import logo from "../../assets/ReqMan.png";
import { logOut } from "../../store/functions/UMS";
import { useDispatch, useSelector } from "react-redux";
import { push } from "redux-first-history";
import { Redirect } from "../../utils/Navigation";
import { getUserStore } from "../../store/slices/UserSlice";
import CryptoJS from "crypto-js";
import { getUserAvatar } from "../../utils/UserAvatar";

const { Header } = Layout;

const Navbar = () => {
  const userStore = useSelector(getUserStore);
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
          <div className="dashboard-undefined">
            <img
              src={logo}
              alt="undefined"
              className="navbar-logo"
              width={133}
              height={36}
              onClick={() => Redirect(dispatcher, "/", 0)}
            />
          </div>
          <div
            className="header-item"
            onClick={() => Redirect(dispatcher, "/projects", 1)}
          >
            我的项目
          </div>
          <div
            className="header-item"
            onClick={() =>
              window.open("https://doc-undefined.app.secoder.net/")
            }
          >
            开发者文档
          </div>
          <div
            className="header-item"
            onClick={() =>
              window.open("https://doc-undefined.app.secoder.net/manual/")
            }
          >
            用户手册
          </div>
        </div>
        <div className="header-right">
          <span
            style={{
              color: "white",
              marginRight: "1.5rem",
              fontSize: "1.2rem",
              userSelect: "none",
              cursor: "default",
            }}
          >
            {userStore === "" || JSON.parse(userStore).code !== 0
              ? ""
              : JSON.parse(userStore).data.user.name}
          </span>
          <Dropdown
            className="avatar-wrapper"
            placement="bottomRight"
            overlay={menu}
            trigger={["click"]}
            arrow={{ pointAtCenter: true }}
          >
            <Avatar
              className={"ant-dropdown-link small-avatar"}
              size="large"
              style={{ cursor: "pointer" }}
              icon={<UserOutlined />}
              src={getUserAvatar(userStore)}
            />
          </Dropdown>
        </div>
      </Header>
    </div>
  );
};

export default Navbar;
