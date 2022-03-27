import Home from "../../../layout/Home";
import "./Setting.css";
import { Avatar, Button, Input, Tooltip } from "antd";
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";
import { KeyOutlined } from "@ant-design/icons";
import React from "react";

const PersonalSetting = () => {
  return (
    <Home sidebar={false}>
      <div className={"personal-setting-container"}>
        <div
          style={{
            fontSize: "2rem",
            marginLeft: "1rem",
            userSelect: "none",
            alignSelf: "flex-start",
          }}
        >
          个人设置
        </div>
        <hr style={{ width: "98%", margin: "1rem auto" }} />
        <div className="setting-row">
          <div className="column-1">
            <Title level={3}>公开头像</Title>
            <Text>您可以在这里修改头像或删除当前头像</Text>
          </div>
          <div className="column-2">
            <div
              className="setting-card"
              style={{ display: "flex", flexDirection: "row" }}
            >
              <Avatar
                src={
                  "data:image/jpg;base64,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"
                }
                size={100}
              ></Avatar>
              <div
                style={{
                  marginLeft: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-around",
                }}
              >
                <Title level={5}>头像修改</Title>
                <div>
                  <Button type={"primary"}>修改头像</Button>
                  <Button danger={true}>删除头像</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="setting-row">
          <div className="column-1">
            <Title level={3}>邮箱设置</Title>
            <Text>您可以在这里修改当前账户邮箱设置</Text>
          </div>
          <div className="column-2">
            <div
              className="setting-card"
              style={{ display: "flex", flexDirection: "row" }}
            ></div>
          </div>
        </div>
        <div className="setting-row">
          <div className="column-1">
            <Title level={3}>密码设置</Title>
            <Text>您可以在这里修改当前账户密码</Text>
          </div>
          <div className="column-2">
            <div
              className="setting-card"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <p className={"register-prompt"}>
                <span style={{ color: "red" }}>* </span>
                <span style={{ color: "black" }}>当前密码：</span>
              </p>
              <Input.Password
                size={"large"}
                className={"setting-input"}
                prefix={<KeyOutlined />}
                type="text"
                placeholder=""
                bordered={false}
              />
            </div>
            <br />
            <div
              className="setting-card"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <p className={"register-prompt"}>
                <span style={{ color: "red" }}>* </span>
                <span style={{ color: "black" }}>新密码：</span>
              </p>
              <Input.Password
                size={"large"}
                className={"setting-input"}
                prefix={<KeyOutlined />}
                type="text"
                placeholder=""
                bordered={false}
              />
            </div>
            <br />
            <div
              className="setting-card"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <p className={"register-prompt"}>
                <span style={{ color: "red" }}>* </span>
                <span style={{ color: "black" }}>确认新密码：</span>
              </p>
              <Input.Password
                size={"large"}
                prefix={<KeyOutlined />}
                className={"setting-input"}
                type="text"
                placeholder=""
                bordered={false}
              />
            </div>
          </div>
        </div>
      </div>
    </Home>
  );
};

export default PersonalSetting;
