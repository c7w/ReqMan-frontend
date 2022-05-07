import { Provider, useDispatch } from "react-redux";
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
import {
  ResetPassword,
  ResetPasswordWithHash,
} from "./route/Auth/ResetPassword";
import { getCookie } from "../utils/CookieOperation";
import { Redirect, ToastMessage } from "../utils/Navigation";
import ProjectFile from "./route/Project/ProjectFile";

const SiteRouter = () => {
  // See if sessionId in place
  if (getCookie("sessionId", "") === "") {
    ToastMessage("error", "需要登录", "用户令牌失效或已过期");
    window.location.href = "/";
  }

  return (
    <Provider store={store}>
      <Router history={history}>
        <Routes>
          <Route path="/" element={<Root />}></Route>
          <Route path="dashboard" element={<ProjectList />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="resetpass/:hash" element={<ResetPasswordWithHash />} />
          <Route path="resetpass" element={<ResetPassword />} />
          <Route path="settings" element={<PersonalSetting />} />
          <Route path="project/:id/tree/*" element={<ProjectFile />} />
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
          <Route path="project/:id/settings" element={<ProjectSetting />} />
          <Route path="project/:id" element={<Project />} />
          <Route path="projects" element={<ProjectList />} />
          {/* Dev Paths */}
          <Route path="SR_List" element={<ProjectSR />} />
          <Route path="dev/test" element={<Test />} />
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
