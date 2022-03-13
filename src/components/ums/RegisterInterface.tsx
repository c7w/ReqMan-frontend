export interface RegisterInterfaceProps {
  // Async function, call at submission
  // If accepted, jump to "/"
  // If Rejected, show wrong message
  submit: (
    name: string,
    password: string,
    email: string,
    invitation: string
  ) => Promise<any>;
}

const RegisterInterface = (props: RegisterInterfaceProps) => {
  // props.submit("1", "2", "3", "4").then(r => console.debug(r));
  return <>这是注册界面</>;
};
export default RegisterInterface;
