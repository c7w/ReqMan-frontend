import React, { useState } from "react";
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
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { NaiveResponse } from "../../utils/Network";

export interface RegisterInterfaceProps {
  // Async function, call at submission
  // If accepted, jump to "/"
  // If Rejected, show wrong message
  submit: (
    name: string,
    password: string,
    email: string,
    invitation: string
  ) => Promise<NaiveResponse>;
}

//中间表单
const RegisterInterface = (props: RegisterInterfaceProps) => {
  const [userError, setUserError] = useState(" ");
  const [userName, setUserName] = useState("");
  const [invitationError, setInvitationError] = useState(" ");
  const [invitation, setInvitation] = useState("");
  const [mailError, setMailError] = useState(" ");
  const [mail, setMail] = useState("");
  const [passwordError, setPasswordError] = useState(" ");
  const [password, setPassword] = useState("");
  const [doubleCheckError, setDoubleCheckError] = useState(" ");
  const [doubleCheck, setDoubleCheck] = useState(false);
  //用户名判断
  const userCheck = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    const usr = event.target.value;
    console.log(usr);
    const reg = /^([^u00-uff]|[a-zA-Z0-9_]){3,16}$/;
    if (!reg.test(usr)) {
      setUserError("用户名为3-16位数字字母下划线及中文组成!");
    } else {
      setUserError("");
      setUserName(usr);
    }
  };
  //邀请码检查
  const invitationCheck = (
    event: React.FocusEvent<HTMLInputElement, Element>
  ) => {
    const invitation = event.target.value;
    if (invitation === "") {
      setInvitationError(" ");
      setInvitation("");
      return;
    }
    const reg = /^[a-zA-Z0-9]+$/;
    if (!reg.test(invitation)) {
      setInvitationError("邀请码格式有误");
    } else {
      setInvitationError("");
      setInvitation(invitation);
    }
  };
  //邮箱检查
  const mailCheck = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    const mail = event.target.value;
    const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    if (!reg.test(mail)) {
      setMailError("邮箱格式有误");
    } /*else if (false) {
      // 检查邮箱是否已被注册
      setMailError("该邮箱已被注册");
    } */ else {
      setMailError("");
      setMail(mail);
    }
  };
  //密码判断
  const passwordCheck = (
    event: React.FocusEvent<HTMLInputElement, Element>
  ) => {
    const password = event.target.value;
    const reg1 = /^\w{6,20}$/;
    const reg2 = /^[0-9]+$/;
    const reg3 = /^[a-z]+$/;
    const reg4 = /^[A-Z]+$/;
    const reg5 = /^[0-9a-z]+$/;
    const reg6 = /^[0-9A-Z]+$/;
    const reg7 = /^[a-zA-Z]+$/;
    if (!reg1.test(password)) {
      setPasswordError("密码为6-20位数字或字母");
    } else if (
      reg2.test(password) ||
      reg3.test(password) ||
      reg4.test(password) ||
      reg5.test(password) ||
      reg6.test(password) ||
      reg7.test(password)
    ) {
      setPasswordError("密码强度不够，请包含数字和大小写字母");
    } else {
      setPasswordError("");
      setPassword(password);
    }
  };
  //密码校验判断 (from doubleCheck to check)
  const check = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    const _password = event.target.value;
    console.log(_password);
    console.log(password);
    if (_password !== password) {
      setDoubleCheckError("与第一次密码输入不符，请检查");
    } else if (password !== "") {
      setDoubleCheckError("");
      setDoubleCheck(true);
    }
  };

  const handleCreate = () => {
    const CryptoJS = require("crypto-js");
    const _password = CryptoJS.MD5(password).toString();
    console.log(_password);
    // const response = props.submit(userName, _password, mail, invitation);
    // 未来接口调用，以下仅用来调试，与后端接口对接后修改
    message.success("Login successfully");
  };
  return (
    <div className={"screen"}>
      <div className={"blur"}>
        <ul className={"ul"}>
          <div className={"title"}>注册</div>
          <div className={"userInfo"}>
            <Input
              size={"large"}
              prefix={<UserOutlined />}
              type="text"
              className={"myInput"}
              placeholder="用户名"
              onBlur={(event) => userCheck(event)}
            />
            <div hidden={userError === "" || userError === " "}>
              <Popover content={userError} title="Error">
                <FontAwesomeIcon
                  icon={faCircleXmark as IconProp}
                  style={{ color: "darkred" }}
                  className={"userImg"}
                />
              </Popover>
            </div>
            <div hidden={userError !== ""}>
              <FontAwesomeIcon
                icon={faCircleCheck as IconProp}
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
              placeholder="邮箱地址"
              onBlur={(event) => mailCheck(event)}
            />
            <div hidden={mailError === "" || mailError === " "}>
              <Popover content={mailError} title="Error">
                <FontAwesomeIcon
                  icon={faCircleXmark as IconProp}
                  style={{ color: "darkred" }}
                  className={"userImg"}
                />
              </Popover>
            </div>
            <div hidden={mailError !== ""}>
              <FontAwesomeIcon
                icon={faCircleCheck as IconProp}
                style={{ color: "green" }}
                className={"userImg"}
              />
            </div>
          </div>

          <div className={"userInfo"}>
            <Input.Password
              size={"large"}
              prefix={<KeyOutlined />}
              placeholder="密码"
              className={"myInput"}
              onBlur={(event) => passwordCheck(event)}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
            <div hidden={passwordError === "" || passwordError === " "}>
              <Popover content={passwordError} title="Error">
                <FontAwesomeIcon
                  icon={faCircleXmark}
                  style={{ color: "darkred" }}
                  className={"userImg"}
                />
              </Popover>
            </div>
            <div hidden={passwordError !== ""}>
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
              placeholder="确认密码"
              className={"myInput"}
              onBlur={(event) => check(event)}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
            <div hidden={doubleCheckError === "" || doubleCheckError === " "}>
              <Popover content={doubleCheckError} title="Error">
                <FontAwesomeIcon
                  icon={faCircleXmark}
                  style={{ color: "darkred" }}
                  className={"userImg"}
                />
              </Popover>
            </div>
            <div hidden={doubleCheckError !== ""}>
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
              placeholder="项目邀请码（可选）"
              onBlur={(event) => invitationCheck(event)}
            />
            <div hidden={invitationError === "" || invitationError === " "}>
              <Popover content={invitationError} title="Error">
                <FontAwesomeIcon
                  icon={faCircleXmark}
                  style={{ color: "darkred" }}
                  className={"userImg"}
                />
              </Popover>
            </div>
            <div hidden={invitationError !== ""}>
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
                passwordError !== "" ||
                userError !== "" ||
                (invitationError !== "" && invitationError !== " ") ||
                mailError !== "" ||
                !doubleCheck
              }
              onClick={() => handleCreate()}
            >
              创建用户
            </Button>
          </div>
        </ul>
        <div className={"footnote"}>© 2022 Undefined. All Rights Reserved.</div>
      </div>
    </div>
  );
};

export default RegisterInterface;
