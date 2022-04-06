import React, { ReactElement, useEffect, useState } from "react";
import type { ProColumns } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import {
  Input,
  Button,
  Modal,
  Progress,
  InputNumber,
  Popconfirm,
  message,
  Space,
} from "antd";
import {
  IRCard,
  IRSRAssociation,
  SRCardProps,
} from "../../store/ConfigureStore";
import "./UIIRList.css";
import SRList from "./UISRList";
import { useDispatch, useSelector } from "react-redux";
import {
  createIRInfo,
  deleteIRInfo,
  updateIRInfo,
} from "../../store/functions/RMS";
import { ToastMessage } from "../../utils/Navigation";
import ReactMarkdown from "react-markdown";
import {
  Iteration2SR,
  oneIR2AllSR,
  SRId2SRInfo,
  userId2UserInfo,
} from "../../utils/Association";
import { getSRIterationStore } from "../../store/slices/IterationSlice";
import { getSRListStore } from "../../store/slices/IRSRSlice";
import { getProjectStore } from "../../store/slices/ProjectSlice";
const { TextArea } = Input;

interface UIIRListProps {
  readonly project_id: number;
  readonly IRListStr: string;
  readonly userInfo: string;
  readonly SRListStr: string;
  readonly IRSRAssociation: string;
  readonly onlyShow: boolean;
}

const UIIRList = (props: UIIRListProps) => {
  const IRListData = JSON.parse(props.IRListStr).data;
  const IRSRAssociationData = JSON.parse(props.IRSRAssociation).data;
  const dispatcher = useDispatch();
  const project = props.project_id;
  const dataIRList: IRCard[] = [];
  const projectInfo = useSelector(getProjectStore);

  IRListData.forEach((value: IRCard) => {
    const user = userId2UserInfo(Number(value.createdBy), projectInfo);
    // calculate the IR Progress
    const curSRKey: number[] = [];
    IRSRAssociationData.forEach((value0: IRSRAssociation) => {
      if (value0.IR === value.id) {
        curSRKey.push(value0.SR);
      }
    });
    let totalWeight = 0;
    let curWeight = 0;
    curSRKey.forEach((value1: number) => {
      const SRInfo = SRId2SRInfo(value1, props.SRListStr);
      totalWeight += SRInfo.priority;
      if (SRInfo.state === "Done") {
        curWeight += SRInfo.priority;
      }
    });
    const curProgress = 0 | ((curWeight * 100) / totalWeight);
    dataIRList.push({
      id: value.id,
      project: value.project,
      title: value.title,
      description: value.description,
      rank: value.rank,
      createdBy: user.name,
      createdAt: value.createdAt * 1000,
      disabled: value.disabled,
      progress: curProgress,
    });
  });
  // const [tableListDataSource] = useState<IRCard[]>(dataIRList);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [isCreateModalVisible, setIsCreateModalVisible] =
    useState<boolean>(false);
  const [isSRModalVisible, setIsSRModalVisible] = useState<boolean>(false);

  const [id, setId] = useState<number>(-1);
  const [title, setTitle] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [rank, setRank] = useState<number>(1);

  const showSRModal = (record: IRCard) => {
    setId(record.id);
    setIsSRModalVisible(true);
  };

  const handleSROk = () => {
    setId(-1);
    // setTimeout(() => window.location.reload(), 1000);
    ToastMessage("success", "关联成功", "您的需求关联成功");
    setIsSRModalVisible(false);
  };

  const handleSRCancel = () => {
    setId(-1);
    // setTimeout(() => window.location.reload(), 0);
    setIsSRModalVisible(false);
  };

  const showEditModal = (record: IRCard) => {
    setId(record.id);
    setTitle(record.title);
    setDesc(record.description);
    setRank(record.rank);
    setIsEditModalVisible(true);
  };

  const handleEditOk = () => {
    const newIR: IRCard = {
      id: id,
      project: project,
      title: title,
      description: desc,
      rank: rank,
      createdBy: "", // 未用到
      createdAt: -1, // 未用到
      disabled: true, // 未用到
      progress: 0,
    };
    updateIRInfo(dispatcher, project, newIR).then((data: any) => {
      if (data.code === 0) {
        ToastMessage("success", "修改成功", "您的原始需求修改成功");
        // setTimeout(() => window.location.reload(), 1000);
        setId(-1);
        setTitle("");
        setDesc("");
        setRank(1);
        setIsEditModalVisible(false);
      } else {
        ToastMessage("error", "修改失败", "您的原始需求修改失败");
      }
    });
  };

  const handleEditCancel = () => {
    setId(-1);
    setTitle("");
    setDesc("");
    setRank(1);
    setIsEditModalVisible(false);
  };

  const showCreateModal = () => {
    setIsCreateModalVisible(true);
  };

  const handleCreateOk = () => {
    const newIR: IRCard = {
      id: id,
      project: project,
      title: title,
      description: desc,
      rank: rank,
      createdBy: "", // 未用到
      createdAt: -1, // 未用到
      disabled: true, // 未用到
      progress: 0,
    };
    createIRInfo(dispatcher, project, newIR).then((data: any) => {
      if (data.code === 0) {
        ToastMessage("success", "创建成功", "您的原始需求创建成功");
        // setTimeout(() => window.location.reload(), 1000);
        setId(-1);
        setTitle("");
        setDesc("");
        setRank(1);
        setIsCreateModalVisible(false);
      } else {
        ToastMessage("error", "创建失败", "您的原始需求创建失败");
      }
    });
  };

  const handleCreateCancel = () => {
    setId(-1);
    setTitle("");
    setDesc("");
    setRank(1);
    setIsCreateModalVisible(false);
  };

  function confirmDelete(record: IRCard) {
    deleteIRInfo(dispatcher, project, record).then((data: any) => {
      if (data.code === 0) {
        ToastMessage("success", "删除成功", "您的原始需求删除成功");
        // setTimeout(() => window.location.reload(), 1000);
        setId(-1);
        setTitle("");
        setDesc("");
        setRank(1);
        setIsCreateModalVisible(false);
      } else {
        ToastMessage("error", "删除失败", "您的原始需求删除失败");
      }
    });
  }

  const columns: ProColumns<IRCard>[] = [
    {
      title: "原始需求标题",
      width: "15%",
      dataIndex: "title",
      ellipsis: true,
      align: "center",
      render: (_, record) => (
        <div
          style={{
            fontWeight: "bold",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {record.title}
        </div>
      ),
    },
    {
      title: "原始需求描述",
      ellipsis: true,
      dataIndex: "description",
      align: "center",
      render: (_, record) => (
        <ReactMarkdown className={"markdown"} children={record.description} />
      ),
    },
    {
      title: "进度",
      width: "13%",
      align: "center",
      render: (_, record) => (
        <Progress className={"prgressProp"} percent={record.progress} />
      ),
    },
    {
      title: "创建者",
      width: "12%",
      ellipsis: true,
      dataIndex: "createdBy",
      align: "center",
    },
    {
      title: "创建时间",
      width: "15%",
      ellipsis: true,
      dataIndex: "createdAt",
      valueType: "dateTime",
      align: "center",
      sorter: (a, b) => a.createdAt - b.createdAt,
    },
    {
      title: "操作",
      width: "20%",
      valueType: "option",
      align: "center",
      render: (text, record, _, action) => [
        // 编辑内含修改删除等，须继续与后端接口适配
        <a onClick={() => showEditModal(record)}>编辑</a>,
        <Popconfirm
          title="你确定要删除该原始需求吗？"
          onConfirm={() => confirmDelete(record)}
          okText="是"
          cancelText="否"
        >
          <a href="#">删除</a>
        </Popconfirm>,
        <a onClick={() => showSRModal(record)}>关联功能需求</a>,
      ],
    },
  ];

  const expandedRowRender = (record: IRCard) => {
    return (
      <SRList
        showChoose={false}
        onlyShow={true}
        IR_id={record.id}
        project_id={props.project_id}
        SRListStr={props.SRListStr}
        userInfo={props.userInfo}
        IRSRAssociation={props.IRSRAssociation}
      />
    );
  };

  const onlyShowColumn: ProColumns<IRCard>[] = [];
  for (let i = 0; i < 5; i += 1) {
    onlyShowColumn.push(columns[i]);
  }

  if (!props.onlyShow) {
    return (
      <div className={`IRTable`}>
        <ProTable<IRCard>
          headerTitle="原始需求列表"
          toolBarRender={() => {
            return [
              <Button key="create" onClick={showCreateModal} type="primary">
                新建原始需求
              </Button>,
            ];
          }}
          cardBordered={true}
          columns={columns}
          options={{
            fullScreen: false,
            reload: false,
            setting: true,
            density: true,
          }}
          // request={() => {
          //   return Promise.resolve({
          //     data: tableListDataSource,
          //     success: true,
          //   });
          // }}
          defaultSize={"small"}
          dataSource={dataIRList}
          rowKey="id"
          pagination={false}
          // scroll={{ y: 600 }}
          tableStyle={{ padding: "1rem 1rem 2rem" }}
          dateFormatter="string"
          search={false}
        />
        <Modal
          title="功能需求关联列表"
          centered={true}
          visible={isSRModalVisible}
          onCancel={handleSRCancel}
          footer={[
            <Button key="confirm" onClick={handleSROk}>
              确认
            </Button>,
          ]}
          width={"70%"}
          destroyOnClose={true}
        >
          <SRList
            showChoose={true}
            onlyShow={false}
            project_id={props.project_id}
            SRListStr={props.SRListStr}
            userInfo={props.userInfo}
            IRSRAssociation={props.IRSRAssociation}
            IR_id={id}
          />
        </Modal>

        <Modal
          title="新增原始需求"
          centered={true}
          visible={isCreateModalVisible}
          onOk={handleCreateOk}
          onCancel={handleCreateCancel}
          width={"60vw"}
        >
          <p style={{ marginBottom: "5px", fontSize: "16px" }}>原始需求名称</p>
          <Input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <p
            style={{
              paddingTop: "10px",
              marginBottom: "5px",
              fontSize: "16px",
            }}
          >
            原始需求介绍
          </p>
          <TextArea
            rows={4}
            allowClear
            value={desc}
            onChange={(e) => {
              setDesc(e.target.value);
            }}
          />
          {/*<p*/}
          {/*  style={{ paddingTop: "10px", marginBottom: "5px", fontSize: "16px" }}*/}
          {/*>*/}
          {/*  项目重要性*/}
          {/*</p>*/}
          {/*<InputNumber*/}
          {/*  value={rank}*/}
          {/*  onChange={(e: number) => {*/}
          {/*    setRank(e);*/}
          {/*  }}*/}
          {/*/>*/}
        </Modal>

        <Modal
          title="编辑原始需求"
          centered={true}
          visible={isEditModalVisible}
          onOk={handleEditOk}
          onCancel={handleEditCancel}
          width={"70%"}
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
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
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
            allowClear
            value={desc}
            onChange={(e) => {
              setDesc(e.target.value);
            }}
          />
        </Modal>
      </div>
    );
  } else {
    return (
      <div className={`showIRTable`}>
        <ProTable<IRCard>
          headerTitle="需求展示列表"
          toolBarRender={() => {
            return [];
          }}
          options={{
            fullScreen: false,
            reload: false,
            setting: false,
            density: false,
          }}
          cardBordered={true}
          columns={onlyShowColumn}
          expandable={{ expandedRowRender }}
          dataSource={dataIRList}
          rowKey="id"
          pagination={false}
          // scroll={{ y: 400 }}
          tableStyle={{ padding: "1rem 1rem 2rem" }}
          dateFormatter="string"
          search={false}
        />
      </div>
    );
  }
};

export default UIIRList;
