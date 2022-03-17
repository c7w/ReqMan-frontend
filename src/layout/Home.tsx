import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Layout, Breadcrumb, Typography } from "antd";
import "./Home.css";
import React from "react";

const { Content, Footer } = Layout;
const { Text } = Typography;

class Home extends React.Component {
  render() {
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
                <div style={{ padding: 24, minHeight: 360 }}>HI MAN!</div>
              </Content>
              <Footer className="footer">
                Developed and Maintained by undefined
              </Footer>
            </div>
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default Home;
