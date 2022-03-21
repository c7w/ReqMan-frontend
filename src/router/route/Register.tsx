import React from "react";
import LoginInterface from "../../components/ums/LoginInterface";
import request_json from "../../utils/Network";
import API from "../../utils/APIList";

class Register extends React.Component<never, never> {
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

export default Register;
