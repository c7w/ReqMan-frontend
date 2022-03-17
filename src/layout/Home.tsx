import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Layout, Breadcrumb } from "antd";
import "./Home.css";
import React from "react";

const { Content, Footer } = Layout;

class Home extends React.Component {
  render() {
    return (
      <div>
        <Layout className="home">
          <Sidebar />
          <Layout className="layout">
            <Navbar />
            <Content className="content">
              <Breadcrumb style={{ margin: "16px 0" }}>
                <Breadcrumb.Item>User</Breadcrumb.Item>
                <Breadcrumb.Item>hbx</Breadcrumb.Item>
              </Breadcrumb>
              <div style={{ padding: 24, minHeight: 360 }}>HI MAN!</div>
            </Content>
            <Footer className="home-background footer">FOOTER!</Footer>
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default Home;
