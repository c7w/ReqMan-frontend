import React, { useState } from "react";
import type { ProColumns } from "@ant-design/pro-table";
import { EditableProTable } from "@ant-design/pro-table";
import { Button, Modal, Progress } from "antd";
import { IRCard } from "../../store/ConfigureStore";
import "./UIIRList.css";
import SRList from "./SRList";
import { useDispatch } from "react-redux";
import { createIRInfo, deleteIRInfo } from "../../store/functions/RMS";

interface IRListProps {
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

const UIIRList = (props: IRListProps) => {
  const IRListData = JSON.parse(props.IRListStr).data;
  // const userData = JSON.parse(props.userInfo);
  const dispatcher = useDispatch();
  // console.log(IRListData);

  const dataIRList: IRCard[] = [];
  IRListData.forEach((value: IRCard) => {
    dataIRList.push({
      id: value.id,
      project: value.project,
      title: value.title,
      description: value.description,
      rank: value.rank,
      createdBy: value.createdBy,
      createdAt: value.createdAt * 1000,
      disabled: value.disabled,
      curSRKey: [0, 1, 2],
    });
  });
  const [tableListDataSource] = useState<IRCard[]>(dataIRList);
  const [isSRModalVisible, setIsSRModalVisible] = useState<boolean>(false);
  const [isCreateModalVisible, setIsCreateModalVisible] =
    useState<boolean>(false);
  const [modalIRKey, setModalIRKey] = useState<number>(0);
  const [modalSRKey, setModalSRKey] = useState<number[]>([]);

  const showSRModal = (myIRKey: number, curSRKey: number[]) => {
    setModalIRKey(myIRKey);
    setModalSRKey(curSRKey);
    setIsSRModalVisible(true);
  };

  const handleSROk = () => {
    setIsSRModalVisible(false);
  };

  const handleSRCancel = () => {
    setIsSRModalVisible(false);
  };

  const showCreateModal = () => {
    setIsCreateModalVisible(true);
  };

  const handleCreateOk = () => {
    setIsCreateModalVisible(false);
  };

  const handleCreateCancel = () => {
    setIsCreateModalVisible(false);
  };

  const handleSave = (record: IRCard) => {
    createIRInfo(dispatcher, props.project_id, record);
  };

  const handleDelete = (record: IRCard) => {
    deleteIRInfo(dispatcher, props.project_id, record);
  };

  const expandedRowRender = (rowKey: IRCard) => {
    return (
      <SRList showChoose={false} myIRKey={rowKey.id} curSRKey={[0, 1, 2]} />
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
            showSRModal(record.id, [1, 2, 3]);
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
        toolBarRender={() => {
          return [
            <Button onClick={showCreateModal} key="add" type="primary">
              新建IR
            </Button>,
          ];
        }}
        columns={columns}
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
        dateFormatter="string"
      />
      <Modal
        title="SR 任务关联列表"
        centered={true}
        visible={isSRModalVisible}
        onOk={handleSROk}
        onCancel={handleSRCancel}
        width={"70%"}
      >
        <SRList showChoose={true} myIRKey={modalIRKey} curSRKey={modalSRKey} />
      </Modal>
      {/*<Modal*/}
      {/*  title="新增IR任务"*/}
      {/*  centered={true}*/}
      {/*  visible={isCreateModalVisible}*/}
      {/*  onOk={handleCreateOk}*/}
      {/*  onCancel={handleCreateCancel}*/}
      {/*  width={"70%"}*/}
      {/*>*/}
      {/*  <p*/}
      {/*    style={{ paddingTop: "10px", marginBottom: "5px", fontSize: "16px" }}*/}
      {/*  >*/}
      {/*    项目名称*/}
      {/*  </p>*/}
      {/*  <Input placeholder="Input" onChange={createTitle} />*/}
      {/*  <p*/}
      {/*    style={{ paddingTop: "10px", marginBottom: "5px", fontSize: "16px" }}*/}
      {/*  >*/}
      {/*    项目邀请码*/}
      {/*  </p>*/}
      {/*  <Input placeholder="Input" onChange={createInvite} />*/}
      {/*  <p*/}
      {/*    style={{ paddingTop: "10px", marginBottom: "5px", fontSize: "16px" }}*/}
      {/*  >*/}
      {/*    项目介绍*/}
      {/*  </p>*/}
      {/*  <TextArea rows={4} allowClear onChange={createDesc} />*/}
      {/*  <p*/}
      {/*    style={{ paddingTop: "10px", marginBottom: "5px", fontSize: "16px" }}*/}
      {/*  >*/}
      {/*    创建日期*/}
      {/*  </p>*/}
      {/*  <DatePicker style={{ width: "50%" }} onChange={createDate} />*/}
      {/*</Modal>*/}
    </div>
  );
};

export default UIIRList;
