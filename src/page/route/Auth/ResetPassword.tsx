import { Button, Input, Tooltip } from "antd";
import { KeyOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { push } from "redux-first-history";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import request_json from "../../../utils/Network";
import API from "../../../utils/APIList";
import { Redirect, ToastMessage } from "../../../utils/Navigation";
import { useParams } from "react-router-dom";
import Loading from "../../../layout/components/Loading";
import CryptoJS from "crypto-js";

const ResetPasswordWithHash = () => {
  const dispatcher = useDispatch();
  const params = useParams<"hash">();
  const hash1 = params.hash;

  const [hash2, setHash2] = useState("");
  const [isClicked, setIsClicked] = useState(false);

  const [passwordError, setPasswordError] = useState("");
  const [password, setPassword] = useState("");
  const [doubleCheckError, setDoubleCheckError] = useState("");
  const [doubleCheck, setDoubleCheck] = useState(false);

  const handleResetPass = () => {
    setIsClicked(true);
    request_json(API.EMAIL_MODIFY_PASSWORD_CALLBACK, {
      body: {
        stage: 2,
        hash1: hash1,
        hash2: hash2,
        password: CryptoJS.MD5(password).toString(),
      },
    }).then((res: any) => {
      if (res.code === 0) {
        ToastMessage("success", "修改成功", "密码重置成功，即将跳转至登录页面");
        Redirect(dispatcher, "/login");
      }
    });
  };

  // 密码判断
  const passwordCheck = (event: { target: { value: string } }) => {
    setPassword(event.target.value);
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

  useEffect(() => {
    request_json(API.EMAIL_MODIFY_PASSWORD_CALLBACK, {
      body: { stage: 1, hash1: hash1 },
    }).then((data: any) => {
      if (data.code === 0) {
        setHash2(data.data.hash2);
      } else {
        Redirect(dispatcher, "/error", 0);
      }
    });
  }, []);

  const getInputClassName = (msg: string) => {
    if (msg === "") {
      return "my-input input-unknown";
    }
    if (msg === " ") {
      return "my-input input-correct";
    }
    return "my-input input-wrong";
  };

  if (hash2 === "") {
    return (
      <div className={"root-screen"}>
        <Loading />
      </div>
    );
  }
  return (
    <div className={"root-screen"}>
      <div className={"register-board-container"}>
        <div className={"register-board"} id={"register-board"}>
          <p className={"register-title"}>重置密码</p>
          <br />

          <p className={"register-prompt"}>
            <span style={{ color: "red" }}>* </span>
            <span style={{ color: "black" }}>新密码：</span>
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
                autoComplete={"c7w"}
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
                autoComplete={"c7w"}
                placeholder=""
                onChange={check}
                bordered={false}
              />
            </div>
          </Tooltip>

          <Button
            size={"large"}
            type={"primary"}
            shape={"round"}
            disabled={
              passwordError !== " " || doubleCheckError !== " " || isClicked
            }
            onClick={handleResetPass}
            className={"register-button"}
          >
            重设密码
          </Button>

          <div className={"register-forget"}>
            <div className={"register"}>
              <a onClick={() => dispatcher(push("/login"))}> 现在去登录 </a>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <a onClick={() => dispatcher(push("/login"))}> 注册新用户 </a>
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

const ResetPassword = () => {
  const dispatcher = useDispatch();

  const [mail, setMail] = useState("");
  const [mailError, setMailError] = useState("");

  const [isClicked, setIsClicked] = useState(false);

  const getInputClassName = (msg: string) => {
    if (msg === "") {
      return "my-input input-unknown";
    }
    if (msg === " ") {
      return "my-input input-correct";
    }
    return "my-input input-wrong";
  };

  const handleResetPass = () => {
    setIsClicked(true);
    request_json(API.EMAIL_MODIFY_PASSWORD_REQUEST, {
      body: { email: mail },
    })
      .then((data: any) => {
        switch (data.code) {
          case 1:
            ToastMessage("error", "发送失败", "短时间内发送邮件次数过于频繁");
            break;
          case 0:
            ToastMessage("success", "发送成功", "已发送验证邮件");
            break;
          // case 2:
          default:
            ToastMessage("error", "发送失败", "该邮箱不存在");
            setIsClicked(false);
            break;
        }
      })
      .catch(() => {
        ToastMessage("error", "发送失败", "短时间内发送邮件次数过于频繁");
      });
  };

  // 邮箱检查
  const mailCheck = (event: { target: { value: string } }) => {
    const mail = event.target.value;
    setMail(mail);
    const reg = /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/;
    if (!reg.test(mail)) {
      setMailError("邮箱格式有误！");
    } else {
      setMailError(" ");
    }
  };

  return (
    <div className={"root-screen"}>
      <div className={"register-board-container"}>
        <div className={"register-board"} id={"register-board"}>
          <p className={"register-title"}>重置密码</p>
          <br />
          <p className={"register-prompt"}>
            <span style={{ color: "red" }}>* </span>
            <span style={{ color: "black" }}>账户主邮箱：</span>
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
                autoComplete={"c7w"}
                onChange={mailCheck}
                bordered={false}
              />
            </div>
          </Tooltip>

          <Button
            size={"large"}
            type={"primary"}
            shape={"round"}
            disabled={mailError !== " " || isClicked}
            onClick={handleResetPass}
            className={"register-button"}
          >
            找回密码
          </Button>

          <div className={"register-forget"}>
            <div className={"register"}>
              <a onClick={() => dispatcher(push("/login"))}> 现在去登录 </a>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <a onClick={() => dispatcher(push("/login"))}> 注册新用户 </a>
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

export { ResetPassword, ResetPasswordWithHash };
