import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";
import { Avatar, Button, Input, Modal, Select, Tooltip, Upload } from "antd";
import request_json from "../../utils/Network";
import API from "../../utils/APIList";
import { ToastMessage } from "../../utils/Navigation";
import ImgCrop from "antd-img-crop";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getProjectStore } from "../../store/slices/ProjectSlice";
import { useParams } from "react-router-dom";
import { MailOutlined } from "@ant-design/icons";

const UIProjectSetting = () => {
  const projectStore = useSelector(getProjectStore);

  const [fileList, setFileList] = useState([]);
  const [avatarEditor, setAvatarEditor] = useState(false);
  const [avatarDelete, setAvatarDelete] = useState(false);
  const [invitation, setInvitation] = useState("");

  const params = useParams<"id">();
  const project_id = params.id;

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
      request_json(API.UPLOAD_PROJECT_AVATAR, {
        body: { project: project_id, avatar: reader.result },
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
                <Button danger={true} onClick={() => setAvatarDelete(true)}>
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
            <div style={{ marginTop: "1rem" }}>
              <Button
                type={"primary"}
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
              特性正在开发中
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UIProjectSetting;
