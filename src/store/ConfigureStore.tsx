import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { createReduxHistoryContext } from "redux-first-history";
import { createBrowserHistory } from "history";
import sidebarReducer from "./slices/SidebarSlice";
import UserSliceReducer from "./slices/UserSlice";
import IRSRReducer from "./slices/IRSRSlice";
import ProjectSliceReducer from "./slices/ProjectSlice";
import ProjectServiceReducer from "./slices/ServiceSlice";

interface SRCard {
  readonly id: number; // id
  readonly project: number; // the project belongs to
  readonly title: string; // title
  readonly description: string; // description
  readonly priority: number; // the priority which indicates the importance of the SR
  readonly rank: number;
  readonly currState: string; // "TODO", "WIP", "Reviewing", "Done"
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
  // test
  readonly curSRKey: number[];
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
    // rest of your reducers
  }),
  middleware: [routerMiddleware],
});

export const history = createReduxHistory(store);
export type { IRCard, SRCard, ProjectInfo, ManageUserInfo };
