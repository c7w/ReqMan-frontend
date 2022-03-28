import React, { useState } from "react";
import { Input, Modal, Space, Tag, Button, DatePicker } from "antd";
import "./UIProjectList.css";
import ProList from "@ant-design/pro-list";
import ReactMarkdown from "react-markdown";
const { TextArea } = Input;

export type TableListItem = {
  key: number;
  name: string;
  desc: string;
  invitation: string;
  status: boolean;
  createdAt: Date;
  image: string;
};

// interface ProjectListProps {
//   readonly showChoose: boolean;
//   readonly myIRKey: number;
//   readonly curProjectKey: number[];
// }

const UIProjectList = () => {
  // 总任务列表
  const dataProjectList: TableListItem[] = [];
  for (let i = 0; i < 10; i += 1) {
    dataProjectList.push({
      key: i,
      name: "My Project",
      desc: "这是一个**很长很长很长很长**有多长呢我也不知道诶怎么办的项目任务描述",
      invitation: "XRT67D53RTGFD568",
      status: true,
      createdAt: new Date(),
      image:
        "https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg",
    });
  }
  const [tableListDataSource, settableListDataSource] =
    useState<TableListItem[]>(dataProjectList);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // useEffect(() => {
  //   const curProjectList = [];
  //   for (let i = 0; i < props.curProjectKey.length; i += 1) {
  //     curProjectList.push(dataProjectList[props.curProjectKey[i]]);
  //   }
  //   // 如果是下拉表，则显示当前的关联任务
  //   if (!props.showChoose) {
  //     settableListDataSource(curProjectList);
  //   }
  // }, [1]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const createTitle = () => {
    console.log("create title!");
  };
  const createInvite = () => {
    console.log("create invite!");
  };

  const createDesc = () => {
    console.log("create desc!");
  };

  const createDate = () => {
    console.log("create date!");
  };

  return (
    <div className={"prjlist"}>
      <ProList<TableListItem>
        toolBarRender={() => {
          return [
            <Button onClick={showModal} key="add" type="primary">
              新建项目
            </Button>,
          ];
        }}
        onRow={(record: TableListItem) => {
          return {
            onClick: () => {
              console.log(record);
            },
          };
        }}
        rowKey="name"
        headerTitle="项目列表"
        dataSource={tableListDataSource}
        metas={{
          title: {
            render: (record: any, item: TableListItem) => (
              <a
                style={{
                  color: "black",
                  fontSize: "20px",
                }}
                onClick={() => {
                  console.log("title clicked");
                }}
              >
                {item.name}
              </a>
            ),
          },
          avatar: {
            dataIndex: "image",
          },
          subTitle: {
            render: (record: any, item: TableListItem) => {
              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    paddingTop: "5px",
                  }}
                >
                  <Space size={0}>
                    <Tag color="orange">邀请码：{item.invitation}</Tag>
                  </Space>
                  <Space size={0}>
                    <Tag color="green">
                      创建时间：{item.createdAt.toDateString()}
                    </Tag>
                  </Space>
                </div>
              );
            },
          },
          content: {
            render: (record: any, item: TableListItem) => (
              <div
                style={{
                  width: "auto",
                  marginLeft: "400px",
                  fontSize: "15px",
                }}
              >
                <ReactMarkdown children={item.desc} />
              </div>
            ),
          },
        }}
      />
      <Modal
        title="添加新项目"
        centered={true}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p
          style={{ paddingTop: "10px", marginBottom: "5px", fontSize: "16px" }}
        >
          项目名称
        </p>
        <Input placeholder="Input" onChange={createTitle} />
        <p
          style={{ paddingTop: "10px", marginBottom: "5px", fontSize: "16px" }}
        >
          项目邀请码
        </p>
        <Input placeholder="Input" onChange={createInvite} />
        <p
          style={{ paddingTop: "10px", marginBottom: "5px", fontSize: "16px" }}
        >
          项目介绍
        </p>
        <TextArea rows={4} allowClear onChange={createDesc} />
        <p
          style={{ paddingTop: "10px", marginBottom: "5px", fontSize: "16px" }}
        >
          创建日期
        </p>
        <DatePicker style={{ width: "50%" }} onChange={createDate} />
      </Modal>
    </div>
  );
};

export default UIProjectList;
