import { Layout, Menu, Dropdown, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import React from "react";
import "./Navbar.css";
import logo from "../../assets/Reqman-1.svg";
import { logOut } from "../../store/functions/UMS";
import { useDispatch } from "react-redux";

const { Header } = Layout;

const Navbar = () => {
  const dispatcher = useDispatch();
  const menu = (
    <Menu>
      <Menu>
        <Menu.Item>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.antgroup.com"
          >
            1st menu item
          </a>
        </Menu.Item>
        <Menu.Item>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.aliyun.com"
          >
            2nd menu item
          </a>
        </Menu.Item>
        <Menu.Item>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.luohanacademy.com"
          >
            3rd menu item
          </a>
        </Menu.Item>
        <Menu.Item danger onClick={() => logOut(dispatcher)}>
          注销
        </Menu.Item>
      </Menu>
    </Menu>
  );
  return (
    <div>
      <Header className="header">
        <div className="header-left">
          <div className="undefined">
            <img src={logo} alt="undefined" width={120} height={56} />
          </div>
          <div className="header-item">nav 1</div>
          <div className="header-item">nav 2</div>
          <div className="header-item">nav 3</div>
        </div>
        <div className="header-right">
          <Dropdown
            className="avatar-wrapper"
            placement="bottomRight"
            overlay={menu}
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
