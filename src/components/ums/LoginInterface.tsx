import React from "react";
import "./Logininterface.css";
import "crypto-js";
import { message, Input, Button, Popover } from "antd";
import {
  UserOutlined,
  MailOutlined,
  KeyOutlined,
  GiftOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";

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
    if (password == "") {
      this.setState({
        passwordError: "密码字段不能为空",
      });
      return;
    }
    if (reg1.test(password) == false) {
      this.setState({
        passwordError: "密码字段出现非法字符，请检查",
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
        <div className={"blur"}>
          <div className={"logo"} />
          <ul className={"ul"}>
            <div className={"title"}>Login</div>
            <div className={"userInfo"}>
              <Input
                size={"large"}
                prefix={<UserOutlined />}
                type="text"
                className={"myInput"}
                placeholder="Username"
                onBlur={(event) => this.userCheck(event)}
              />
              <div
                hidden={this.state.usrError == "" || this.state.usrError == " "}
              >
                <Popover content={this.state.usrError} title="Error">
                  <FontAwesomeIcon
                    icon={faCircleXmark}
                    style={{ color: "darkred" }}
                    className={"userImg"}
                  />
                </Popover>
              </div>
              <div hidden={this.state.usrError != ""}>
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  style={{ color: "green" }}
                  className={"userImg"}
                />
              </div>
            </div>

            <div className={"userInfo"}>
              <Input.Password
                size={"large"}
                prefix={<KeyOutlined />}
                placeholder="Password"
                className={"myInput"}
                onBlur={(event) => this.passwordCheck(event)}
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
              <div
                hidden={
                  this.state.passwordError == "" ||
                  this.state.passwordError == " "
                }
              >
                <Popover content={this.state.passwordError} title="Error">
                  <FontAwesomeIcon
                    icon={faCircleXmark}
                    style={{ color: "darkred" }}
                    className={"userImg"}
                  />
                </Popover>
              </div>
              <div hidden={this.state.passwordError != ""}>
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  style={{ color: "green" }}
                  className={"userImg"}
                />
              </div>
            </div>

            <div className={"loginButton"}>
              <Button
                size={"large"}
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
            <div className={"register-forget"}>
              <div className={"register"}>
                <Button
                  size={"small"}
                  type={"link"}
                  color={"black"}
                  href={"www.baidu.com"}
                >
                  Create New Account
                </Button>
              </div>
              <div className={"forget"}>
                <Button
                  size={"small"}
                  type={"link"}
                  color={"black"}
                  href={"www.baidu.com"}
                >
                  Forget Password
                </Button>
              </div>
            </div>
          </ul>
          <div className={"footnote"}>
            ©2022 Undefined. All Rights Reserved.
          </div>
        </div>
      </div>
    );
  }
}

export default LoginInterface;
