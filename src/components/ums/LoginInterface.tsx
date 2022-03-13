import { useState } from "react";
import React from "react";
import "./Logininterface.css";

export interface LoginInterfaceProps {
  // Async function, call at submission
  // If accepted, jump to "/"
  // If Rejected, show wrong message
  submit: (identity: string, password: string) => Promise<any>;
}

export interface ContentProps {
  readonly myprop: null;
}

export interface ContentState {
  readonly telError: string;
  readonly passwordError: string;
}

//中间表单
class Content extends React.Component<ContentProps, ContentState> {
  constructor(props: ContentProps | Readonly<ContentProps>) {
    super(props);
    this.state = {
      telError: "",
      passwordError: "",
    };
  }
  //手机号判断
  telCheck(event: React.FocusEvent<HTMLInputElement, Element>) {
    const tel = event.target.value;
    console.log(tel);
    const reg = /^1[34578]\d{9}$/;
    if (reg.test(tel) == false) {
      this.setState({
        telError: "请输入正确的手机号",
      });
    } else {
      this.setState({
        telError: "",
      });
    }
  }
  //密码判断
  passwordCheck(event: React.FocusEvent<HTMLInputElement, Element>) {
    const password = event.target.value;
    const reg = /^\w{6,20}$/;
    if (reg.test(password) == false) {
      this.setState({
        passwordError: "密码为6-20位数字或字母或下划线!",
      });
    } else {
      this.setState({
        passwordError: "",
      });
    }
  }

  render() {
    return (
      <div>
        <ul className={"ul"}>
          <li className={"userTel"}>
            <img src="./images/password.png" alt="" className={"userImg"} />
            <span className={"userSpan"}></span>
            <input
              type="text"
              className={"telInput"}
              placeholder="请输入手机号"
              onBlur={(event) => this.telCheck(event)}
            />
          </li>
          <li className={"liAll"}>
            <span className={"telPrompt"}>{this.state.telError}</span>
          </li>
          <li className={"userTel"}>
            <img src="./images/password.png" alt="" className={"userImg"} />
            <span className={"userSpan"}></span>
            <input
              type="password"
              className={"telInput"}
              placeholder="请输入密码"
              onBlur={(event) => this.passwordCheck(event)}
            />
          </li>
          <li className={"liAll"}>
            <span className={"telPrompt"}>{this.state.passwordError}</span>
          </li>
          <li className={"liAll"}>
            <button className={"login"}>登录</button>
          </li>
        </ul>
      </div>
    );
  }
}
//底部
class Footer extends React.Component {
  render() {
    const register = {
      display: "block",
      fontSize: "13px",
      color: "#8b8b8b",
      width: "80px",
      height: "25px",
      margin: "0 auto",
      border: "1px solid #8b8b8b",
      textDecoration: "none",
      marginTop: "50px",
      textAlign: "center",
      lineHeight: "25px",
    };
    return <div>快速注册</div>;
  }
}

const LoginInterface = (props: LoginInterfaceProps) => {
  // Create your own states here...
  // props.submit("1", "2").then(r => console.debug(r));
  const [name, setName] = useState<string>("");

  return (
    <div>
      <Content myprop={null}></Content>
      <Footer></Footer>
    </div>
  );
};

export default LoginInterface;
