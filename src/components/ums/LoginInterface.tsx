import { useState } from "react";

export interface LoginInterfaceProps {
  // Async function, call at submission
  // If accepted, jump to "/"
  // If Rejected, show wrong message
  submit: (identity: string, password: string) => Promise<any>;
}

const LoginInterface = (props: LoginInterfaceProps) => {
  // Create your own states here...
  // props.submit("1", "2").then(r => console.debug(r));
  const [name, setName] = useState<string>("");

  return <>这是登录界面</>;
};

export default LoginInterface;
