import React, { useEffect } from "react";
import "./Root.css";
import logo from "../../../assets/Reqman-1.svg";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import request_json from "../../../utils/Network";
import API from "../../../utils/APIList";

import {
  generateRandomString,
  getCookie,
  setCookie,
} from "../../../utils/CookieOperation";
import { immediateToast } from "izitoast-react";
import { useDispatch } from "react-redux";
import { updateUserStore } from "../../../store/slices/UserSlice";
import { push } from "redux-first-history";
import { Progress } from "rsup-progress";
import Texty from "rc-texty";
import TweenOne from "rc-tween-one";

const Root = () => {
  const dispatcher = useDispatch();

  // Set cookies if not exist
  const cookie = getCookie("sessionId", "");
  if (cookie === "") {
    setCookie("sessionId", generateRandomString(32));
  }

  // Get user
  useEffect(() => {
    const loadingProgress = new Progress({
      height: "2px",
      color: "#b91f1f",
    });
    loadingProgress.start();
    request_json(API.GET_USER)
      .then((data) => {
        loadingProgress.end();
        if (data.code === 0) {
          dispatcher(updateUserStore(JSON.stringify(data))); // Maybe use UMS better
          const username = data.data.user.name;
          console.debug(data);
          immediateToast("success", {
            title: "连接成功",
            message: `欢迎回来，${username}！`,
            position: "topRight",
            timeout: 1000,
          });
          // setTimeout(() => {
          //   dispatcher(push("/dashboard")); // Use this way to redirect
          // }, 1000);
          // setTimeout(() => {
          //   dispatcher(push("/login")); // Use this way to redirect
          // }, 1000);
        } else {
          immediateToast("success", {
            title: "连接成功",
            message: "欢迎来到 ReqMan，请登录！",
            position: "topRight",
            timeout: 1000,
          });
          // setTimeout(() => {
          //   dispatcher(push("/login"));
          // }, 1000);
        }
      })
      .catch(() => {
        immediateToast("error", {
          title: "连接错误",
          message: "网络开小差啦...",
          position: "topRight",
        });
      });
  }, []);
  // useEffect Hook: Would be executed when the variables in the dependence list are initialized or changed value.
  // If you define an empty list as variable dependence, this function would just execute for once, just like didMount().

  const getInterval = (e: any) => {
    switch (e.index) {
      case 0:
        return 0;
      case 1:
        return 0;
      case 2:
        return 150;
      case 3:
      case 4:
      case 5:
      case 6:
        return 150 + 450 + (e.index - 2) * 10;
      default:
        return 150 + 450 + (e.index - 6) * 150;
    }
  };
  const getEnter = (e: any) => {
    const t = {
      opacity: 0,
      scale: 0.8,
      y: "-100%",
    };
    if (e.index >= 2 && e.index <= 6) {
      return { ...t, y: "-30%", duration: 150 };
    }
    return t;
  };

  const getSplit = (e: any) => {
    const t = e.split(" ");
    const c: any = [];
    t.forEach((str: any, i: any) => {
      c.push(<span key={`${str}-${i}`}>{str}</span>);
      if (i < t.length - 1) {
        c.push(<span key={` -${i}`}> </span>);
      }
    });
    return c;
  };

  return (
    <div className={"root-screen"}>
      <div className="combined">
        <div className="combined-shape">
          <div className="shape-left">
            <TweenOne
              animation={[
                {
                  x: "20vw",
                  type: "from",
                  ease: "easeInOutQuint",
                  duration: 600,
                },
                {
                  x: "-20vw",
                  ease: "easeInOutQuart",
                  duration: 450,
                  delay: -150,
                },
              ]}
            />
          </div>
          <div className="shape-right">
            <TweenOne
              animation={[
                {
                  x: "-20vw",
                  type: "from",
                  ease: "easeInOutQuint",
                  duration: 600,
                },
                {
                  x: "20vw",
                  ease: "easeInOutQuart",
                  duration: 450,
                  delay: -150,
                },
              ]}
            />
          </div>
        </div>
        <Texty
          className="title"
          type="mask-top"
          delay={400}
          enter={getEnter}
          interval={getInterval}
          component={TweenOne}
          componentProps={{
            animation: [
              { x: 200, type: "set" },
              { x: 100, delay: 500, duration: 450 },
              {
                ease: "easeOutQuart",
                duration: 300,
                x: 0,
              },
              {
                letterSpacing: 0,
                delay: -300,
                scale: 0.9,
                ease: "easeInOutQuint",
                duration: 1000,
              },
              {
                scale: 1,
                width: "100%",
                delay: -300,
                duration: 1000,
                ease: "easeInOutQuint",
              },
            ],
          }}
        >
          ReqMan
        </Texty>
        <TweenOne
          className="combined-bar"
          animation={{
            delay: 2000,
            width: 0,
            x: "10vw",
            type: "from",
            ease: "easeInOutExpo",
          }}
        />
        <Texty
          className="content"
          type="bottom"
          split={getSplit}
          delay={2200}
          interval={30}
        >
          Your Requirement Management Servant
        </Texty>
      </div>
      <div id="loading-progress">
        <span id="loading-progress-thumb" />
      </div>
      <div className={"root-loading"}>
        <Loading3QuartersOutlined
          style={{ fontSize: "72px", color: "black" }}
          className={"root-spinner"}
        />
      </div>
      <div className={"root-footer"}>
        © 2022 undefined. All rights reserved.
      </div>
    </div>
  );
};

export default Root;
