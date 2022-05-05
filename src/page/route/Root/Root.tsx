import React, { useEffect } from "react";
import "./Root.css";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import request_json from "../../../utils/Network";
import API from "../../../utils/APIList";
import logo from "../../../assets/ReqMan.png";
import { Carousel } from "antd";
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

  const contentStyle = {
    height: "160px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
  };

  return (
    <div className="root-screen">
      <div id="loading-progress">
        <span id="loading-progress-thumb" />
      </div>
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
            className="title"
            includeWhiteSpaces
            threshold={0.1}
            rootMargin="20%"
          >
            ReqMan
          </AnimatedText>
          <TweenOne
            className="combined-bar"
            style={{ width: "100%" }}
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
          <div className="root-to-login" onClick={toLogin}>
            开启您的项目
          </div>
        </div>
        <div className="root-carousel">
          <Carousel autoplay>
            <div>
              <h3
                style={{
                  height: "160px",
                  color: "#fff",
                  lineHeight: "160px",
                  textAlign: "center",
                  background: "#364d79",
                }}
              >
                1
              </h3>
            </div>
            <div>
              <h3
                style={{
                  height: "160px",
                  color: "#fff",
                  lineHeight: "160px",
                  textAlign: "center",
                  background: "#364d79",
                }}
              >
                2
              </h3>
            </div>
            <div>
              <h3
                style={{
                  height: "160px",
                  color: "#fff",
                  lineHeight: "160px",
                  textAlign: "center",
                  background: "#364d79",
                }}
              >
                3
              </h3>
            </div>
            <div>
              <h3
                style={{
                  height: "160px",
                  color: "#fff",
                  lineHeight: "160px",
                  textAlign: "center",
                  background: "#364d79",
                }}
              >
                4
              </h3>
            </div>
          </Carousel>
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
