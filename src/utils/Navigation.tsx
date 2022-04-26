import { immediateToast } from "izitoast-react";
import { push } from "redux-first-history";
import { removeRDTSTimer } from "./Timer";

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
    displayMode: 1,
  });
};

const Redirect = (dispatcher: any, url: string, timeout = 2000): void => {
  // First, remove all of the timers
  removeRDTSTimer();
  // Then, redirect
  setTimeout(() => dispatcher(push(url)), timeout);
};

export { ToastMessage, Redirect };
