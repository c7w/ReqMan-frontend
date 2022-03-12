export interface RegisterInterfaceProps {
  // Async function, call at submission
  // If accepted, jump to "/"
  // If Rejected, show wrong message
  submit: (
    name: string,
    password: string,
    email: string,
    invitation?: string
  ) => Promise<object>;
}

const RegisterInterface = (props: RegisterInterfaceProps) => {
  return <></>;
};
export default RegisterInterface;
