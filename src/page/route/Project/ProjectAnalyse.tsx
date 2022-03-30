import Home from "../../../layout/Home";
import Loading from "../../../layout/components/Loading";

const ProjectAnalyse = () => {
  // Judge if project list in user state
  // If not re-query the user state from the backend
  // Render the project list
  return (
    <Home sidebar={true}>
      <Loading />
    </Home>
  );
};

export default ProjectAnalyse;
