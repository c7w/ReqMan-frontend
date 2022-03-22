import Home from "../../layout/Home";
import { useDispatch, useSelector } from "react-redux";
import { getUserStore } from "../../store/slices/UserSlice";
import { updateUserInfo } from "../../store/functions/UMS";
import { immediateToast } from "izitoast-react";
import { push } from "redux-first-history";

const Dashboard = () => {
  // Detect if logged in
  const dispatcher = useDispatch();
  const userInfo = useSelector(getUserStore);
  if (userInfo === "") {
    // Re-request userInfo
    updateUserInfo(dispatcher).catch(() => {
      immediateToast("error", {
        id: "dashboard-to-root-conn-lost",
        displayMode: 1,
        title: "连接丢失...",
        position: "topRight",
      });
      dispatcher(push("/"));
    });
  } else {
    // Right?
  }

  return <Home />;
};

export default Dashboard;
