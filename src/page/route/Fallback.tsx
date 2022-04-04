import "./Fallback.css";
import logo from "../../assets/ReqMan.png";
import React from "react";
import { useDispatch } from "react-redux";
import { Redirect } from "../../utils/Navigation";

const Fallback = () => {
  const dispatcher = useDispatch();
  return (
    <div className="fallback">
      <nav>
        <div className="menu">
          <img
            className="website_name"
            src={logo}
            alt="undefined"
            width={200}
            height={55}
            onClick={() => (window.location.href = "/dashboard")}
          />
          <div className="menu_links">
            <a
              className="link"
              onClick={() => Redirect(dispatcher, "./about", 0)}
            >
              关于我们
            </a>
            <a
              className="link"
              onClick={() => Redirect(dispatcher, "./projects", 0)}
            >
              项目列表
            </a>
          </div>
          <div className="menu_icon">
            <span className="icon"></span>
          </div>
        </div>
      </nav>

      <section className="wrapper">
        <div className="container">
          <div id="scene" className="scene" data-hover-only="false">
            <div className="circle" data-depth="1.2"></div>

            <div className="one" data-depth="0.9">
              <div className="content">
                <span className="piece"></span>
                <span className="piece"></span>
                <span className="piece"></span>
              </div>
            </div>

            <div className="two" data-depth="0.60">
              <div className="content">
                <span className="piece"></span>
                <span className="piece"></span>
                <span className="piece"></span>
              </div>
            </div>

            <div className="three" data-depth="0.40">
              <div className="content">
                <span className="piece"></span>
                <span className="piece"></span>
                <span className="piece"></span>
              </div>
            </div>

            <p className="p404" data-depth="0.50">
              404
            </p>
            <p className="p404" data-depth="0.10">
              404
            </p>
          </div>

          <div className="text">
            <article>
              <p style={{ fontWeight: "bolder" }}>哦不，页面走丢了~</p>
              <button onClick={() => Redirect(dispatcher, "/login", 0)}>
                回到工作面板
              </button>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Fallback;
