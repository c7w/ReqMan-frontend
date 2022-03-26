import "./Fallback.css";
import logo from "../../assets/ReqMan.png";
import React from "react";
import { useDispatch } from "react-redux";
import { Redirect } from "../../utils/Navigation";

const Fallback = () => {
  const dispatcher = useDispatch();
  const handleOnClick = () => {
    Redirect(dispatcher, "/login", 0);
  };
  return (
    <>
      <div className="about">
        <a
          className="bg_links social portfolio"
          href="https://www.baidu.com"
          target="_blank"
        >
          <span className="icon"></span>
        </a>
        <a
          className="bg_links social dribbble"
          href="https://www.baidu.com"
          target="_blank"
        >
          <span className="icon"></span>
        </a>
        <a
          className="bg_links social linkedin"
          href="https://www.baidu.com"
          target="_blank"
        >
          <span className="icon"></span>
        </a>
        <a className="bg_links logo"></a>
      </div>
      <nav>
        <div className="menu">
          <img
            className="website_name"
            src={logo}
            alt="undefined"
            width={200}
            height={55}
          />
          <div className="menu_links">
            <a href="" className="link">
              about
            </a>
            <a href="" className="link">
              projects
            </a>
            <a href="" className="link">
              contacts
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
              <p>Uh oh! Looks like you got lost.</p>
              <p style={{ fontWeight: "bolder" }}>
                Go back to the homepage below
              </p>
              <button onClick={() => handleOnClick()}>Click me ！</button>
            </article>
          </div>
        </div>
      </section>
    </>
  );
};

export default Fallback;
