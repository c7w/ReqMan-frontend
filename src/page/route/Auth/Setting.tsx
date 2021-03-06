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
    ToastMessage("error", "??????????????????", "???????????????????????????");
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
              ToastMessage("success", "????????????", "????????????????????????");
              updateUserInfo(dispatcher);
            }
          })
          .catch(() => {
            ToastMessage("error", "????????????", "??????????????????????????????");
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
          ????????????
        </div>
        <hr style={{ width: "98%", margin: "1rem auto" }} />
        <div className="setting-row">
          <div className="column-1">
            <Title level={3}>????????????</Title>
            <Text>???????????????????????????????????????????????????</Text>
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
                <Title level={5}>????????????</Title>
                <div>
                  <Modal
                    closable={false}
                    title={"????????????"}
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
                                  "????????????",
                                  "????????????????????????"
                                );
                                window.location.href = "/settings";
                              }
                            })
                            .catch(() => {
                              ToastMessage(
                                "error",
                                "????????????",
                                "??????????????????????????????"
                              );
                            });
                          setAvatarDelete(false);
                        }}
                      >
                        ????????????
                      </Button>
                    }
                  >
                    ??????????????????????????????
                  </Modal>

                  <ImgCrop
                    rotate
                    modalTitle={"????????????"}
                    modalOk={"??????"}
                    modalCancel={"??????"}
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
                      <Button type={"primary"}>????????????</Button>
                    </Upload>
                  </ImgCrop>
                  <Button danger={true} onClick={() => setAvatarDelete(true)}>
                    ????????????
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="setting-row">
          <div className="column-1">
            <Title level={3}>????????????</Title>
            <Text>????????????????????????????????????????????????</Text>
            <br />

            <Text>????????????????????????????????????</Text>
            <br />
            <Text>?????????????????? Commit ??????</Text>
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
                ????????????????????????
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
                            "????????????",
                            "????????????????????????"
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
                ??????????????????
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
                      ToastMessage("success", "????????????", "??????????????????");
                      setCurrMailValid(false);
                      setCurrMailInput("");
                      updateUserInfo(dispatcher);
                    } else if (data.code === 2) {
                      ToastMessage("error", "????????????", "????????????????????????");
                    } else {
                      ToastMessage("error", "????????????", "??????????????????????????????");
                    }
                  });
                }}
              >
                ????????????
              </Button>
            </div>
          </div>
        </div>
        <div className="setting-row">
          <div className="column-1">
            <Title level={3}>???????????????</Title>
            <Text>???????????????????????????????????????????????????????????????????????????</Text>
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
                ????????????????????????
              </p>
              <Text style={{ color: "grey" }}>
                ???????????????????????????????????? Issue ??? Merge Request
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
                    <td>????????????</td>
                    <td>???????????????</td>
                    <td>??????</td>
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
                              ] || "- ????????? -"}
                            </td>
                            <td className={"iter-manager-column"}>
                              <a
                                onClick={() => {
                                  setCurrRemoteUrl(remote[0]);
                                  setRemoteNameResetVisible(true);
                                }}
                              >
                                ???????????????
                              </a>
                            </td>
                          </tr>
                        )
                      )}
                  <Modal
                    destroyOnClose={true}
                    title={"?????????????????????"}
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
                                "????????????",
                                "???????????????????????????"
                              );
                              setRemoteNameResetVisible(false);
                              setRemoteName("");
                              set_reload_cnt(reload_cnt + 1);
                            } else {
                              ToastMessage(
                                "error",
                                "????????????",
                                "??????????????????????????????"
                              );
                            }
                          });
                        }}
                      >
                        ????????????
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
                      ??????????????????
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
            <Title level={3}>????????????</Title>
            <Text>??????????????????????????????????????????</Text>
          </div>
          <div className="column-2">
            <div
              className="setting-card"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <p className={"register-prompt"}>
                <span style={{ color: "red" }}>* </span>
                <span style={{ color: "black" }}>???????????????</span>
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
                <span style={{ color: "black" }}>????????????</span>
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
                      setCheckError("????????? 6-20 ?????????????????????????????????");
                    } else if (
                      reg2.test(password) ||
                      reg3.test(password) ||
                      reg4.test(password) ||
                      reg5.test(password) ||
                      reg6.test(password) ||
                      reg7.test(password)
                    ) {
                      setCheckError("????????????????????????????????????????????????????????????");
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
                <span style={{ color: "black" }}>??????????????????</span>
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
                      setDoubleCheckError("??????????????????????????????????????????");
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
                      ToastMessage("success", "????????????", "????????????????????????");
                    } else {
                      ToastMessage("error", "????????????", "?????????????????????");
                    }
                  })
                  .catch(() => {
                    ToastMessage("error", "????????????", "?????????????????????");
                  });
              }}
            >
              ????????????
            </Button>
          </div>
        </div>
      </div>
    </Home>
  );
};

export default PersonalSetting;
