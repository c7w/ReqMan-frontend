import Home from "../../../layout/Home";
import "./Setting.css";
import { Avatar, Button, Input, Modal, Tooltip, Upload } from "antd";
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";
import { KeyOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import CryptoJS from "crypto-js";
import ImgCrop from "antd-img-crop";
import { getUserStore } from "../../../store/slices/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  updateProjectInfo,
  updateUserInfo,
} from "../../../store/functions/UMS";
import { Redirect, ToastMessage } from "../../../utils/Navigation";

const PersonalSetting = () => {
  const userStore = useSelector(getUserStore);
  const dispatcher = useDispatch();

  if (userStore === "") {
    // Re-Query...
    updateUserInfo(dispatcher);
  } else if (JSON.parse(userStore).code !== 0) {
    // Redirect to `Root`
    ToastMessage("error", "未确认登录态", "即将跳转回登录界面");
    Redirect(dispatcher, "/login");
  }

  const [avatarEditor, setAvatarEditor] = useState(false);
  const [avatarDelete, setAvatarDelete] = useState(false);
  const getUserAvatar = (userStore: string): string => {
    if (userStore === "" || JSON.parse(userStore).code !== 0) {
      return "";
    }
    const userInfo = JSON.parse(userStore);
    if (userInfo.data.user.avatar === "") {
      return `https://www.gravatar.com/avatar/${CryptoJS.MD5(
        userInfo.data.user.email
      )}`;
    } else {
      return userInfo.data.user.avatar;
    }
  };

  const [fileList, setFileList] = useState([]);

  const onChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: { url: any; originFileObj: Blob }) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const onBeforeUpload = (file: File) => {
    console.debug(file);
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      console.debug(reader.result); // TODO: change here to upload avatar to backend
    });
    reader.readAsDataURL(file);

    return false;
  };

  return (
    <Home sidebar={false}>
      <div className={"personal-setting-container"}>
        <div
          style={{
            fontSize: "2rem",
            marginLeft: "1rem",
            userSelect: "none",
            alignSelf: "flex-start",
          }}
        >
          个人设置
        </div>
        <hr style={{ width: "98%", margin: "1rem auto" }} />
        <div className="setting-row">
          <div className="column-1">
            <Title level={3}>公开头像</Title>
            <Text>您可以在这里修改头像或删除当前头像</Text>
          </div>
          <div className="column-2">
            <div
              className="setting-card"
              style={{ display: "flex", flexDirection: "row" }}
            >
              {/*// TODO: get user avatar*/}
              <Avatar src={getUserAvatar(userStore)} size={100}></Avatar>
              <div
                style={{
                  marginLeft: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-around",
                }}
              >
                <Title level={5}>头像修改</Title>
                <div>
                  <Modal
                    closable={false}
                    title={"删除头像"}
                    visible={avatarDelete}
                    onCancel={() => setAvatarDelete(false)}
                    footer={
                      <Button
                        danger={true}
                        onClick={() => {
                          console.debug("Upload empty avatar string"); // TODO
                          setAvatarDelete(false);
                        }}
                      >
                        确定删除
                      </Button>
                    }
                  >
                    您确定要删除头像吗？
                  </Modal>

                  <ImgCrop
                    rotate
                    modalTitle={"修改头像"}
                    modalOk={"确定"}
                    modalCancel={"取消"}
                  >
                    <Upload
                      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      listType="text"
                      showUploadList={false}
                      beforeUpload={onBeforeUpload}
                      fileList={fileList}
                      onChange={onChange}
                      onPreview={onPreview as any}
                      id={"setting-upload"}
                      className={"setting-upload"}
                    >
                      <Button type={"primary"}>修改头像</Button>
                    </Upload>
                  </ImgCrop>
                  <Button danger={true} onClick={() => setAvatarDelete(true)}>
                    删除头像
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="setting-row">
          <div className="column-1">
            <Title level={3}>邮箱设置</Title>
            <Text>您可以在这里修改当前账户邮箱设置</Text>
          </div>
          <div className="column-2">
            <div
              className="setting-card"
              style={{ display: "flex", flexDirection: "row" }}
            ></div>
          </div>
        </div>
        <div className="setting-row">
          <div className="column-1">
            <Title level={3}>密码设置</Title>
            <Text>您可以在这里修改当前账户密码</Text>
          </div>
          <div className="column-2">
            <div
              className="setting-card"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <p className={"register-prompt"}>
                <span style={{ color: "red" }}>* </span>
                <span style={{ color: "black" }}>当前密码：</span>
              </p>
              <Input.Password
                size={"large"}
                className={"setting-input"}
                prefix={<KeyOutlined />}
                type="text"
                placeholder=""
                bordered={false}
              />
            </div>
            <br />
            <div
              className="setting-card"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <p className={"register-prompt"}>
                <span style={{ color: "red" }}>* </span>
                <span style={{ color: "black" }}>新密码：</span>
              </p>
              <Input.Password
                size={"large"}
                className={"setting-input"}
                prefix={<KeyOutlined />}
                type="text"
                placeholder=""
                bordered={false}
              />
            </div>
            <br />
            <div
              className="setting-card"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <p className={"register-prompt"}>
                <span style={{ color: "red" }}>* </span>
                <span style={{ color: "black" }}>确认新密码：</span>
              </p>
              <Input.Password
                size={"large"}
                prefix={<KeyOutlined />}
                className={"setting-input"}
                type="text"
                placeholder=""
                bordered={false}
              />
            </div>
          </div>
        </div>
      </div>
    </Home>
  );
};

export default PersonalSetting;
