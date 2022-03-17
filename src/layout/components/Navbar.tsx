import { Layout, Menu, Dropdown, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import React from "react";
import "./Navbar.css";

const { Header } = Layout;

class Navbar extends React.Component {
  render() {
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
          <Menu.Item danger>a danger item</Menu.Item>
        </Menu>
      </Menu>
    );
    return (
      <div>
        <Header className="header">
          <div className="header-left">
            <span className="header-item">nav 1</span>
            <span className="header-item">nav 2</span>
            <span className="header-item">nav 3</span>
          </div>
          <div className="header-right">
            <Dropdown
              className="avatar-wrapper"
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
  }
}

export default Navbar;
