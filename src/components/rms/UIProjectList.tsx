import React, { ReactNode, useState } from "react";
import {
  Input,
  Modal,
  Space,
  Tag,
  Button,
  DatePicker,
  Divider,
  Skeleton,
  Breadcrumb,
} from "antd";
import "./UIProjectList.css";
import ProList from "@ant-design/pro-list";
import ReactMarkdown from "react-markdown";
import { useDispatch } from "react-redux";
import { ProjectInfo } from "../../store/ConfigureStore";
import moment from "moment";
import { Redirect, ToastMessage } from "../../utils/Navigation";
import { createProject, updateUserInfo } from "../../store/functions/UMS";
import InfiniteScroll from "react-infinite-scroll-component";
import { data } from "jquery";
import request_json from "../../utils/Network";
import API from "../../utils/APIList";
const { TextArea } = Input;

interface ProjectListProps {
  readonly userInfo: string;
  readonly justDisplay: boolean; // 是否只是展示，不需要新建项目和加入项目
}

const UIProjectList = (props: ProjectListProps) => {
  // 总任务列表
  const ProjectList = JSON.parse(props.userInfo).data.projects;
  const dispatcher = useDispatch();
  const dataProjectList: ProjectInfo[] = [];
  ProjectList.forEach((value: ProjectInfo) => {
    let img = value.avatar;
    if (value.avatar.length < 5) {
      img = "https://s2.loli.net/2022/03/28/IyrFghsLGz3WlbO.png";
    }
    dataProjectList.push({
      id: value.id,
      title: value.title,
      description: value.description,
      invitation: value.invitation,
      createdAt: value.createdAt * 1000,
      role: value.role,
      avatar: img,
    });
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const [joinModal, setJoinModal] = useState(false);
  const [invitationCode, setInvitationCode] = useState("");
  const [ifok, setIfok] = useState<boolean>(true);

  const onJoin = () => {
    const reg = /^[A-Z0-9]{8}$/;
    if (!reg.test(invitationCode)) {
      ToastMessage("error", "加入失败", "项目邀请码不合法");
    } else {
      request_json(API.JOIN_PROJECT, {
        body: { invitation: invitationCode },
      }).then((data) => {
        if (data.code === 0) {
          ToastMessage("success", "加入成功", "加入项目成功");
          updateUserInfo(dispatcher);
        } else if (data.code === 1) {
          ToastMessage("error", "加入失败", "您已经在项目中");
        } else if (data.code === 2) {
          ToastMessage("error", "加入失败", "项目邀请码不合法");
        } else {
          ToastMessage("error", "加入失败", "未知错误");
        }
      });
    }
    setInvitationCode("");
    setJoinModal(false);
  };

  const showModal = () => {
    setIsModalVisible(true);
    setIfok(true);
  };

  const handleOk = () => {
    const newProject: ProjectInfo = {
      id: -1,
      title: newTitle,
      description: newDesc,
      invitation: "",
      createdAt: 0,
      role: "",
      avatar: "",
    };
    createProject(dispatcher, newProject).then((data) => {
      if (data.code === 0) {
        ToastMessage("success", "创建成功", "您的项目创建成功");
        // setTimeout(() => window.location.reload(), 1000);
        updateUserInfo(dispatcher);
      } else {
        ToastMessage("error", "创建失败", "您的项目创建失败");
      }
    });
    setIsModalVisible(false);
    setIfok(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIfok(true);
  };

  const getRoleName = (role: string) => {
    if (role === "member") {
      return "项目成员";
    }
    if (role === "sys") {
      return "系统工程师";
    }
    if (role === "dev") {
      return "开发工程师";
    }
    if (role === "qa") {
      return "质保工程师";
    }
    if (role === "supermaster") {
      return "项目管理员";
    }
    return "";
  };

  return (
    <div>
      {(() => {
        if (!props.justDisplay) {
          return (
            <Breadcrumb style={{ margin: "1rem 0" }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>项目列表</Breadcrumb.Item>
            </Breadcrumb>
          );
        }
      })()}
      <div
        className={"prjlist"}
        id="scrollableDiv"
        style={{
          overflow: "auto",
          padding: "1rem 2rem 2rem",
          border: "1px solid rgba(140, 140, 140, 0.35)",
        }}
      >
        <ProList<ProjectInfo>
          toolBarRender={
            props.justDisplay
              ? false
              : () => {
                  return [
                    <Button
                      onClick={() => setJoinModal(true)}
                      key={"join"}
                      type={"primary"}
                    >
                      加入项目
                    </Button>,

                    <Button onClick={showModal} key="add" type="primary">
                      新建项目
                    </Button>,
                  ];
                }
          }
          onRow={(record: ProjectInfo) => {
            return {
              onClick: () => {
                const url = "/project/" + record.id;
                Redirect(dispatcher, url, 0);
              },
            };
          }}
          rowKey="id"
          headerTitle={props.justDisplay ? "" : "项目列表"}
          bordered={true}
          split={true}
          scroll={{ y: 350 }}
          dataSource={dataProjectList}
          metas={{
            title: {
              render: (record: ReactNode, item: ProjectInfo) => (
                <div
                  style={{
                    color: "black",
                    fontSize: "20px",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                  onClick={() => {
                    const url = "/project/" + item.id;
                    Redirect(dispatcher, url, 0);
                  }}
                >
                  {item.title}
                </div>
              ),
            },
            avatar: {
              render: (record: ReactNode, item: ProjectInfo) => (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                  }}
                >
                  <img src={item.avatar} />
                </div>
              ),
            },
            subTitle: {
              render: (record: ReactNode, item: ProjectInfo) => {
                return (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      paddingTop: "5px",
                    }}
                  >
                    <Space size={0}>
                      <Tag color="green">
                        创建时间：
                        {moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                      </Tag>
                    </Space>
                  </div>
                );
              },
            },
            content: {
              render: (record: ReactNode, item: ProjectInfo) =>
                props.justDisplay ? (
                  <div style={{ width: "15vw" }} />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      marginLeft: "200px",
                      fontSize: "15px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      display: "flex",
                      maxWidth: "30rem",
                    }}
                  >
                    <ReactMarkdown children={item.description} />
                  </div>
                ),
            },
            actions: {
              render: (record: ReactNode, item: ProjectInfo) => {
                return <div>{getRoleName(item.role)}</div>;
              },
            },
          }}
          style={
            props.justDisplay
              ? {
                  maxWidth: "35vw",
                  overflowY: "scroll",
                  maxHeight: "70vh",
                  paddingRight: "1rem",
                }
              : {}
          }
        />
        <Modal
          title="添加新项目"
          centered={true}
          width={"60vw"}
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          okButtonProps={{ disabled: ifok }}
          destroyOnClose={true}
        >
          <p
            style={{
              paddingTop: "10px",
              marginBottom: "5px",
              fontSize: "16px",
            }}
          >
            项目名称
          </p>
          <Input
            onChange={(e) => {
              if (e.target.value === "") {
                setIfok(true);
              }
              if (e.target.value !== "") {
                setIfok(false);
              }
              setNewTitle(e.target.value);
            }}
          />
          <p
            style={{
              paddingTop: "10px",
              marginBottom: "5px",
              fontSize: "16px",
            }}
          >
            项目介绍
          </p>
          <TextArea
            rows={4}
            onChange={(e) => {
              setNewDesc(e.target.value);
            }}
          />
        </Modal>
        <Modal
          title="加入项目"
          centered={true}
          width={"30vw"}
          visible={joinModal}
          onOk={onJoin}
          onCancel={() => {
            setJoinModal(false);
            setInvitationCode("");
          }}
          destroyOnClose={true}
        >
          <p
            style={{
              paddingTop: "10px",
              marginBottom: "5px",
              fontSize: "16px",
            }}
          >
            邀请码
          </p>
          <Input
            value={invitationCode}
            onChange={(e) => {
              setInvitationCode(e.target.value);
            }}
          />
        </Modal>
      </div>
    </div>
  );
};

export default UIProjectList;
