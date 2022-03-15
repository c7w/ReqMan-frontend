import React from "react";
import "./RegisterInterface.css";
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

export interface RegisterInterfaceProps {
  // Async function, call at submission
  // If accepted, jump to "/"
  // If Rejected, show wrong message
  submit: (
    name: string,
    password: string,
    email: string,
    invitation: string
  ) => Promise<any>;
}

export interface RegisterInterfaceStates {
  readonly usrError: string;
  readonly userName: string;
  readonly invitationError: string;
  readonly invitation: string;
  readonly mailError: string;
  readonly mail: string;
  readonly passwordError: string;
  readonly password: string;
  readonly doubleCheckError: string;
  readonly doubleCheck: boolean;
}

//中间表单
class RegisterInterface extends React.Component<
  RegisterInterfaceProps,
  RegisterInterfaceStates
> {
  constructor(
    props: RegisterInterfaceProps | Readonly<RegisterInterfaceProps>
  ) {
    super(props);
    this.state = {
      usrError: " ",
      userName: "",
      invitationError: " ",
      invitation: "",
      mailError: " ",
      mail: "",
      passwordError: " ",
      password: "",
      doubleCheckError: " ",
      doubleCheck: false,
    };
  }
  //用户名判断
  userCheck(event: React.FocusEvent<HTMLInputElement, Element>) {
    const usr = event.target.value;
    console.log(usr);
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
  //邀请码检查
  invitationCheck(event: React.FocusEvent<HTMLInputElement, Element>) {
    const invitation = event.target.value;
    if (invitation == "") {
      this.setState({
        invitationError: " ",
        invitation: "",
      });
      return;
    }
    const reg = /^[a-zA-Z0-9]+$/;
    if (reg.test(invitation) == false) {
      this.setState({
        invitationError: "邀请码格式有误",
      });
    } else {
      this.setState({
        invitationError: "",
        invitation: invitation,
      });
    }
  }
  //邮箱检查
  mailCheck(event: React.FocusEvent<HTMLInputElement, Element>) {
    const mail = event.target.value;
    const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    if (reg.test(mail) == false) {
      this.setState({
        mailError: "邮箱格式有误",
      });
    } else if (false) {
      // 检查邮箱是否已被注册
      this.setState({
        mailError: "该邮箱已被注册",
      });
    } else {
      this.setState({
        mailError: "",
        mail: mail,
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
  //密码校验判断
  doubleCheck(event: React.FocusEvent<HTMLInputElement, Element>) {
    const password = event.target.value;
    console.log(this.state.password);
    console.log(password);
    if (password != this.state.password) {
      this.setState({
        doubleCheckError: "与第一次密码输入不符，请检查",
      });
    } else if (password != "") {
      this.setState({
        doubleCheckError: "",
        doubleCheck: true,
      });
    }
  }

  successCallback() {
    message.success("Create new account successfully");
  }
  failureCallback() {
    message.error("Fail to create new account");
  }

  handleCreate() {
    const CryptoJS = require("crypto-js");
    const password = CryptoJS.MD5(this.state.password).toString();
    console.log(password);
    const response = this.props.submit(
      this.state.userName,
      password,
      this.state.mail,
      this.state.invitation
    );
    // 未来接口调用，以下仅用来调试，与后端接口对接后修改
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
          <ul className={"ul"}>
            <div className={"title"}>Resgister</div>
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
              <Input
                size={"large"}
                prefix={<MailOutlined />}
                type="text"
                className={"myInput"}
                placeholder="E-mail"
                onBlur={(event) => this.mailCheck(event)}
              />
              <div
                hidden={
                  this.state.mailError == "" || this.state.mailError == " "
                }
              >
                <Popover content={this.state.mailError} title="Error">
                  <FontAwesomeIcon
                    icon={faCircleXmark}
                    style={{ color: "darkred" }}
                    className={"userImg"}
                  />
                </Popover>
              </div>
              <div hidden={this.state.mailError != ""}>
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

            <div className={"userInfo"}>
              <Input.Password
                size={"large"}
                prefix={<KeyOutlined />}
                placeholder="Confirm Password"
                className={"myInput"}
                onBlur={(event) => this.doubleCheck(event)}
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
              <div
                hidden={
                  this.state.doubleCheckError == "" ||
                  this.state.doubleCheckError == " "
                }
              >
                <Popover content={this.state.doubleCheckError} title="Error">
                  <FontAwesomeIcon
                    icon={faCircleXmark}
                    style={{ color: "darkred" }}
                    className={"userImg"}
                  />
                </Popover>
              </div>
              <div hidden={this.state.doubleCheckError != ""}>
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  style={{ color: "green" }}
                  className={"userImg"}
                />
              </div>
            </div>

            <div className={"userInfo"}>
              <Input
                size={"large"}
                prefix={<GiftOutlined />}
                type="text"
                className={"myInput"}
                placeholder="(Optional) Invitation Code"
                onBlur={(event) => this.invitationCheck(event)}
              />
              <div
                hidden={
                  this.state.invitationError == "" ||
                  this.state.invitationError == " "
                }
              >
                <Popover content={this.state.invitationError} title="Error">
                  <FontAwesomeIcon
                    icon={faCircleXmark}
                    style={{ color: "darkred" }}
                    className={"userImg"}
                  />
                </Popover>
              </div>
              <div hidden={this.state.invitationError != ""}>
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
                  this.state.passwordError != "" ||
                  this.state.usrError != "" ||
                  (this.state.invitationError != "" &&
                    this.state.invitationError != " ") ||
                  this.state.mailError != "" ||
                  !this.state.doubleCheck
                }
                onClick={() => this.handleCreate()}
              >
                Create!
              </Button>
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

export default RegisterInterface;
