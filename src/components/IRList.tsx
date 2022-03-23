import React, { useState } from "react";
import type { ProColumns } from "@ant-design/pro-table";
import { EditableProTable } from "@ant-design/pro-table";
import { Modal, Progress } from "antd";
import "./IRList.css";
import SRList from "./SRList";

export type TableListItem = {
  key: number;
  name: string;
  desc: string;
  progress: number;
  creator: string;
  createdAt: number;
  curSRKey: number[]; //关联SR
};

// interface IRListProps {
//   readonly unimportant: string;
// }

const IRList = () => {
  const dataIRList: TableListItem[] = [];
  const creators = ["qc", "c7w", "hxj", "wxy", "lmd"];
  for (let i = 0; i < 30; i += 1) {
    dataIRList.push({
      key: i,
      // progress 数据须与后端刷新数据进行对接
      progress: 50,
      name: "[IR.001.002]",
      desc: "我是关于这个任务很长很长很长很长很长很长长很长很长很长长很长很长很长长很长很长很长的描述",
      creator: creators[Math.floor(Math.random() * creators.length)],
      createdAt: Date.now() - Math.floor(Math.random() * 1000000000),
      curSRKey: [i],
    });
  }
  const [tableListDataSource, settableListDataSource] =
    useState<TableListItem[]>(dataIRList);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [modalIRKey, setModalIRKey] = useState<number>(0);
  const [modalSRKey, setModalSRKey] = useState<number[]>([]);

  const showModal = (myIRKey: number, curSRKey: number[]) => {
    setModalIRKey(myIRKey);
    setModalSRKey(curSRKey);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const expandedRowRender = (rowKey: TableListItem) => {
    return (
      <SRList
        showChoose={false}
        myIRKey={rowKey.key}
        curSRKey={rowKey.curSRKey}
      />
    );
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: "IR标题",
      width: 100,
      dataIndex: "name",
      align: "center",
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项",
          },
        ],
      },
      render: (_) => <a>{_}</a>,
    },
    {
      title: "任务描述",
      width: 240,
      dataIndex: "desc",
      align: "center",
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项",
          },
        ],
      },
    },
    {
      title: "进度",
      width: 80,
      dataIndex: "creator",
      align: "center",
      editable: false,
      render: (_, record) => <Progress percent={record.progress} />,
    },
    {
      title: "创建者",
      width: 80,
      dataIndex: "creator",
      align: "center",
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项",
          },
        ],
      },
    },
    {
      title: "创建时间",
      width: 110,
      dataIndex: "createdAt",
      valueType: "dateTime",
      align: "center",
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项",
          },
        ],
      },
      sorter: (a, b) => a.createdAt - b.createdAt,
    },
    {
      title: "操作",
      width: 100,
      valueType: "option",
      align: "center",
      render: (text, record, _, action) => [
        // 编辑内含修改删除等，须继续与后端接口适配
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.key);
          }}
        >
          编辑
        </a>,
        <a
          onClick={() => {
            showModal(record.key, record.curSRKey);
          }}
        >
          关联SR
        </a>,
      ],
    },
  ];

  return (
    <div className={`IRTable`}>
      <EditableProTable<TableListItem>
        columns={columns}
        // dataSource={temp}
        request={(params, sorter, filter) => {
          return Promise.resolve({
            data: tableListDataSource,
            success: true,
          });
        }}
        rowKey="key"
        expandable={{ expandedRowRender }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
        }}
        editable={{
          type: "multiple",
        }}
        recordCreatorProps={{
          record: (index: number) => ({
            key: index,
            name: "",
            desc: "",
            progress: 0,
            creator: "",
            createdAt: Date.now(),
            curSRKey: [],
          }),
          position: "top",
          creatorButtonText: "新增 IR 任务",
        }}
        dateFormatter="string"
      />
      <Modal
        title="SR 任务关联列表"
        centered={true}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={"70%"}
      >
        <SRList showChoose={true} myIRKey={modalIRKey} curSRKey={modalSRKey} />
      </Modal>
    </div>
  );
};

export default IRList;
