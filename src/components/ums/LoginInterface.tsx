import React, { useState } from "react";
import "./Logininterface.css";
import logo from "../../assets/Reqman-2.svg";
import CryptoJS from "crypto-js";
import { Input, Button } from "antd";
import { UserOutlined, KeyOutlined } from "@ant-design/icons";

import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { NaiveResponse } from "../../utils/Network";
import { NavLink } from "react-router-dom";
import { push } from "redux-first-history";
import { useDispatch } from "react-redux";

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

  const dispatcher = useDispatch();

  // 用户名判断
  const userCheck = (event: { target: { value: string } }) => {
    const usr = event.target.value;
    const reg1 = /^([a-zA-Z0-9_]){3,16}$/;
    const reg2 = /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/;
    if (!reg1.test(usr) && !reg2.test(usr)) {
      setUserError("用户名为3-16位数字字母下划线及中文组成!");
    } else {
      setUserError(" ");
      setUserName(usr);
    }
  };

  // 密码判断
  const passwordCheck = (event: { target: { value: string } }) => {
    const password = event.target.value;
    const reg1 = /^.{6,20}$/;
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
      <div className={"login-logo-container"}>
        <img src={logo} />
      </div>
      <div className={"login-board-container"}>
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
              autoComplete={"c7w"}
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
              autoComplete={"c7w"}
              placeholder=""
              onChange={passwordCheck}
              bordered={false}
              onKeyPress={(event) => {
                if (event.charCode == 13) {
                  if (!(passwordError !== " " || userError !== " ")) {
                    handleLogin();
                  }
                }
              }}
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
              <a onClick={() => dispatcher(push("/register"))}> 创建新账户 </a>
            </div>
            <div className={"forget"}>
              <a onClick={() => dispatcher(push("/resetpass"))}> 忘记密码 </a>
            </div>
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
