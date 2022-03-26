import { immediateToast } from "izitoast-react";
import { push } from "redux-first-history";

type immediateTypes = "info" | "error" | "warning" | "success" | "question";

const ToastMessage = (
  type: immediateTypes,
  title: string,
  message: string,
  timeout = 2000
) => {
  immediateToast(type, {
    title,
    message,
    timeout,
    position: "topRight",
  });
};

const Redirect = (dispatcher: any, url: string, timeout = 2000) => {
  setTimeout(() => dispatcher(push(url)), timeout);
};

export { ToastMessage, Redirect };
