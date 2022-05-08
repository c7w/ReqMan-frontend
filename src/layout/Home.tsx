import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Layout } from "antd";
import "./Home.css";
import React, { ReactElement, useState } from "react";
import { useSelector } from "react-redux";
import { getIsCollapsed } from "../store/slices/SidebarSlice";

const { Content } = Layout;

interface LayoutProps {
  sidebar: boolean;
  children: ReactElement;
}

const Home = (props: LayoutProps) => {
  const sidebarCollapsed = useSelector(getIsCollapsed);
  const [sidebarWidth, setSidebarWidth] = useState(
    sidebarCollapsed ? 160 : 200
  );

  return (
    <div>
      <Layout className="home">
        <Navbar />
        <Layout className="layout">
          {props.sidebar ? (
            <Sidebar
              getSidebarWidth={(width: number) => {
                console.log(width);
                setSidebarWidth(width);
              }}
            />
          ) : (
            <></>
          )}
          <div
            style={{
              marginRight: (sidebarWidth + 50).toString() + "px",
              height: "100vh",
            }}
          ></div>
          <div
            className="layout-right"
            style={{
              // marginLeft: (sidebarWidth + 50).toString() + "px",
              // marginLeft: "50px",
              marginRight: props.sidebar ? "5vw" : "200px",
              transition: "all, 0.2s",
            }}
          >
            <Content className="layout-content">{props.children}</Content>
            <div className={"layout-footer"}>
              © 2022 undefined. All rights reserved.
            </div>
          </div>
        </Layout>
      </Layout>
    </div>
  );
};

export default Home;
