import React, { useState } from "react";
import "./Logininterface.css";
import CryptoJS from "crypto-js";
import { Input, Button } from "antd";
import { UserOutlined, KeyOutlined } from "@ant-design/icons";

import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { NaiveResponse } from "../../utils/Network";
import { NavLink } from "react-router-dom";

export interface LoginInterfaceProps {
  // Async function, call at submission
  // If accepted, jump to "/"
  // If Rejected, show wrong message
  submit: (identity: string, password: string) => Promise<void>;
}

//中间表单
const LoginInterface = (props: LoginInterfaceProps) => {
  // States
  const [userError, setUserError] = useState("");
  const [userName, setUserName] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [password, setPassword] = useState("");

  // 用户名判断
  const userCheck = (event: { target: { value: string } }) => {
    const usr = event.target.value;
    const reg = /^([^u00-uff]|[a-zA-Z0-9_]){3,16}$/;
    if (!reg.test(usr)) {
      setUserError("用户名为3-16位数字字母下划线及中文组成!");
    } else {
      setUserError(" ");
      setUserName(usr);
    }
  };

  // 密码判断
  const passwordCheck = (event: { target: { value: string } }) => {
    const password = event.target.value;
    const reg1 = /^\w{6,20}$/;
    if (password === "") {
      setPasswordError("密码字段不能为空");
      return;
    }
    if (!reg1.test(password)) {
      setPasswordError("密码字段出现非法字符，请检查");
    } else {
      setPasswordError(" ");
      setPassword(password);
    }
  };

  const getInputClassName = (msg: string) => {
    if (msg === "") {
      return "my-input input-unknown";
    }
    if (msg === " ") {
      return "my-input input-correct";
    }
    return "my-input input-wrong";
  };

  // Login
  const handleLogin = () => {
    const pwd = CryptoJS.MD5(password).toString();
    const response = props.submit(userName, pwd);
  };

  return (
    <div className={"root-screen"}>
      <div className={"login-logo"} />
      <div className={"login-board"}>
        <p className={"login-title"}>登录</p>
        <p className={"login-prompt"}>
          <span style={{ color: "red" }}>* </span>
          <span style={{ color: "black" }}>用户名/邮箱：</span>
        </p>
        <div className={getInputClassName(userError)}>
          <Input
            size={"large"}
            prefix={<UserOutlined />}
            type="text"
            placeholder=""
            onChange={userCheck}
            bordered={false}
          />
        </div>

        <p className={"login-prompt"}>
          <span style={{ color: "red" }}>* </span>
          <span style={{ color: "black" }}>密码：</span>
        </p>
        <div className={getInputClassName(passwordError)}>
          <Input.Password
            size={"large"}
            prefix={<KeyOutlined />}
            type="text"
            placeholder=""
            onChange={passwordCheck}
            bordered={false}
          />
        </div>

        <Button
          size={"large"}
          type={"primary"}
          shape={"round"}
          disabled={passwordError !== " " || userError !== " "}
          onClick={() => handleLogin()}
          className={"login-button"}
        >
          登录
        </Button>

        <div className={"register-forget"}>
          <div className={"register"}>
            <NavLink to={"/register"}> 创建新账户 </NavLink>
          </div>
          <div className={"forget"}>
            <NavLink to={"/forget"}> 忘记密码 </NavLink>
          </div>
        </div>
      </div>
      <div className={"root-footer"}>
        © 2022 undefined. All rights reserved.
      </div>
    </div>
  );
};

export default LoginInterface;
