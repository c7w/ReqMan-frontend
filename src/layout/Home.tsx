import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Layout, Breadcrumb } from "antd";
import "./Home.css";
import React from "react";
import Calendar from "../components/rms/Calendar";

const { Content, Footer } = Layout;

const Home = () => {
  return (
    <div>
      <Layout className="home">
        <Navbar />
        <Layout className="layout">
          <Sidebar />
          <div className="layout-right">
            <Content className="content">
              <Breadcrumb style={{ margin: "16px 0" }}>
                <Breadcrumb.Item>undefined</Breadcrumb.Item>
                <Breadcrumb.Item>frontend</Breadcrumb.Item>
                <Breadcrumb.Item>Issues</Breadcrumb.Item>
                <Breadcrumb.Item>#16</Breadcrumb.Item>
              </Breadcrumb>
              <div style={{ padding: 24, minHeight: 200 }}>HI MAN!</div>
              <Calendar />
            </Content>
            <Footer className="footer">
              Developed and Maintained by undefined
            </Footer>
          </div>
        </Layout>
      </Layout>
    </div>
  );
};

export default Home;
