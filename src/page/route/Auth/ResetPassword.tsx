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

const ResetPasswordWithHash = () => {
  const dispatcher = useDispatch();
  const params = useParams<"hash">();
  const hash1 = params.hash;

  const [enable, setEnable] = useState(false);
  const [mail, setMail] = useState("");
  const [mailError, setMailError] = useState("");

  const handleResetPass = () => {
    console.debug(1);
  };

  useEffect(() => {
    request_json(API.EMAIL_MODIFY_PASSWORD_CALLBACK, {
      body: { stage: 1, hash1: hash1 },
    }).then((data: any) => {
      if (data.code === 0) {
        setEnable(true);
      } else {
        Redirect(dispatcher, "/error", 0);
      }
    });
    console.debug(hash1);
  }, []);

  if (!enable) {
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

          <Button
            size={"large"}
            type={"primary"}
            shape={"round"}
            disabled={mailError !== " "}
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

const ResetPassword = () => {
  const dispatcher = useDispatch();

  const [mail, setMail] = useState("");
  const [mailError, setMailError] = useState("");

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
    request_json(API.EMAIL_MODIFY_PASSWORD_REQUEST, {
      body: { email: mail },
    }).then((data: any) => {
      switch (data.code) {
        case 1:
          ToastMessage("error", "发送失败", "邮件服务暂时不可用");
          break;
        case 0:
          ToastMessage("success", "发送成功", "已发送验证邮件");
          break;
        // case 2:
        default:
          ToastMessage("error", "发送失败", "该邮箱不存在");
          break;
      }
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
            disabled={mailError !== " "}
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
