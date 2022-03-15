import { useState } from "react";
import React from "react";
import "./Logininterface.css";
import "crypto-js";
import { message, Input, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faKey, faUser } from "@fortawesome/free-solid-svg-icons";

export interface LoginInterfaceProps {
  // Async function, call at submission
  // If accepted, jump to "/"
  // If Rejected, show wrong message
  submit: (identity: string, password: string) => Promise<any>;
}

export interface LoginInterfaceState {
  readonly usrError: string;
  readonly passwordError: string;
  readonly userName: string;
  readonly password: string;
}

//中间表单
class LoginInterface extends React.Component<
  LoginInterfaceProps,
  LoginInterfaceState
> {
  constructor(props: LoginInterfaceProps | Readonly<LoginInterfaceProps>) {
    super(props);
    this.state = {
      usrError: " ",
      userName: "",
      passwordError: " ",
      password: "",
    };
  }
  //用户名判断
  userCheck(event: React.FocusEvent<HTMLInputElement, Element>) {
    const usr = event.target.value;
    const reg = /^([^u00-uff]|[a-zA-Z0-9_]){3,16}$/;
    if (reg.test(usr) == false) {
      this.setState({
        usrError: "用户名为3-16位数字字母下划线及中文组成!",
      });
    } else {
      this.setState({
        usrError: "",
        userName: usr,
      });
    }
  }
  //密码判断
  passwordCheck(event: React.FocusEvent<HTMLInputElement, Element>) {
    const password = event.target.value;
    const reg1 = /^\w{6,20}$/;
    const reg2 = /^[0-9]+$/;
    const reg3 = /^[a-z]+$/;
    const reg4 = /^[A-Z]+$/;
    const reg5 = /^[0-9a-z]+$/;
    const reg6 = /^[0-9A-Z]+$/;
    const reg7 = /^[a-zA-Z]+$/;
    if (reg1.test(password) == false) {
      this.setState({
        passwordError: "密码为6-20位数字或字母",
      });
    } else if (
      reg2.test(password) ||
      reg3.test(password) ||
      reg4.test(password) ||
      reg5.test(password) ||
      reg6.test(password) ||
      reg7.test(password)
    ) {
      this.setState({
        passwordError: "密码强度不够，请包含数字和大小写字母",
      });
    } else {
      this.setState({
        passwordError: "",
        password: password,
      });
    }
  }

  successCallback() {
    message.success("Login successfully");
  }
  failureCallback() {
    message.error("Username and password do not match, please check again");
  }

  handleLogin() {
    const CryptoJS = require("crypto-js");
    const password = CryptoJS.MD5(this.state.password).toString();
    const response = this.props.submit(this.state.userName, password);
    // 未来接口调用，一下仅用来调试，与后端接口对接后修改
    if (true) {
      message.success("Login successfully");
    } else {
      message.error("Username and password do not match, please check again");
    }
  }

  render() {
    return (
      <div className={"screen"}>
        <ul className={"ul"}>
          <div className={"title"}>Login</div>
          <div className={"userInfo"}>
            <FontAwesomeIcon
              icon={faUser}
              style={{ color: "black" }}
              className={"userImg"}
            />
            <Input
              type="text"
              className={"myInput"}
              placeholder="please enter username"
              onBlur={(event) => this.userCheck(event)}
            />
            <div hidden={this.state.usrError != ""}>
              <FontAwesomeIcon
                icon={faCheck}
                style={{ color: "green" }}
                className={"userImg"}
              />
            </div>
          </div>
          <div className={"myPrompt"}>{this.state.usrError}</div>
          <div className={"userInfo"}>
            <FontAwesomeIcon
              icon={faKey}
              style={{ color: "black" }}
              className={"userImg"}
            />
            <Input
              type="password"
              className={"myInput"}
              placeholder="please enter password"
              onBlur={(event) => this.passwordCheck(event)}
            />
            <div hidden={this.state.passwordError != ""}>
              <FontAwesomeIcon
                icon={faCheck}
                style={{ color: "green" }}
                className={"userImg"}
              />
            </div>
          </div>
          <div className={"myPrompt"}>{this.state.passwordError}</div>
          <div className={"loginButton"}>
            <Button
              size={"middle"}
              type={"primary"}
              shape={"round"}
              disabled={
                this.state.passwordError != "" || this.state.usrError != ""
              }
              onClick={() => this.handleLogin()}
            >
              Login
            </Button>
          </div>
          <div className={"register"}>
            <Button size={"small"} type={"link"}>
              Create New Account
            </Button>
          </div>
        </ul>
      </div>
    );
  }
}

export default LoginInterface;
