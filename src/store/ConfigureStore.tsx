import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { createReduxHistoryContext } from "redux-first-history";
import { createBrowserHistory } from "history";
import sidebarReducer from "./slices/SidebarSlice";
import UserSliceReducer from "./slices/UserSlice";
import IRSRReducer from "./slices/IRSRSlice";
import UserSRReducer from "./slices/UserSRSlice";
import ProjectSliceReducer from "./slices/ProjectSlice";
import ProjectServiceReducer from "./slices/ServiceSlice";
import IterationReducer from "./slices/IterationSlice";
import CalendarReducer from "./slices/CalendarSlice";
import RepoReducer from "./slices/RepoSlice";
import IssueReducer from "./slices/IssueSlice";
import SRChangeLogReducer from "./slices/SRChangeLogSlice";
import { Service } from "../components/rms/UIServiceReadonly";

interface SRCardProps {
  readonly id: number; // id
  readonly project: number; // the project belongs to
  readonly title: string; // title
  readonly description: string; // description
  readonly priority: number; // the priority which indicates the importance of the SR
  readonly rank?: number;
  readonly currState: string;
  readonly stateColor?: string;
  readonly createdBy?: string; // somebody
  readonly createdAt?: number; // sometime
  readonly disabled?: boolean;
  readonly iter: Iteration[];
  readonly chargedBy: number;
  readonly service: Service | number;
  readonly setModalClose?: () => void; // 关闭 modal 的回调
}

interface SRChangelog {
  readonly id: number;
  readonly project: number;
  readonly SRId: number;
  readonly description: string;
  readonly formerState: string;
  readonly formerDescription: string;
  readonly changedBy: number;
  readonly changedAt: number;
}

interface IRCardProps {
  readonly id: number; // id
  readonly project: number; // the project belongs to
  readonly title: string; // title
  readonly description: string; // description
  readonly rank: number;
  readonly createdBy?: string; // somebody
  readonly createdAt: number; // sometime
  readonly disabled?: boolean;
  readonly progress: number;
  readonly iter: Iteration[];
}

interface IRSRAssociation {
  readonly id: number;
  readonly IR: number;
  readonly SR: number;
}

interface IRIteration {
  readonly id: number;
  readonly IRId: number;
  readonly iterationId: number;
}

interface SRIteration {
  readonly id: number;
  readonly SRId: number;
  readonly iterationId: number;
}

interface UserIteration {
  readonly id?: number;
  readonly userId: number;
  readonly iterationId: number;
}

interface SRService {
  readonly id: number;
  readonly SRId: number;
  readonly serviceId: number;
}

interface ProjectInfo {
  id: number;
  title: string;
  description: string;
  invitation: string;
  role: string;
  createdAt: number;
  avatar: string;
}

interface ManageUserInfo {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: string;
}
interface Iteration {
  readonly id?: number;
  readonly project?: number;
  readonly sid: number;
  readonly title: string; // 创建必填
  readonly begin: number; // 创建必填
  readonly end: number; // 创建必填
  readonly disabled?: boolean;
  readonly createdAt?: number;
}

interface UserSRAssociationProps {
  readonly id?: number;
  readonly user: number;
  readonly sr: number;
}

interface MergeRequestProps {
  authoredAt: number;
  authoredByEmail: string;
  authoredByUserName: string;
  description: string;
  disabled: boolean;
  id: number;
  merge_id: number;
  repo: number;
  reviewedAt: number;
  reviewedByEmail: string;
  reviewedByUserName: string;
  state: "merged" | "opened" | "closed";
  title: string;
  url: string;
  user_authored: number;
  user_reviewed: number;
}

interface CommitProps {
  additions: number;
  commiter_email: string;
  commiter_name: string;
  createdAt: number;
  deletions: number;
  diff: string;
  disabled: boolean;
  hash_id: string;
  id: number;
  message: string;
  repo: number;
  title: string;
  url: string;
  user_committer: number;
}

interface IssueProps {
  assigneeUserName: string;
  authoredAt: number;
  authoredByUserName: string;
  closedAt: number;
  closedByUserName: string;
  description: string;
  disabled: boolean;
  id: number;
  is_bug: boolean;
  issue_id: number;
  labels: string;
  repo: number;
  state: "opened" | "closed";
  title: string;
  updatedAt: number;
  url: string;
  user_assignee: number;
  user_authored: number;
  user_closed: number;
}

const { createReduxHistory, routerMiddleware, routerReducer } =
  createReduxHistoryContext({ history: createBrowserHistory() });

export const store = configureStore({
  reducer: combineReducers({
    router: routerReducer,
    sidebar: sidebarReducer,
    ir_sr_store: IRSRReducer,
    user_store: UserSliceReducer,
    project_store: ProjectSliceReducer,
    service_store: ProjectServiceReducer,
    iteration_store: IterationReducer,
    calendar_store: CalendarReducer,
    user_sr_store: UserSRReducer,
    repo_store: RepoReducer,
    issue_store: IssueReducer,
    sr_changelog_store: SRChangeLogReducer,
    // rest of your reducers
  }),
  middleware: [routerMiddleware],
});

export const history = createReduxHistory(store);
export type {
  IRCardProps,
  SRCardProps,
  SRChangelog,
  IRSRAssociation,
  UserIteration,
  IRIteration,
  SRIteration,
  ProjectInfo,
  ManageUserInfo,
  Iteration,
  SRService,
  UserSRAssociationProps,
  MergeRequestProps,
  IssueProps,
  CommitProps,
};
