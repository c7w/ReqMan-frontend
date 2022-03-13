import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import store from "../store/store";
import LoginInterface from "../components/ums/LoginInterface";
import RegisterInterface from "../components/ums/RegisterInterface";
import Layout from "../layout/Layout";

const SiteRouter = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />} />
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
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default SiteRouter;
