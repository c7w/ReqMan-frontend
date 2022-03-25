import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Layout, Breadcrumb } from "antd";
import "./Home.css";
import React, { ReactElement } from "react";
import Calendar from "../components/rms/Calendar";
import { useSelector } from "react-redux";
import { getUserStore } from "../store/slices/UserSlice";
import { store } from "../store/ConfigureStore";

const { Content, Footer } = Layout;

interface LayoutProps {
  sidebar: boolean;
  children: ReactElement;
}

const Home = (props: LayoutProps) => {
  const userInfo = useSelector(getUserStore);
  // console.debug(store.getState());
  return (
    <div>
      <Layout className="home">
        <Navbar />
        <Layout className="layout">
          {props.sidebar ? <Sidebar /> : <></>}
          <div className="layout-right">
            <Content className="content">{props.children}</Content>
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
