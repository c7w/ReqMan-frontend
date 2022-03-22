import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import store from "../store/store";
import Login from "./route/Login";
import Home from "../layout/Home";
import { IRList } from "../components/IRList";
import { SRList } from "../components/SRList";
import Root from "../layout/Root";
import "izitoast-react/dist/iziToast.css";

const SiteRouter = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Root />}></Route>
          <Route path="layout" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route
            path="IR_List"
            element={<IRList unimportant={"asduiosaudhsauiod"} />}
          />
          <Route
            path="SR_List"
            element={<SRList unimportant={"asduiosaudhsauiod"} />}
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default SiteRouter;
