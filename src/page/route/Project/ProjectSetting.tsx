import Home from "../../../layout/Home";

const ProjectService = () => {
  // Judge if project list in user state
  // If not re-query the user state from the backend
  // Render the project list
  return (
    <Home sidebar={false}>
      <div></div>
    </Home>
  );
};

export default ProjectService;
