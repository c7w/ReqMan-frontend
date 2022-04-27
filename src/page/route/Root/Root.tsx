import React, { useEffect } from "react";
import "./Root.css";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import request_json from "../../../utils/Network";
import API from "../../../utils/APIList";
import logo from "../../../assets/ReqMan.png";
import {
  generateRandomString,
  getCookie,
  setCookie,
} from "../../../utils/CookieOperation";
import { immediateToast } from "izitoast-react";
import { useDispatch } from "react-redux";
import { updateUserStore } from "../../../store/slices/UserSlice";
import { push } from "redux-first-history";
// import { Progress } from "rsup-progress";
import TweenOne from "rc-tween-one";
import AnimatedText from "react-animated-text-content";

const Root = () => {
  const dispatcher = useDispatch();

  // Set cookies if not exist
  const cookie = getCookie("sessionId", "");
  if (cookie === "") {
    setCookie("sessionId", generateRandomString(32));
  }

  // Get user
  const toLogin = () => {
    // const loadingProgress = new Progress({
    //   height: "2px",
    //   color: "#b91f1f",
    // });
    // loadingProgress.start();
    request_json(API.GET_USER)
      .then((data) => {
        // loadingProgress.end();
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
          setTimeout(() => {
            dispatcher(push("/dashboard")); // Use this way to redirect
          }, 1000);
        } else {
          immediateToast("success", {
            title: "连接成功",
            message: "欢迎来到 ReqMan，请登录！",
            position: "topRight",
            timeout: 1000,
          });
          setTimeout(() => {
            dispatcher(push("/login"));
          }, 1000);
        }
      })
      .catch(() => {
        immediateToast("error", {
          title: "连接错误",
          message: "网络开小差啦...",
          position: "topRight",
        });
      });
  };
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
    <div className="root-screen">
      <nav>
        <div className="root-menu">
          <div className="root-menu-logo">
            <img src={logo} alt="undefined" width={200} height={55} />
          </div>
          <div className="root-menu_links">
            <a
              href="https://doc-undefined.app.secoder.net/"
              className="root-menu-link"
            >
              开发者文档
            </a>
            {/*<a href="" className="root-menu-link">*/}
            {/*  联系我们*/}
            {/*</a>*/}
          </div>
        </div>
      </nav>
      <div className={"root-wrapper"}>
        <div className="combined">
          {/*<div className="combined-shape">*/}
          {/*  <div className="shape-left">*/}
          {/*    <TweenOne*/}
          {/*      animation={[*/}
          {/*        {*/}
          {/*          x: "20vw",*/}
          {/*          type: "from",*/}
          {/*          ease: "easeInOutQuint",*/}
          {/*          duration: 600,*/}
          {/*        },*/}
          {/*        {*/}
          {/*          x: "-20vw",*/}
          {/*          ease: "easeInOutQuart",*/}
          {/*          duration: 450,*/}
          {/*          delay: -150,*/}
          {/*        },*/}
          {/*      ]}*/}
          {/*    />*/}
          {/*  </div>*/}
          {/*  <div className="shape-right">*/}
          {/*    <TweenOne*/}
          {/*      animation={[*/}
          {/*        {*/}
          {/*          x: "-20vw",*/}
          {/*          type: "from",*/}
          {/*          ease: "easeInOutQuint",*/}
          {/*          duration: 600,*/}
          {/*        },*/}
          {/*        {*/}
          {/*          x: "20vw",*/}
          {/*          ease: "easeInOutQuart",*/}
          {/*          duration: 450,*/}
          {/*          delay: -150,*/}
          {/*        },*/}
          {/*      ]}*/}
          {/*    />*/}
          {/*  </div>*/}
          {/*</div>*/}
          <AnimatedText
            type="chars" // animate words or chars
            animation={{
              x: "200px",
              y: "-20px",
              scale: 1.1,
              ease: "ease-in-out",
            }}
            animationType="float"
            interval={0}
            duration={0.8}
            tag="p"
            className="title"
            includeWhiteSpaces
            threshold={0.1}
            rootMargin="20%"
          >
            ReqMan
          </AnimatedText>
          ;
          <TweenOne
            className="combined-bar"
            animation={{
              delay: 1400,
              width: 0,
              x: "10vw",
              type: "from",
              ease: "easeInOutExpo",
            }}
          />
          <AnimatedText
            type="chars"
            className="content"
            interval={0.03}
            duration={0.1}
            animation={{
              y: "15px",
              ease: "ease",
              scale: 2.39,
            }}
          >
            Your Requirement Management Servant
          </AnimatedText>
        </div>
        <div id="loading-progress">
          <span id="loading-progress-thumb" />
        </div>
        {/*<div className={"root-loading"}>*/}
        {/*  <Loading3QuartersOutlined*/}
        {/*    style={{ fontSize: "72px", color: "black" }}*/}
        {/*    className={"root-spinner"}*/}
        {/*  />*/}
        {/*</div>*/}
        <div className="root-to-login" onClick={toLogin}>
          开启您的项目
        </div>
        <div className="root-features">
          <div className="root-feature-card root-feature-card1">
            <div className="root-feature-title">智能规划</div>
            <div className="root-feature-content">
              合理安排迭代周期，一键管理开发日程
            </div>
          </div>
          <div className="root-feature-card root-feature-card2">
            <div className="root-feature-title">需求管理</div>
            <div className="root-feature-content">
              精准划分原始需求，查看关联软件服务
            </div>
          </div>
          <div className="root-feature-card root-feature-card3">
            <div className="root-feature-title">缺陷跟踪</div>
            <div className="root-feature-content">
              实时获取项目缺陷，查看缺陷修复情况
            </div>
          </div>
        </div>
        <div className={"root-footer"}>
          © 2022 undefined. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Root;
