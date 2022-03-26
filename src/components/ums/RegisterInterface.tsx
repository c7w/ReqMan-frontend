import React, { useState } from "react";
import "./RegisterInterface.css";
import "crypto-js";
import { message, Input, Button, Popover, Tooltip } from "antd";
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
import request_json, { NaiveResponse } from "../../utils/Network";
import { NavLink } from "react-router-dom";
import CryptoJS from "crypto-js";
import { push } from "redux-first-history";
import { useDispatch } from "react-redux";
import API from "../../utils/APIList";

export interface RegisterInterfaceProps {
  // Async function, call at submission
  // If accepted, jump to "/"
  // If Rejected, show wrong message
  submit: (
    name: string,
    password: string,
    email: string,
    invitation: string
  ) => Promise<void>;
}

//中间表单
const RegisterInterface = (props: RegisterInterfaceProps) => {
  const [userError, setUserError] = useState("");
  const [userName, setUserName] = useState("");
  const [invitationError, setInvitationError] = useState("");
  const [invitation, setInvitation] = useState("");
  const [mailError, setMailError] = useState("");
  const [mail, setMail] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [password, setPassword] = useState("");
  const [doubleCheckError, setDoubleCheckError] = useState("");
  const [doubleCheck, setDoubleCheck] = useState(false);

  const dispatcher = useDispatch();

  // 用户名判断
  const userCheck = (event: { target: { value: string } }) => {
    const usr = event.target.value;
    const reg = /^([a-zA-Z0-9_]){3,16}$/;
    if (!reg.test(usr)) {
      setUserError("用户名应为 3-16 位数字/字母/下划线！");
    } else {
      setUserError("");
      request_json(API.CHECK_USERNAME_AVAILABLE, {
        body: { name: userName },
      })
        .then((data) => {
          if (data.code === 0) {
            setUserError(" ");
          } else {
            setUserError("该用户名已被注册");
          }
        })
        .catch(() => {
          setUserError("无法获取用户名可用状态");
        });

      setUserName(usr);
    }
  };

  // 邀请码检查
  const invitationCheck = (event: { target: { value: string } }) => {
    const invitation = event.target.value;
    if (invitation === "") {
      setInvitationError("");
      setInvitation("");
      return;
    }
    const reg = /^[a-zA-Z0-9]{16}$/;
    if (!reg.test(invitation)) {
      setInvitationError("邀请码格式有误");
    } else {
      setInvitationError(" ");
      setInvitation(invitation);
    }
  };

  // 邮箱检查
  const mailCheck = (event: { target: { value: string } }) => {
    const mail = event.target.value;
    setMail(mail);
    const reg = /^\w+([-+.]\w+)*@\w+([-.]\ w+)*\.\w+([-.]\ w+)*$/;
    if (!reg.test(mail)) {
      setMailError("邮箱格式有误！");
    } else {
      setMailError("");
      request_json(API.CHECK_EMAIL_AVAILABLE, {
        body: { email: mail },
      })
        .then((data) => {
          if (data.code === 0) {
            setMailError(" ");
          } else {
            setMailError("该邮箱已被注册");
          }
        })
        .catch(() => {
          setMailError("无法获取邮箱可用状态");
        });
    }
  };

  // 密码判断
  const passwordCheck = (event: { target: { value: string } }) => {
    const password = event.target.value;
    const reg1 = /^.{6,20}$/;
    const reg2 = /^[0-9]+$/;
    const reg3 = /^[a-z]+$/;
    const reg4 = /^[A-Z]+$/;
    const reg5 = /^[0-9a-z]+$/;
    const reg6 = /^[0-9A-Z]+$/;
    const reg7 = /^[a-zA-Z]+$/;
    if (!reg1.test(password)) {
      setPasswordError("密码为 6-20 位数字、字母或特殊字符");
    } else if (
      reg2.test(password) ||
      reg3.test(password) ||
      reg4.test(password) ||
      reg5.test(password) ||
      reg6.test(password) ||
      reg7.test(password)
    ) {
      setPasswordError("密码需包含数字、大小写字母或包含特殊字符");
    } else {
      setPasswordError(" ");
      setPassword(password);
    }
  };

  // 密码校验判断 (from doubleCheck to check)
  const check = (event: { target: { value: string } }) => {
    const _password = event.target.value;
    if (_password !== password) {
      setDoubleCheckError("与第一次密码输入不符，请检查");
    } else if (password !== "") {
      setDoubleCheckError(" ");
      setDoubleCheck(true);
    }
  };

  const handleCreate = () => {
    const pwd = CryptoJS.MD5(password).toString();
    const response = props.submit(userName, pwd, mail, invitation);
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

  return (
    <div className={"root-screen"}>
      <div className={"register-board-container"}>
        <div className={"register-board"} id={"register-board"}>
          <p className={"register-title"}>注册</p>
          <p className={"register-prompt"}>
            <span style={{ color: "red" }}>* </span>
            <span style={{ color: "black" }}>用户名：</span>
          </p>
          <Tooltip
            title={userError}
            visible={userError !== "" && userError !== " "}
            placement={"right"}
            overlayInnerStyle={{ width: "20rem", textAlign: "center" }}
          >
            <div className={getInputClassName(userError)}>
              <Input
                size={"large"}
                prefix={<UserOutlined />}
                type="text"
                placeholder=""
                autoComplete={"off"}
                onChange={userCheck}
                bordered={false}
              />
            </div>
          </Tooltip>
          <p className={"register-prompt"}>
            <span style={{ color: "red" }}>* </span>
            <span style={{ color: "black" }}>邮箱：</span>
          </p>
          <Tooltip
            title={mailError}
            visible={mailError !== "" && mailError !== " "}
            placement={"right"}
            className={"register-tooltip"}
            overlayInnerStyle={{ width: "20rem", textAlign: "center" }}
          >
            <div className={getInputClassName(mailError)}>
              <Input
                size={"large"}
                prefix={<MailOutlined />}
                type="text"
                placeholder=""
                onChange={mailCheck}
                bordered={false}
              />
            </div>
          </Tooltip>
          <p className={"register-prompt"}>
            <span style={{ color: "red" }}>* </span>
            <span style={{ color: "black" }}>密码：</span>
          </p>
          <Tooltip
            title={passwordError}
            visible={passwordError !== "" && passwordError !== " "}
            placement={"right"}
            className={"register-tooltip"}
            overlayInnerStyle={{ width: "20rem", textAlign: "center" }}
          >
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
          </Tooltip>

          <p className={"register-prompt"}>
            <span style={{ color: "red" }}>* </span>
            <span style={{ color: "black" }}>确认密码：</span>
          </p>
          <Tooltip
            title={doubleCheckError}
            visible={doubleCheckError !== "" && doubleCheckError !== " "}
            placement={"right"}
            className={"register-tooltip"}
            overlayInnerStyle={{ width: "20rem", textAlign: "center" }}
          >
            <div className={getInputClassName(doubleCheckError)}>
              <Input.Password
                size={"large"}
                prefix={<KeyOutlined />}
                type="text"
                placeholder=""
                onChange={check}
                bordered={false}
              />
            </div>
          </Tooltip>

          <p className={"register-prompt"}>
            <span style={{ color: "black" }}>&nbsp;&nbsp;项目邀请码：</span>
          </p>
          <Tooltip
            title={invitationError}
            visible={invitationError !== "" && invitationError !== " "}
            placement={"right"}
            className={"register-tooltip"}
            overlayInnerStyle={{ width: "20rem", textAlign: "center" }}
          >
            <div className={getInputClassName(invitationError)}>
              <Input
                size={"large"}
                prefix={<KeyOutlined />}
                type="text"
                placeholder=""
                onChange={invitationCheck}
                bordered={false}
              />
            </div>
          </Tooltip>

          <Button
            size={"large"}
            type={"primary"}
            shape={"round"}
            disabled={
              passwordError !== " " ||
              userError !== " " ||
              (invitationError !== "" && invitationError !== " ") ||
              mailError !== " " ||
              doubleCheckError !== " "
            }
            onClick={() => handleCreate()}
            className={"register-button"}
          >
            注册
          </Button>

          <div className={"register-forget"}>
            <div className={"register"}>
              <a onClick={() => dispatcher(push("/login"))}> 现在去登录 </a>
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

export default RegisterInterface;
