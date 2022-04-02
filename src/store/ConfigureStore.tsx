import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { createReduxHistoryContext } from "redux-first-history";
import { createBrowserHistory } from "history";
import sidebarReducer from "./slices/SidebarSlice";
import UserSliceReducer from "./slices/UserSlice";
import IRSRReducer from "./slices/IRSRSlice";
import ProjectSliceReducer from "./slices/ProjectSlice";
import ProjectServiceReducer from "./slices/ServiceSlice";
import IterationReducer from "./slices/IterationSlice";

interface SRCard {
  readonly id: number; // id
  readonly project: number; // the project belongs to
  readonly title: string; // title
  readonly description: string; // description
  readonly priority: number; // the priority which indicates the importance of the SR
  readonly rank: number;
  readonly currState: string; // "TODO", "WIP", "Reviewing", "Done"
  readonly stateColor?: string;
  readonly createdBy: string; // somebody
  readonly createdAt: number; // sometime
  readonly disabled: boolean;
}

interface IRCard {
  readonly id: number; // id
  readonly project: number; // the project belongs to
  readonly title: string; // title
  readonly description: string; // description
  readonly rank: number;
  readonly createdBy: string; // somebody
  readonly createdAt: number; // sometime
  readonly disabled: boolean;
}

interface IRSRAssociation {
  readonly id: number;
  readonly IRId: number;
  readonly SRId: number;
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
  readonly id: number;
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
  createdAt: number;
  avatar: string;
}

interface ManageUserInfo {
  id: number;
  name: string;
  email: string;
  avatar: string;
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
    // rest of your reducers
  }),
  middleware: [routerMiddleware],
});

export const history = createReduxHistory(store);
export type {
  IRCard,
  SRCard,
  IRSRAssociation,
  UserIteration,
  IRIteration,
  SRIteration,
  ProjectInfo,
  ManageUserInfo,
  Iteration,
  SRService,
};
