import { Provider, connect } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { HistoryRouter as Router } from "redux-first-history/rr6";
import { store, history } from "../store/ConfigureStore";
import Login from "./route/Login";
import Home from "../layout/Home";
import { IRList } from "../components/IRList";
import { SRList } from "../components/SRList";
import Root from "./route/Root";
import "izitoast-react/dist/iziToast.css";
import Register from "./route/Register";
import Dashboard from "./route/Dashboard";

const SiteRouter = () => {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Routes>
          <Route path="/" element={<Root />}></Route>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route
            path="IR_List"
            element={<IRList unimportant={"asduiosaudhsauiod"} />}
          />
          <Route
            path="SR_List"
            element={<SRList unimportant={"asduiosaudhsauiod"} />}
          />
        </Routes>
      </Router>
    </Provider>
  );
};

export default SiteRouter;
