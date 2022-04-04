import Home from "../../../layout/Home";
import "./Setting.css";
import { Avatar, Button, Input, Modal, Select, Tooltip, Upload } from "antd";
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";
import { KeyOutlined, MailOutlined } from "@ant-design/icons";
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
import request_json from "../../../utils/Network";
import API from "../../../utils/APIList";

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
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [newPassConfirmation, setNewPassConfirmation] = useState("");

  const [checkError, setCheckError] = useState("");
  const [doubleCheckError, setDoubleCheckError] = useState("");

  const getUserAvatar = (userStore: string): string => {
    if (userStore === "" || JSON.parse(userStore).code !== 0) {
      return "";
    }
    const userInfo = JSON.parse(userStore);
    if (userInfo.data.user.avatar.length < 5) {
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
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      request_json(API.UPLOAD_USER_AVATAR, { body: { avatar: reader.result } })
        .then((data) => {
          if (data.code === 0) {
            ToastMessage("success", "上传成功", "您的头像上传成功");
            window.location.href = "/settings";
          }
        })
        .catch(() => {
          ToastMessage("error", "上传失败", "请检查网络连接后重试");
        });
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
                          request_json(API.UPLOAD_USER_AVATAR, {
                            body: { avatar: "X" },
                          })
                            .then((data) => {
                              if (data.code === 0) {
                                ToastMessage(
                                  "success",
                                  "删除成功",
                                  "您的头像删除成功"
                                );
                                window.location.href = "/settings";
                              }
                            })
                            .catch(() => {
                              ToastMessage(
                                "error",
                                "删除失败",
                                "请检查网络连接后重试"
                              );
                            });
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
            <br />

            <Text>主邮箱用于登录及找回密码</Text>
            <br />
            <Text>其他邮箱用于 Commit 关联</Text>
          </div>
          <div className="column-2">
            <div
              className="setting-card"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <p
                className={"register-prompt"}
                style={{ marginBottom: "0.2rem" }}
              >
                当前账户主邮箱：
              </p>

              <Select
                defaultValue={
                  userStore === "" || JSON.parse(userStore).code !== 0
                    ? "-"
                    : JSON.parse(userStore).data.user.email
                }
                bordered={false}
                className={"setting-input"}
                style={{ width: "20rem" }}
                onChange={(value) => {
                  console.debug(value); // TODO: change user primary email
                }}
              >
                <Select.Option value="jack">项目开发中</Select.Option>
                // TODO
              </Select>

              <p
                className={"register-prompt"}
                style={{ marginBottom: "0.2rem", marginTop: "1rem" }}
              >
                添加新邮箱：
              </p>
              <div>
                <Input
                  className={"setting-input"}
                  size={"large"}
                  prefix={<MailOutlined />}
                  type="text"
                  placeholder=""
                  onChange={(val) => {
                    console.debug(val); // TODO: verify email
                  }}
                  bordered={false}
                />
              </div>
              <Button
                type={"primary"}
                style={{ marginTop: "1rem", width: "88px" }}
                disabled={true}
              >
                添加邮箱
              </Button>
            </div>
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
                onChange={(e) => setOldPass(e.target.value)}
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
              <Tooltip
                title={checkError}
                visible={checkError !== "" && checkError !== " "}
                placement={"right"}
                className={"register-tooltip"}
                overlayInnerStyle={{ width: "20rem", textAlign: "center" }}
              >
                <Input.Password
                  size={"large"}
                  className={"setting-input"}
                  prefix={<KeyOutlined />}
                  type="text"
                  placeholder=""
                  bordered={false}
                  onChange={(e) => {
                    setNewPass(e.target.value);
                    const password = e.target.value;
                    const reg1 = /^.{6,20}$/;
                    const reg2 = /^[0-9]+$/;
                    const reg3 = /^[a-z]+$/;
                    const reg4 = /^[A-Z]+$/;
                    const reg5 = /^[0-9a-z]+$/;
                    const reg6 = /^[0-9A-Z]+$/;
                    const reg7 = /^[a-zA-Z]+$/;
                    if (!reg1.test(password)) {
                      setCheckError("密码为 6-20 位数字、字母或特殊字符");
                    } else if (
                      reg2.test(password) ||
                      reg3.test(password) ||
                      reg4.test(password) ||
                      reg5.test(password) ||
                      reg6.test(password) ||
                      reg7.test(password)
                    ) {
                      setCheckError("密码需包含数字、大小写字母或包含特殊字符");
                    } else {
                      setCheckError(" ");
                    }
                  }}
                />
              </Tooltip>
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
              <Tooltip
                title={doubleCheckError}
                visible={doubleCheckError !== "" && doubleCheckError !== " "}
                placement={"right"}
                className={"register-tooltip"}
                overlayInnerStyle={{ width: "20rem", textAlign: "center" }}
              >
                <Input.Password
                  size={"large"}
                  prefix={<KeyOutlined />}
                  className={"setting-input"}
                  type="text"
                  placeholder=""
                  bordered={false}
                  onChange={(e) => {
                    setNewPassConfirmation(e.target.value);
                    if (e.target.value != newPass) {
                      setDoubleCheckError("与第一次密码输入不符，请检查");
                    } else {
                      setDoubleCheckError(" ");
                    }
                  }}
                />
              </Tooltip>
            </div>
            <Button
              type={"primary"}
              style={{ marginTop: "1rem" }}
              disabled={
                !(
                  newPass == newPassConfirmation &&
                  checkError === " " &&
                  doubleCheckError === " "
                )
              }
              onClick={() => {
                console.debug({
                  prev: CryptoJS.MD5(oldPass).toString(),
                  curr: CryptoJS.MD5(newPass).toString(),
                });
                request_json(API.CHANGE_USER_PASSWORD, {
                  body: {
                    prev: CryptoJS.MD5(oldPass).toString(),
                    curr: CryptoJS.MD5(newPass).toString(),
                  },
                })
                  .then((data) => {
                    if (data.code === 0) {
                      ToastMessage("success", "修改成功", "您的密码修改成功");
                    } else {
                      ToastMessage("error", "修改失败", "您的原密码错误");
                    }
                  })
                  .catch(() => {
                    ToastMessage("error", "连接失败", "请检查网络连接");
                  });
              }}
            >
              更新密码
            </Button>
          </div>
        </div>
      </div>
    </Home>
  );
};

export default PersonalSetting;
