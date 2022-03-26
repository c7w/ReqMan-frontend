import { Provider, connect } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { HistoryRouter as Router } from "redux-first-history/rr6";
import { store, history } from "../store/ConfigureStore";
import Login from "./route/Auth/Login";
import Home from "../layout/Home";
import { IRList } from "../components/rms/IRList";
import { SRList } from "../components/rms/SRList";
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
import Loading from "../layout/components/Loading";
import PersonalSetting from "./route/Auth/Setting";
import ProjectServiceReadonly from "./route/Project/ProjectServiceReadonly";
import ProjectRequirementsReadonly from "./route/Project/ProjectRequirementsReadonly";
import ProjectMember from "./route/Project/ProjectMember";

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
          <Route path="settings" element={<PersonalSetting />} />
          <Route path="project/:id/IRManager" element={<ProjectIR />} />
          <Route path="project/:id/SRManager" element={<ProjectSR />} />

          <Route
            path="project/:id/ServiceManager"
            element={<ProjectService />}
          />
          <Route
            path="project/:id/services"
            element={<ProjectServiceReadonly />}
          />
          <Route
            path="project/:id/requirements"
            element={<ProjectRequirementsReadonly />}
          />
          <Route path="project/:id/member" element={<ProjectMember />} />
          <Route path="project/:id/analyse" element={<ProjectAnalyse />} />
          <Route path="project/:id/settings" element={<ProjectSetting />} />
          <Route path="project/:id" element={<Project />} />
          <Route path="projects" element={<ProjectList />} />

          {/* Dev Paths */}
          <Route
            path="IR_List"
            element={<IRList unimportant={"asduiosaudhsauiod"} />}
          />
          <Route
            path="SR_List"
            element={<SRList unimportant={"asduiosaudhsauiod"} />}
          />
          <Route
            path={"dev/loading"}
            element={
              <Home sidebar={true}>
                <Loading />
              </Home>
            }
          />
          <Route path={"*"} element={<Fallback />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default SiteRouter;
