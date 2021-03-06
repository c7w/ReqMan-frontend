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
        <Layout
          className="layout"
          style={{
            flexDirection: "row",
          }}
        >
          {props.sidebar ? (
            <Sidebar
              getSidebarWidth={(width: number) => setSidebarWidth(width)}
            />
          ) : (
            <></>
          )}
          <div
            style={{
              // marginRight: props.sidebar
              //   ? (sidebarWidth + 50).toString() + "px"
              //   : sidebarWidth.toString() + "px",
              height: "100vh",
            }}
          />
          <div
            className="layout-right"
            style={{
              marginLeft: props.sidebar
                ? (sidebarWidth + 50).toString() + "px"
                : sidebarWidth.toString() + "px",
              // marginLeft: "50px",
              marginRight: props.sidebar ? "5vw" : "200px",
              transition: "all, 0.2s",
              minWidth: "70vw",
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
