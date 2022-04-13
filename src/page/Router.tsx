import { Provider } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { HistoryRouter as Router } from "redux-first-history/rr6";
import { store, history } from "../store/ConfigureStore";
import Login from "./route/Auth/Login";
import Home from "../layout/Home";
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
import ProjectAnalyse from "./route/Project/ProjectAnalyse";
import ProjectSetting from "./route/Project/ProjectSetting";
import Loading from "../layout/components/Loading";
import PersonalSetting from "./route/Auth/Setting";
import ProjectServiceReadonly from "./route/Project/ProjectServiceReadonly";
import ProjectRequirementsReadonly from "./route/Project/ProjectRequirementsReadonly";
import ProjectMember from "./route/Project/ProjectMember";
import Test from "../components/test"; // 测试接口
import ProjectIteration from "./route/Project/ProjectIteration";
import ProjectRDTS from "./route/Project/ProjectRDTS";
import UIMerge from "../components/rdts/UIMerge";
import UICommit from "../components/rdts/UICommit";
import UIIssue from "../components/rdts/UIIssue";
import UIAnalysis from "../components/rdts/UIAnalysis";
import IRCard from "../components/rms/IRCard";

const SiteRouter = () => {
  const testIR =
    "[{id: 1, project: 2, title: 'I am the first IR', description: 'hahahahahahah', rank: 1, createdBy: 'c7w', createdAt: 10000000000, disabled: false}]";

  return (
    <Provider store={store}>
      <Router history={history}>
        <Routes>
          <Route path="/" element={<Root />}></Route>
          <Route path="dashboard" element={<Dashboard />} />
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
          <Route
            path="project/:id/merges"
            element={
              <ProjectRDTS>
                <UIMerge />
              </ProjectRDTS>
            }
          />
          <Route
            path="project/:id/issues"
            element={
              <ProjectRDTS>
                <UIIssue />
              </ProjectRDTS>
            }
          />
          <Route
            path="project/:id/commits"
            element={
              <ProjectRDTS>
                <UICommit />
              </ProjectRDTS>
            }
          />{" "}
          <Route
            path="project/:id/analysis"
            element={
              <ProjectRDTS>
                <UIAnalysis />
              </ProjectRDTS>
            }
          />
          <Route path="project/:id/iteration" element={<ProjectIteration />} />
          <Route path="project/:id/analyse" element={<ProjectAnalyse />} />
          <Route path="project/:id/settings" element={<ProjectSetting />} />
          <Route path="project/:id" element={<Project />} />
          <Route path="projects" element={<ProjectList />} />
          {/* Dev Paths */}
          <Route path="SR_List" element={<ProjectSR />} />
          <Route path="test" element={<Test />} />
          <Route
            path={"dev/loading"}
            element={
              <Home sidebar={true}>
                <Loading />
              </Home>
            }
          />
          <Route
            path={"IRCard"}
            element={
              <IRCard
                id={1}
                project={2}
                rank={1}
                createdAt={166666666.0}
                progress={0.5}
                title={"ir"}
                description={"irrrrrr"}
                iter={[]}
              />
            }
          />
          <Route path={"*"} element={<Fallback />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default SiteRouter;
