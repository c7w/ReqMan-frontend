import React, { useEffect } from "react";
import "./Root.css";
import { DownOutlined, Loading3QuartersOutlined } from "@ant-design/icons";
import projectListPic from "../../../assets/RootPageCarousel/项目列表.png";
import SRListPic from "../../../assets/RootPageCarousel/SR列表.png";
import iterationPic from "../../../assets/RootPageCarousel/迭代周期.png";
import calendarPic from "../../../assets/RootPageCarousel/日程表.png";
import analysisPic from "../../../assets/RootPageCarousel/项目分析.png";
import servicePic from "../../../assets/RootPageCarousel/项目服务.png";
import request_json from "../../../utils/Network";
import API from "../../../utils/APIList";
import logo from "../../../assets/ReqMan.png";
import { Carousel, Image } from "antd";
import {
  generateRandomString,
  getCookie,
  setCookie,
} from "../../../utils/CookieOperation";
import { faAngleDoubleDown } from "@fortawesome/free-solid-svg-icons";
import { immediateToast } from "izitoast-react";
import { useDispatch } from "react-redux";
import { updateUserStore } from "../../../store/slices/UserSlice";
import { push } from "redux-first-history";
// import { Progress } from "rsup-progress";
import TweenOne from "rc-tween-one";
import AnimatedText from "react-animated-text-content";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

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
    <div className="root-screen-2">
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
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            maxHeight: "50vh",
            paddingLeft: "10%",
            paddingRight: "5%",
          }}
        >
          <div className="combined">
            <AnimatedText
              type="chars" // animate words or chars
              animation={{
                x: "200px",
                y: "-20px",
                scale: 1.1,
                ease: "ease-in-out",
              }}
              className={"title"}
              animationType="float"
              interval={0}
              duration={0.8}
              includeWhiteSpaces
              threshold={0.1}
              rootMargin="20%"
            >
              ReqMan
            </AnimatedText>
            <TweenOne
              className="combined-bar"
              animation={{
                delay: 1400,
                width: 0,
                x: "8vw",
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
              <div>开启您的项目</div>
            </div>
          </div>
          <div className="root-carousel">
            <Carousel autoplay style={{ borderRadius: "2rem" }}>
              <Image
                src={calendarPic}
                alt="开发工程师日程表"
                width="100%"
                style={{ borderRadius: "2rem" }}
              />
              <Image
                src={projectListPic}
                alt="项目列表"
                width="100%"
                style={{ borderRadius: "2rem" }}
              />
              <Image
                src={servicePic}
                alt="项目服务"
                width="100%"
                style={{ borderRadius: "2rem" }}
              />
              <Image
                src={analysisPic}
                alt="项目分析"
                width="100%"
                style={{ borderRadius: "2rem" }}
              />
              <Image
                src={SRListPic}
                alt="功能需求列表"
                width="100%"
                style={{ borderRadius: "2rem" }}
              />
              <Image
                src={iterationPic}
                alt="项目迭代周期"
                width="100%"
                style={{ borderRadius: "2rem" }}
              />
            </Carousel>
          </div>
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
        <div
          style={{
            height: "45vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "center",
            fontSize: "2rem",
          }}
        >
          <FontAwesomeIcon icon={faAngleDoubleDown} />
        </div>
        <div className={"root-contents"}>
          <div className="secondEdition">
            <p className="theTitle">ReqMan，新一代需求管理与缺陷追踪平台</p>
          </div>
          <div className="secondEditionContent">
            <div className="hadoop" id="hadoop">
              <div className="hadoopCon">
                <div className="descBox">
                  <p className="desc1">与 Git 深入融合</p>
                  <p className="desc2">
                    支持 Git 分布式代码托管环境，与 GitLab 完美对接；
                  </p>
                  <p className="desc3">
                    支持协作贡献统计、代码仓库查看、贡献合并查看、贡献信息查看等功能；
                  </p>
                </div>
                <div className="hadoopCode">
                  <li>
                    <pre
                      className="word-item"
                      style={{ animationDelay: "0.2s" }}
                    >
                      <span className="codenum">1</span>
                      <span>
                        <span className="code-green">git remote</span> add
                        origin git@gitlab.secoder.net:undefined/frontend.git
                      </span>
                    </pre>
                  </li>
                  <li>
                    <pre
                      className="word-item"
                      style={{ animationDelay: "0.4s" }}
                    >
                      <span className="codenum">2</span>
                      <span>
                        <span className="code-red">git push</span> -u origin
                        master
                      </span>
                    </pre>
                  </li>
                  <li>
                    <pre
                      className="word-item"
                      style={{ animationDelay: "0.6s" }}
                    >
                      <span className="codenum">3</span>
                      <span>
                        <span className="code-green">git branch</span> dev
                      </span>
                    </pre>
                  </li>
                  <li>
                    <pre
                      className="word-item"
                      style={{ animationDelay: "0.8s" }}
                    >
                      <span className="codenum">4</span>
                      <span>
                        <span className="code-blue">git checkout</span> dev
                      </span>
                    </pre>
                  </li>
                  <li>
                    <pre
                      className="word-item"
                      style={{ animationDelay: "1.0s" }}
                    >
                      <span className="codenum">5</span>
                      <span>
                        <span className="code-green">git add</span> .
                      </span>
                    </pre>
                  </li>
                  <li>
                    <pre
                      className="word-item"
                      style={{ animationDelay: "1.2s" }}
                    >
                      <span className="codenum">6</span>
                      <span>
                        <span className="code-red">git commit</span> -m
                        "[SR.007.109] Remake Rootpage"
                      </span>
                    </pre>
                  </li>
                  <li>
                    <pre
                      className="word-item"
                      style={{ animationDelay: "1.4s" }}
                    >
                      <span className="codenum">7</span>
                      <span>
                        <span className="code-red">git push</span> origin dev
                      </span>
                    </pre>
                  </li>
                  <li>
                    <pre
                      className="word-item"
                      style={{ animationDelay: "1.6s" }}
                    >
                      <span className="codenum">8</span>
                      <span>
                        <span className="code-blue">git checkout</span> master
                      </span>
                    </pre>
                  </li>
                  <li>
                    <pre
                      className="word-item"
                      style={{ animationDelay: "1.8s" }}
                    >
                      <span className="codenum">9</span>
                      <span>
                        <span className="code-green">git pull</span> origin
                        master
                      </span>
                    </pre>
                  </li>
                  <li>
                    <pre className="word-item" style={{ animationDelay: "2s" }}>
                      <span className="codenum">10</span>
                      <span>
                        <span className="code-green">git merge</span> dev
                      </span>
                    </pre>
                  </li>
                  <li>
                    <pre
                      className="word-item"
                      style={{ animationDelay: "2.2s" }}
                    >
                      <span className="codenum">11</span>
                      <span>
                        <span className="code-red">git push</span> origin master
                      </span>
                    </pre>
                  </li>
                </div>
              </div>
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
