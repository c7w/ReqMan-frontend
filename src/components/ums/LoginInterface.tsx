import { useState } from "react";

export interface LoginInterfaceProps {
  // Async function, call at submission
  // If accepted, jump to "/"
  // If Rejected, show wrong message
  submit: (identity: string, password: string) => Promise<object>;
}

const LoginInterface = (props: LoginInterfaceProps) => {
  // Create your own states here...
  const [name, setName] = useState<string>("");

  return <></>;
};

export default LoginInterface;
