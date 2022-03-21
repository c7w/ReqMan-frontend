import React from "react";
import LoginInterface from "../../components/ums/LoginInterface";
import request_json from "../../utils/Network";
import API from "../../utils/APIList";

class Login extends React.Component<
  Record<string, never>,
  Record<string, never>
> {
  async submit_login(identity: string, password: string) {
    const data = await request_json(API.LOGIN, {
      body: { identity, password },
    });
    console.debug(data);
  }

  render() {
    return <LoginInterface submit={this.submit_login} />;
  }
}

export default Login;
