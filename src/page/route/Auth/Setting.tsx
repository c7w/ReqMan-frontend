import Home from "../../../layout/Home";
import "./Setting.css";
import { Avatar, Button, Input, Modal, Select, Tooltip, Upload } from "antd";
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";
import { KeyOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
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
import moment from "moment";
import { deleteRepoInfo, getRepoInfo } from "../../../store/functions/RDTS";
import Loading from "../../../layout/components/Loading";
import { compressBase64Image } from "../../../utils/ImageCompressor";
import { getUserAvatar } from "../../../utils/UserAvatar";

const PersonalSetting = () => {
  const userStore = useSelector(getUserStore);
  const dispatcher = useDispatch();

  const [remoteUrl, setRemoteUrl] = useState("");
  const [currRemoteUrl, setCurrRemoteUrl] = useState("");
  const [remoteNameResetVisible, setRemoteNameResetVisible] = useState(false);
  const [remoteName, setRemoteName] = useState("");

  const [avatarEditor, setAvatarEditor] = useState(false);
  const [avatarDelete, setAvatarDelete] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [newPassConfirmation, setNewPassConfirmation] = useState("");

  const [checkError, setCheckError] = useState("");
  const [doubleCheckError, setDoubleCheckError] = useState("");

  const [currMailInput, setCurrMailInput] = useState("");
  const [currMailValid, setCurrMailValid] = useState(false);

  const [fileList, setFileList] = useState([]);
  const [disableSelect, setDisableSelect] = useState(false);

  const [reload_cnt, set_reload_cnt] = useState(0);

  useEffect(() => {
    updateUserInfo(dispatcher);
    request_json(API.REMOTE_LIST).then((data: any) => {
      setRemoteUrl(JSON.stringify(data));
    });
  }, [reload_cnt]);

  if (userStore === "") {
    // Re-Query...
    return <Loading />;
  } else if (JSON.parse(userStore).code !== 0) {
    // Redirect to `Root`
    ToastMessage("error", "未确认登录态", "即将跳转回登录界面");
    Redirect(dispatcher, "/login");
  }

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
      console.debug(reader.result);
      compressBase64Image(reader.result as string).then((result: any) => {
        request_json(API.UPLOAD_USER_AVATAR, {
          body: { avatar: result },
        })
          .then((data) => {
            if (data.code === 0) {
              ToastMessage("success", "上传成功", "您的头像上传成功");
              updateUserInfo(dispatcher);
            }
          })
          .catch(() => {
            ToastMessage("error", "上传失败", "请检查网络连接后重试");
          });
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
              <Avatar src={getUserAvatar(userStore)} size={100} />
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
                disabled={disableSelect}
                defaultValue={
                  userStore === "" || JSON.parse(userStore).code !== 0
                    ? "-"
                    : JSON.parse(userStore).data.user.email
                }
                bordered={false}
                className={"setting-input"}
                style={{ width: "20rem" }}
                onChange={(value) => {
                  const former_email = JSON.parse(userStore).data.user.email;
                  setDisableSelect(true);
                  request_json(API.EMAIL_REQUEST, {
                    body: {
                      email: value,
                      op: "rm",
                      type: "minor",
                    },
                  }).then((data: any) => {
                    request_json(API.EMAIL_REQUEST, {
                      body: { email: value, op: "modify", type: "major" },
                    }).then((data: any) => {
                      request_json(API.EMAIL_REQUEST, {
                        body: { email: former_email, op: "add", type: "minor" },
                      }).then((data: any) => {
                        if (data.code === 0 || data.code === 2) {
                          ToastMessage(
                            "success",
                            "修改成功",
                            "您的邮箱修改成功"
                          );
                        }
                        updateUserInfo(dispatcher);
                        setDisableSelect(false);
                      });
                    });
                  });
                }}
              >
                <Select.Option value={JSON.parse(userStore).data.user.email}>
                  {JSON.parse(userStore).data.user.email}
                </Select.Option>
                {JSON.parse(userStore).data.user.minor_emails.map(
                  (entry: any) => (
                    <Select.Option key={entry[0]} value={entry[0]}>
                      {entry[0]}
                    </Select.Option>
                  )
                )}
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
                  value={currMailInput}
                  type="text"
                  placeholder=""
                  onChange={(e) => {
                    setCurrMailInput(e.target.value);
                    const reg =
                      /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/;
                    if (reg.test(e.target.value)) {
                      setCurrMailValid(true);
                    } else {
                      setCurrMailValid(false);
                    }
                  }}
                  bordered={false}
                />
              </div>
              <Button
                type={"primary"}
                style={{ marginTop: "1rem", width: "88px" }}
                disabled={!currMailValid}
                onClick={() => {
                  request_json(API.EMAIL_REQUEST, {
                    body: {
                      email: currMailInput,
                      op: "add",
                      type: "minor",
                    },
                  }).then((data: any) => {
                    if (data.code === 0) {
                      ToastMessage("success", "添加成功", "邮箱添加成功");
                      setCurrMailValid(false);
                      setCurrMailInput("");
                      updateUserInfo(dispatcher);
                    } else if (data.code === 2) {
                      ToastMessage("error", "添加失败", "邮箱添加过于频繁");
                    } else {
                      ToastMessage("error", "添加失败", "邮箱已被占用或不合法");
                    }
                  });
                }}
              >
                添加邮箱
              </Button>
            </div>
          </div>
        </div>
        <div className="setting-row">
          <div className="column-1">
            <Title level={3}>用户名设置</Title>
            <Text>您可以在这里修改当前账户与其他网站的用户名绑定设置</Text>
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
                远程用户名绑定：
              </p>
              <Text style={{ color: "grey" }}>
                绑定的用户名信息用于关联 Issue 与 Merge Request
              </Text>
              <table
                width={"98%"}
                style={{
                  margin: "0.5rem auto 1rem",
                  textAlign: "center",
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderWidth: "1px",
                      padding: "8px",
                      borderStyle: "solid",
                      borderColor: "#666666",
                      backgroundColor: "#dedede",
                    }}
                  >
                    <td>远程地址</td>
                    <td>当前用户名</td>
                    <td>操作</td>
                  </tr>
                </thead>
                <tbody>
                  {remoteUrl === ""
                    ? null
                    : Object.entries(JSON.parse(remoteUrl).data.all_urls).map(
                        (remote: any) => (
                          <tr
                            key={remote[0]}
                            style={{
                              borderWidth: "1px",
                              padding: "8px",
                              borderStyle: "solid",
                              borderColor: "#666666",
                              backgroundColor: "#ffffff",
                            }}
                          >
                            <td className={"iter-manager-column"}>
                              {remote[0]}
                            </td>
                            <td>
                              {JSON.parse(remoteUrl).data.exist_usernames[
                                remote[0]
                              ] || "- 未设定 -"}
                            </td>
                            <td className={"iter-manager-column"}>
                              <a
                                onClick={() => {
                                  setCurrRemoteUrl(remote[0]);
                                  setRemoteNameResetVisible(true);
                                }}
                              >
                                更新用户名
                              </a>
                            </td>
                          </tr>
                        )
                      )}
                  <Modal
                    destroyOnClose={true}
                    title={"设置远端用户名"}
                    width={"30vw"}
                    visible={remoteNameResetVisible}
                    onCancel={() => setRemoteNameResetVisible(false)}
                    footer={
                      <Button
                        onClick={() => {
                          request_json(API.SET_REMOTE_USERNAME, {
                            body: {
                              url: currRemoteUrl,
                              remote_name: remoteName,
                            },
                          }).then((data: any) => {
                            if (data.code === 0) {
                              ToastMessage(
                                "success",
                                "更新成功",
                                "远端用户名设置成功"
                              );
                              setRemoteNameResetVisible(false);
                              setRemoteName("");
                              set_reload_cnt(reload_cnt + 1);
                            } else {
                              ToastMessage(
                                "error",
                                "更新失败",
                                "请检查用户名是否合法"
                              );
                            }
                          });
                        }}
                      >
                        确定更新
                      </Button>
                    }
                  >
                    <p
                      className={"register-prompt"}
                      style={{
                        marginBottom: "0.2rem",
                        marginTop: "1rem",
                      }}
                    >
                      输入用户名：
                    </p>
                    <div>
                      <Input
                        className={"setting-input"}
                        style={{ width: "100%" }}
                        size={"large"}
                        prefix={<UserOutlined />}
                        type="text"
                        placeholder=""
                        onChange={(e) => {
                          setRemoteName(e.target.value);
                        }}
                        bordered={false}
                      />
                    </div>
                  </Modal>
                </tbody>
              </table>
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
                  newPass === newPassConfirmation &&
                  checkError === " " &&
                  doubleCheckError === " "
                )
              }
              onClick={() => {
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
