import React from "react";
import LoginInterface from "../../components/ums/LoginInterface";
import request_json, { NaiveResponse } from "../../utils/Network";
import API from "../../utils/APIList";

const Register = () => {
  const submit_login = async (
    identity: string,
    password: string
  ): Promise<void> => {
    const data = await request_json(API.LOGIN, {
      body: { identity, password },
    });
    console.debug(data);
    return data;
  };
  return <LoginInterface submit={submit_login} />;
};

export default Register;
