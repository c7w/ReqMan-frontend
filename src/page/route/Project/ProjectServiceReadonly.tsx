import Home from "../../../layout/Home";

const ProjectServiceReadonly = () => {
  // Judge if project list in user state
  // If not re-query the user state from the backend
  // Render the project list
  return (
    <Home sidebar={true}>
      <div></div>
    </Home>
  );
};

export default ProjectServiceReadonly;
