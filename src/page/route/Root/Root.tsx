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
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import IsVisible from "react-is-visible";
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
            <IsVisible once={true}>
              {(isVisible: any) => {
                return (
                  <div
                    className={"hadoop" + (isVisible ? " inView" : " outView")}
                    id="hadoop"
                  >
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
                            className={"word-item"}
                            style={{ transitionDelay: "0.2s" }}
                          >
                            <span className="codenum">1</span>
                            <span>
                              <span className="code-green">git remote</span> add
                              origin
                              git@gitlab.secoder.net:undefined/frontend.git
                            </span>
                          </pre>
                        </li>
                        <li>
                          <pre
                            className="word-item"
                            style={{ transitionDelay: "0.4s" }}
                          >
                            <span className="codenum">2</span>
                            <span>
                              <span className="code-red">git push</span> -u
                              origin master
                            </span>
                          </pre>
                        </li>
                        <li>
                          <pre
                            className="word-item"
                            style={{ transitionDelay: "0.6s" }}
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
                            style={{ transitionDelay: "0.8s" }}
                          >
                            <span className="codenum">4</span>
                            <span>
                              <span className="code-blue">git checkout</span>{" "}
                              dev
                            </span>
                          </pre>
                        </li>
                        <li>
                          <pre
                            className="word-item"
                            style={{ transitionDelay: "1.0s" }}
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
                            style={{ transitionDelay: "1.2s" }}
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
                            style={{ transitionDelay: "1.4s" }}
                          >
                            <span className="codenum">7</span>
                            <span>
                              <span className="code-red">git push</span> origin
                              dev
                            </span>
                          </pre>
                        </li>
                        <li>
                          <pre
                            className="word-item"
                            style={{ transitionDelay: "1.6s" }}
                          >
                            <span className="codenum">8</span>
                            <span>
                              <span className="code-blue">git checkout</span>{" "}
                              master
                            </span>
                          </pre>
                        </li>
                        <li>
                          <pre
                            className="word-item"
                            style={{ transitionDelay: "1.8s" }}
                          >
                            <span className="codenum">9</span>
                            <span>
                              <span className="code-green">git pull</span>{" "}
                              origin master
                            </span>
                          </pre>
                        </li>
                        <li>
                          <pre
                            className="word-item"
                            style={{ transitionDelay: "2s" }}
                          >
                            <span className="codenum">10</span>
                            <span>
                              <span className="code-green">git merge</span> dev
                            </span>
                          </pre>
                        </li>
                        <li>
                          <pre
                            className="word-item"
                            style={{ transitionDelay: "2.2s" }}
                          >
                            <span className="codenum">11</span>
                            <span>
                              <span className="code-red">git push</span> origin
                              master
                            </span>
                          </pre>
                        </li>
                      </div>
                    </div>
                  </div>
                );
              }}
            </IsVisible>
            <IsVisible once={true}>
              {(isVisible: any) => {
                return (
                  <div className="oneStop activeCode" id="oneStop">
                    <div className="oneStopContent">
                      <div className="osLeftMain">
                        <img
                          src="/react/build/static/media/2-2-1.afd0f2f5.png"
                          alt=""
                          width="520px"
                          className="osleftPosi"
                        />
                        <img
                          src="/react/build/static/media/2-2-head.5e69dbb2.png"
                          alt=""
                          width="213px"
                          style={{ marginLeft: "-12px" }}
                        />
                        <img
                          src="/react/build/static/media/2-2-2.26bc3301.png"
                          alt=""
                          width="653px"
                          className="osleftPosi1"
                        />
                        <img
                          src="/react/build/static/media/2-2-3.6d6ce99c.png"
                          alt=""
                          width="367px"
                          className="osleftPosi2"
                        />
                      </div>
                      <div className="osRightMain">
                        <p className="osRightTitle">一站式需求管理</p>
                        <p>
                          提供
                          <span>原始需求管理、功能需求管理</span>
                          等多样化任务管理功能，对接客户需求与各类开发任务的发布、指派与跟踪；
                        </p>
                        <p>
                          支持<span>划分需求到迭代、划分需求到服务</span>
                          ，需求关系查看更方便
                        </p>
                        <p>
                          <span>我们的目标，是让您的需求管理更加高效！</span>
                        </p>
                      </div>
                    </div>
                    <img
                      src="data:image/png;base64,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"
                      alt=""
                      height="83px"
                      className="imgring"
                    />
                  </div>
                );
              }}
            </IsVisible>
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
