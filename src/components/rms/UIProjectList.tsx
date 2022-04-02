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
} from "antd";
import "./UIProjectList.css";
import ProList from "@ant-design/pro-list";
import ReactMarkdown from "react-markdown";
import { useDispatch } from "react-redux";
import { ProjectInfo } from "../../store/ConfigureStore";
import moment from "moment";
import { Redirect, ToastMessage } from "../../utils/Navigation";
import { createProject } from "../../store/functions/UMS";
import InfiniteScroll from "react-infinite-scroll-component";
import { data } from "jquery";
const { TextArea } = Input;

interface ProjectListProps {
  readonly userInfo: string;
}

const UIProjectList = (props: ProjectListProps) => {
  // 总任务列表
  console.log(JSON.parse(props.userInfo).data);
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
      avatar: img,
    });
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    const newProject: ProjectInfo = {
      id: -1,
      title: newTitle,
      description: newDesc,
      invitation: "",
      createdAt: 0,
      avatar: "",
    };
    createProject(dispatcher, newProject).then((data) => {
      if (data.code === 0) {
        ToastMessage("success", "创建成功", "您的项目创建成功");
        // setTimeout(() => window.location.reload(), 1000);
      } else {
        ToastMessage("error", "创建失败", "您的项目创建失败");
      }
    });
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div
      className={"prjlist"}
      id="scrollableDiv"
      style={{
        overflow: "auto",
        padding: "0 16px",
        border: "1px solid rgba(140, 140, 140, 0.35)",
      }}
    >
      <InfiniteScroll
        dataLength={dataProjectList.length}
        next={() => {
          return;
        }}
        hasMore={false}
        loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
        scrollableTarget="scrollableDiv"
      >
        <ProList<ProjectInfo>
          toolBarRender={() => {
            return [
              <Button onClick={showModal} key="add" type="primary">
                新建项目
              </Button>,
            ];
          }}
          onRow={(record: ProjectInfo) => {
            return {
              onClick: () => {
                const url = "/project/" + record.id;
                Redirect(dispatcher, url, 0);
              },
            };
          }}
          rowKey="id"
          headerTitle="项目列表"
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
              render: (record: ReactNode, item: ProjectInfo) => (
                <div
                  style={{
                    width: "100%",
                    marginLeft: "200px",
                    fontSize: "15px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "flex",
                  }}
                >
                  <ReactMarkdown children={item.description} />
                </div>
              ),
            },
            actions: {
              render: () => {
                return [<a key="init">邀请</a>];
              },
            },
          }}
        />
      </InfiniteScroll>
      <Modal
        title="添加新项目"
        centered={true}
        width={"70%"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p
          style={{ paddingTop: "10px", marginBottom: "5px", fontSize: "16px" }}
        >
          项目名称
        </p>
        <Input
          onChange={(e) => {
            setNewTitle(e.target.value);
          }}
        />
        <p
          style={{ paddingTop: "10px", marginBottom: "5px", fontSize: "16px" }}
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
    </div>
  );
};

export default UIProjectList;
