import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { createReduxHistoryContext } from "redux-first-history";
import { createBrowserHistory } from "history";
import sidebarReducer from "./slices/SidebarSlice";
import UserSliceReducer from "./slices/UserSlice";

interface SRCard {
  readonly id: number; // id
  readonly project: string; // the project belongs to
  readonly title: string; // title
  readonly description: string; // description
  readonly priority: number; // the priority which indicates the importance of the SR
  readonly currState: string; // "TODO", "WIP", "Reviewing", "Done"
  readonly createdBy: string; // somebody
  readonly createdAt: number; // sometime
  readonly disabled: boolean;
}

const { createReduxHistory, routerMiddleware, routerReducer } =
  createReduxHistoryContext({ history: createBrowserHistory() });

export const store = configureStore({
  reducer: combineReducers({
    router: routerReducer,
    sidebar: sidebarReducer,
    user_store: UserSliceReducer,
    // rest of your reducers
  }),
  middleware: [routerMiddleware],
});

export const history = createReduxHistory(store);
export type { SRCard };
