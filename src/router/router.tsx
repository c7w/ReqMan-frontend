import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import store from "../store/store";
import LoginInterface from "../components/ums/LoginInterface";
import RegisterInterface from "../components/ums/RegisterInterface";
import Home from "../layout/Home";
import IRList from "../components/IRList";
import SRList from "../components/SRList";

const SiteRouter = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="login"
            element={
              <LoginInterface
                submit={(name, password) =>
                  new Promise(() => {
                    console.debug(name);
                    return {};
                  })
                }
              />
            }
          />
          <Route
            path="register"
            element={
              <RegisterInterface
                submit={(name, password, email, invitation) =>
                  new Promise(() => {
                    console.debug(name);
                    return {};
                  })
                }
              />
            }
          />
          <Route
            path="IRlist"
            element={<IRList unimportant={"unimportant"} />}
          />
          {/*<Route path="SRlist" element={<SRList showChoose={true} />} />*/}
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default SiteRouter;
