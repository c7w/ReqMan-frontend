import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";
import {
  Avatar,
  Button,
  Input,
  Modal,
  Select,
  Tooltip,
  Typography,
  Upload,
} from "antd";
import request_json from "../../utils/Network";
import API from "../../utils/APIList";
import { ToastMessage } from "../../utils/Navigation";
import ImgCrop from "antd-img-crop";
import React, { ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProjectStore } from "../../store/slices/ProjectSlice";
import { useParams } from "react-router-dom";
import { MailOutlined } from "@ant-design/icons";
import { Iteration } from "../../store/ConfigureStore";
import moment from "moment";
import { getRepoStore } from "../../store/slices/RepoSlice";
import { createRepoInfo, deleteRepoInfo } from "../../store/functions/RDTS";
import MDEditor from "@uiw/react-md-editor";
import { compressBase64Image } from "../../utils/ImageCompressor";
import { updateUserInfo } from "../../store/functions/UMS";

interface CreateRepoModalProps {
  close: () => void;
  visible: boolean;
}

const CreateRepoModal = (props: CreateRepoModalProps) => {
  const params = useParams<"id">();
  const project_id = Number(params.id);
  const dispatcher = useDispatch();

  const [remoteId, setRemoteId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [base_url, setBaseUrl] = useState("https://gitlab.secoder.net");
  const [title, setTitle] = useState("");

  const submit = () => {
    // Judge if base_url is valid
    if (base_url.length === 0) {
      ToastMessage("error", "添加失败", "请输入正确的远程仓库地址");
      return;
    }

    // Regex 1: starts with http/https
    // Regex 2: starts with http/https and ends with /
    const regex1 = /^(http|https):\/\//;
    const regex2 = /^(http|https):\/\/[^\/]+\//;

    if (!regex1.test(base_url) || regex2.test(base_url)) {
      ToastMessage("error", "添加失败", "请输入正确的远程仓库地址");
      return;
    }

    createRepoInfo(
      dispatcher,
      project_id,
      remoteId,
      accessToken,
      title,
      base_url
    ).then((res: any) => {
      if (res.code === 0) {
        ToastMessage("success", "添加成功", "远程仓库添加成功");
        props.close();
      }
    });
  };

  return (
    <Modal
      visible={props.visible}
      onCancel={() => props.close()}
      destroyOnClose={true}
      title={"创建远程仓库"}
      width={"40vw"}
      footer={
        <Button
          type={"primary"}
          disabled={
            !(
              title.trim() !== "" &&
              accessToken?.trim() !== "" &&
              remoteId.trim() !== ""
            )
          }
          onClick={submit}
        >
          确认提交
        </Button>
      }
    >
      <div>
        <p style={{ marginTop: "1rem", marginBottom: "0.2rem" }}>仓库名称：</p>
        <Input value={title} onChange={(evt) => setTitle(evt.target.value)} />
        <p style={{ marginTop: "1rem", marginBottom: "0.2rem" }}>仓库类型：</p>
        <Select defaultValue={"gitlab"} disabled={true}>
          <Select.Option value={"gitlab"}>GitLab</Select.Option>
        </Select>
        <p style={{ marginTop: "1rem", marginBottom: "0.2rem" }}>仓库地址：</p>
        <Input
          defaultValue={"https://gitlab.secoder.net"}
          onChange={(evt) => setBaseUrl(evt.target.value)}
        />{" "}
        <p style={{ marginTop: "1rem", marginBottom: "0.2rem" }}>仓库 ID：</p>
        <Input
          value={remoteId}
          placeholder={"示例：467"}
          onChange={(evt) => setRemoteId(evt.target.value)}
        />{" "}
        <p style={{ marginTop: "1rem", marginBottom: "0.2rem" }}>
          仓库 Access Token：
        </p>
        <Input
          value={accessToken}
          onChange={(evt) => {
            setAccessToken(evt.target.value);
          }}
        />
        <p style={{ marginTop: "1rem", marginBottom: "0.2rem" }}>
          仓库地址示例：
          <span
            style={{
              color: "red",
            }}
          >
            https://gitlab.secoder.net
          </span>
          ，结尾不加 /
        </p>
      </div>
    </Modal>
  );
};

const UIProjectSetting = () => {
  const projectStore = useSelector(getProjectStore);
  const repoStore = useSelector(getRepoStore);

  const [fileList, setFileList] = useState([]);
  const [avatarEditor, setAvatarEditor] = useState(false);
  const [avatarDelete, setAvatarDelete] = useState(false);
  const [invitation, setInvitation] = useState("");

  const [createRepoModalVisible, setCreateRepoModalVisible] = useState(false);

  const params = useParams<"id">();
  const project_id = params.id;
  const dispatcher = useDispatch();

  const getProjectAvatar = (projectStore: string): string => {
    if (projectStore === "" || JSON.parse(projectStore).code !== 0) {
      return "https://s2.loli.net/2022/03/28/IyrFghsLGz3WlbO.png";
    }
    const projectInfo = JSON.parse(projectStore);
    if (projectInfo.data.project.avatar.length < 5) {
      return "https://s2.loli.net/2022/03/28/IyrFghsLGz3WlbO.png";
    } else {
      return projectInfo.data.project.avatar;
    }
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
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      compressBase64Image(reader.result as string).then((result: any) => {
        request_json(API.UPLOAD_PROJECT_AVATAR, {
          body: { avatar: result, project: project_id },
        })
          .then((data) => {
            if (data.code === 0) {
              ToastMessage("success", "上传成功", "项目 Logo 上传成功");
              window.location.reload();
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

  const onChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
  };

  useEffect(() => {
    // Update invitation field
    request_json(API.GET_PROJECT_INVITATION, {
      body: { project: project_id },
    }).then((data) => {
      if (data.code === 0) {
        setInvitation(data.data.invitation);
      }
    });
  }, []);

  return (
    <div className={"personal-setting-container"}>
      <div
        style={{
          fontSize: "2rem",
          marginLeft: "1rem",
          userSelect: "none",
          alignSelf: "flex-start",
        }}
      >
        项目设置
      </div>
      <hr style={{ width: "98%", margin: "1rem auto" }} />
      <div className="setting-row">
        <div className="column-1">
          <Title level={3}>项目 Logo</Title>
          <Text>您可以在这里修改项目 Logo</Text>
        </div>
        <div className="column-2">
          <div
            className="setting-card"
            style={{ display: "flex", flexDirection: "row" }}
          >
            <Avatar src={getProjectAvatar(projectStore)} size={100}></Avatar>
            <div
              style={{
                marginLeft: "1rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
              }}
            >
              <Title level={5}>Logo 修改</Title>
              <div>
                <Modal
                  closable={false}
                  title={"删除 Logo"}
                  visible={avatarDelete}
                  onCancel={() => setAvatarDelete(false)}
                  footer={
                    <Button
                      danger={true}
                      onClick={() => {
                        request_json(API.UPLOAD_PROJECT_AVATAR, {
                          body: { avatar: "X", project: project_id },
                        })
                          .then((data) => {
                            if (data.code === 0) {
                              ToastMessage(
                                "success",
                                "删除成功",
                                "您的 Logo 删除成功"
                              );
                              window.location.reload();
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
                  您确定要删除 Logo 吗？
                </Modal>

                <ImgCrop
                  rotate
                  modalTitle={"修改 Logo"}
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
                    <Button type={"primary"}>修改 Logo</Button>
                  </Upload>
                </ImgCrop>
                <Button
                  style={{ marginLeft: "1rem" }}
                  danger={true}
                  onClick={() => setAvatarDelete(true)}
                >
                  删除 Logo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="setting-row">
        <div className="column-1">
          <Title level={3}>项目邀请码</Title>
          <Text>您可以在这里管理项目邀请码</Text>
          <br />
          <Text>用户通过输入邀请码加入项目，成为开发工程师</Text>
        </div>
        <div className="column-2">
          <div
            className="setting-card"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <p
              className={"register-prompt"}
              style={{ marginBottom: "0.2rem", marginTop: "1rem" }}
            >
              当前项目邀请码：
            </p>
            <div>
              <Input
                className={"setting-input"}
                size={"large"}
                prefix={<MailOutlined />}
                type="text"
                disabled={true}
                placeholder=""
                value={invitation}
                bordered={false}
              />
            </div>
            <div
              style={{
                marginTop: "1rem",
              }}
            >
              <Button
                type={"primary"}
                style={{ marginRight: "1rem" }}
                onClick={() => {
                  navigator.clipboard.writeText(invitation).then((r) => {
                    ToastMessage("success", "复制成功", "项目邀请码复制成功");
                  });
                }}
              >
                点击复制
              </Button>
              <Button
                type={"primary"}
                onClick={() => {
                  request_json(API.REFRESH_PROJECT_INVITATION, {
                    body: { project: project_id },
                  }).then((data) => {
                    setInvitation(data.data.invitation);
                  });
                }}
              >
                点击刷新
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="setting-row">
        <div className="column-1">
          <Title level={3}>项目仓库</Title>
          <Text>您可以在这里管理项目下属 GitLab 仓库</Text>
          <br />
          <br />
          <Text>两种令牌的具体配置教程详见开发者文档</Text>
        </div>
        <div className="column-2">
          <div
            className="setting-card"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <div>
              <Button
                type={"primary"}
                onClick={() => setCreateRepoModalVisible(true)}
              >
                添加远程仓库
              </Button>
              <CreateRepoModal
                close={() => setCreateRepoModalVisible(false)}
                visible={createRepoModalVisible}
              />
              <br />
              <br />
              <Text>
                Access Token 用于定时主动拉取仓库信息，在 项目设置 &gt; 访问令牌
                中维护
              </Text>
              <br />
              <br />
              <Text>
                Secret Token 用于被动收取仓库 Webhooks 推送信息，在 项目设置
                &gt; Webhooks 中维护，即时性较强
              </Text>
              <br />
            </div>
            <br />
            <table
              width={"98%"}
              style={{
                margin: "0 auto 1rem",
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
                  <td>仓库编号</td>
                  <td>仓库名</td>
                  <td>Secret Token</td>
                  <td>操作</td>
                </tr>
              </thead>
              <tbody>
                {JSON.parse(repoStore).data.map((repo: any) => {
                  return (
                    <tr
                      key={repo.id}
                      style={{
                        borderWidth: "1px",
                        padding: "8px",
                        borderStyle: "solid",
                        borderColor: "#666666",
                        backgroundColor: "#ffffff",
                      }}
                    >
                      <td className={"iter-manager-column"}>{repo.id}</td>
                      <td className={"iter-manager-column"}>{repo.title}</td>
                      <td className={"iter-manager-column"}>
                        <a
                          onClick={() => {
                            navigator.clipboard
                              .writeText(repo.remote.secret_token)
                              .then((r) => {
                                ToastMessage(
                                  "success",
                                  "复制成功",
                                  "Secret Token 复制成功"
                                );
                              });
                          }}
                        >
                          点击复制
                        </a>
                      </td>
                      <td className={"iter-manager-column"}>
                        <a
                          onClick={() => {
                            request_json(API.TEST_ACCESS_TOKEN, {
                              getParams: {
                                project: project_id,
                                repository: repo.id,
                              },
                            })
                              .then((data: any) => {
                                if (data.data.status === 200) {
                                  ToastMessage(
                                    "success",
                                    "测试成功",
                                    "成功对接到远程仓库"
                                  );
                                } else {
                                  ToastMessage(
                                    "error",
                                    "测试失败",
                                    "网络错误或令牌无权限"
                                  );
                                }
                              })
                              .catch((data: any) => {
                                ToastMessage(
                                  "error",
                                  "测试失败",
                                  "网络错误或令牌无权限"
                                );
                              });
                          }}
                        >
                          测试
                        </a>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <a
                          onClick={() => {
                            deleteRepoInfo(
                              dispatcher,
                              Number(project_id),
                              repo.id
                            ).then((res: any) => {
                              if (res.code === 0) {
                                ToastMessage(
                                  "success",
                                  "删除成功",
                                  "远端仓库删除成功"
                                );
                              }
                            });
                          }}
                        >
                          删除
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UIProjectSetting;
