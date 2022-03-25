import { Provider, connect } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { HistoryRouter as Router } from "redux-first-history/rr6";
import { store, history } from "../store/ConfigureStore";
import Login from "./route/Auth/Login";
import Home from "../layout/Home";
import { IRList } from "../components/IRList";
import { SRList } from "../components/SRList";
import Root from "./route/Root/Root";
import "izitoast-react/dist/iziToast.css";
import Register from "./route/Auth/Register";
import Dashboard from "./route/Dashboard";
import Fallback from "./route/Fallback";
import ProjectList from "./route/Project/ProjectList";
import Project from "./route/Project/Project";
import ProjectService from "./route/Project/ProjectService";
import ProjectSR from "./route/Project/ProjectSR";
import ProjectIR from "./route/Project/ProjectIR";
import About from "./route/About";
import ProjectAnalyse from "./route/Project/ProjectAnalyse";
import ProjectSetting from "./route/Project/ProjectSetting";

const SiteRouter = () => {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Routes>
          <Route path="/" element={<Root />}></Route>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="projects" element={<ProjectList />} />
          <Route path="project/:id" element={<Project />} />
          <Route path="project/:id/IR" element={<ProjectIR />} />
          <Route path="project/:id/SR" element={<ProjectSR />} />
          <Route path="project/:id/service" element={<ProjectService />} />
          <Route path="project/:id/analyse" element={<ProjectAnalyse />} />
          <Route path="project/:id/setting" element={<ProjectSetting />} />
          <Route
            path="IR_List"
            element={<IRList unimportant={"asduiosaudhsauiod"} />}
          />
          <Route
            path="SR_List"
            element={<SRList unimportant={"asduiosaudhsauiod"} />}
          />
          <Route path={"*"} element={<Fallback />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default SiteRouter;
