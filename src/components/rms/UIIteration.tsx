import { useDispatch, useSelector } from "react-redux";
import { getUserStore } from "../../store/slices/UserSlice";
import { getProjectStore } from "../../store/slices/ProjectSlice";
import { getIterationStore } from "../../store/slices/IterationSlice";
import { useParams } from "react-router-dom";
import "./UIIteration.css";

const UIIteration = () => {
  // Select stores
  const userStore = useSelector(getUserStore);
  const projectStore = useSelector(getProjectStore);
  const iterationStore = useSelector(getIterationStore);

  // Dispatcher && get project ID
  const dispatcher = useDispatch();
  const params = useParams<"id">();
  const project_id = Number(params.id);

  return <div className={"project-iteration-container"}></div>;
};

export default UIIteration;
