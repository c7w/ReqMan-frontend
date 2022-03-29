import React, { Key, useState } from "react";
import type { ProColumns } from "@ant-design/pro-table";
import { EditableProTable } from "@ant-design/pro-table";
import { Modal, Progress } from "antd";
import { IRCard } from "../../store/ConfigureStore";
import "./UIIRList.css";
import SRList from "./UISRList";
import { useDispatch } from "react-redux";
import { createIRInfo, deleteIRInfo } from "../../store/functions/RMS";

interface UIIRListProps {
  readonly project_id: number;
  readonly IRListStr: string;
  readonly userInfo: string;
}

/*
IRListData example:
[
  {id: 1, project: 2, title: 'I am the first IR', description: 'hahahahahahah', rank: 1, ...}
  {id: 1, project: 2, title: 'I am the first IR', description: 'hahahahahahah', rank: 1, ...}
  {id: 1, project: 2, title: 'I am the first IR', description: 'hahahahahahah', rank: 1, ...}
]
*/

const UIIRList = (props: UIIRListProps) => {
  const IRListData = JSON.parse(props.IRListStr).data;
  const userData = JSON.parse(props.userInfo);
  const dispatcher = useDispatch();
  // console.log(IRListData);

  const dataIRList: IRCard[] = [];
  IRListData.forEach((value: any, index: number) => {
    dataIRList.push({
      id: value.id,
      project: value.project,
      title: value.title,
      description: value.description,
      rank: value.rank,
      createdBy: value.createdBy,
      createdAt: value.createdAt * 1000,
      disabled: value.disabled,
      curSRKey: value.curSRKey,
    });
  });
  const [tableListDataSource, settableListDataSource] =
    useState<IRCard[]>(dataIRList);
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

  const handleSave = (record: IRCard) => {
    createIRInfo(dispatcher, props.project_id, record);
  };

  const handleDelete = (record: IRCard) => {
    deleteIRInfo(dispatcher, props.project_id, record);
  };

  const expandedRowRender = (rowKey: IRCard) => {
    return (
      <SRList
        showChoose={false}
        myIRKey={rowKey.id}
        curSRKey={rowKey.curSRKey}
        project_id={Number(props.project_id)}
        SRListStr={""}
        userInfo={props.userInfo}
      />
    );
  };

  const columns: ProColumns<IRCard>[] = [
    {
      title: "IR标题",
      width: 100,
      dataIndex: "title",
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
      dataIndex: "description",
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
      align: "center",
      editable: false,
      // test
      render: (_, record) => <Progress percent={50} />,
    },
    {
      title: "创建者",
      width: 80,
      dataIndex: "createdBy",
      align: "center",
      editable: false,
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
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
        <a
          onClick={() => {
            showModal(record.id, record.curSRKey);
          }}
        >
          关联SR
        </a>,
      ],
    },
  ];

  return (
    <div className={`IRTable`}>
      <EditableProTable<IRCard>
        columns={columns}
        // dataSource={temp}
        request={() => {
          return Promise.resolve({
            data: tableListDataSource,
            success: true,
          });
        }}
        rowKey="id"
        expandable={{ expandedRowRender }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
        }}
        editable={{
          type: "multiple",
          onSave: async (key: any, record: IRCard): Promise<void> => {
            handleSave(record);
          },
          onDelete: async (key: any, record: IRCard): Promise<void> => {
            handleDelete(record);
          },
        }}
        recordCreatorProps={{
          record: (index: number) => ({
            id: index,
            project: props.project_id,
            title: "",
            description: "",
            rank: 1,
            createdBy: userData.name,
            createdAt: Date.now(),
            disabled: false,
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
        <SRList
          showChoose={true}
          myIRKey={modalIRKey}
          curSRKey={modalSRKey}
          project_id={Number(props.project_id)}
          SRListStr={""}
          userInfo={props.userInfo}
        />
      </Modal>
    </div>
  );
};

export default UIIRList;
