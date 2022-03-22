import React, { useState } from "react";
import "./Logininterface.css";
import CryptoJS from "crypto-js";
import { message, Input, Button, Popover } from "antd";
import {
  UserOutlined,
  KeyOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { NaiveResponse } from "../../utils/Network";
import { NavLink } from "react-router-dom";

export interface LoginInterfaceProps {
  // Async function, call at submission
  // If accepted, jump to "/"
  // If Rejected, show wrong message
  submit: (identity: string, password: string) => Promise<NaiveResponse>;
}

//中间表单
const LoginInterface = (props: LoginInterfaceProps) => {
  const [userError, setUserError] = useState(" ");
  const [userName, setUserName] = useState("");
  const [passwordError, setPasswordError] = useState(" ");
  const [password, setPassword] = useState("");
  //用户名判断
  const userCheck = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    const usr = event.target.value;
    const reg = /^([^u00-uff]|[a-zA-Z0-9_]){3,16}$/;
    if (!reg.test(usr)) {
      setUserError("用户名为3-16位数字字母下划线及中文组成!");
    } else {
      setUserError("");
      setUserName(usr);
    }
  };
  //密码判断
  const passwordCheck = (
    event: React.FocusEvent<HTMLInputElement, Element>
  ) => {
    const password = event.target.value;
    const reg1 = /^\w{6,20}$/;
    if (password === "") {
      setPasswordError("密码字段不能为空");
      return;
    }
    if (!reg1.test(password)) {
      setPasswordError("密码字段出现非法字符，请检查");
    } else {
      setPasswordError("");
      setPassword(password);
    }
  };

  const handleLogin = () => {
    const pwd = CryptoJS.MD5(password).toString();
    const response = props.submit(userName, pwd);
  };

  return (
    <div className={"screen"}>
      <div className={"blur"}>
        <div className={"login-logo"} />
        <ul className={"ul"}>
          <div className={"title"}>登录</div>
          <div className={"userInfo"}>
            <Input
              size={"large"}
              prefix={<UserOutlined />}
              type="text"
              className={"myInput"}
              placeholder="用户名/邮箱"
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
                  icon={faCircleXmark as IconProp}
                  style={{ color: "darkred" }}
                  className={"userImg"}
                />
              </Popover>
            </div>
            <div hidden={passwordError !== ""}>
              <FontAwesomeIcon
                icon={faCircleCheck as IconProp}
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
              disabled={passwordError !== "" || userError !== ""}
              onClick={() => handleLogin()}
            >
              登录
            </Button>
          </div>
          <div className={"register-forget"}>
            <div className={"register"}>
              <NavLink to={"/register"}> 创建新账户 </NavLink>
            </div>
            <div className={"forget"}>
              <Button
                size={"small"}
                type={"link"}
                color={"black"}
                href={"www.baidu.com"}
              >
                忘记密码
              </Button>
            </div>
          </div>
        </ul>
        <div className={"root-footer"}>
          © 2022 undefined. All rights reversed.
        </div>
      </div>
    </div>
  );
};

export default LoginInterface;
