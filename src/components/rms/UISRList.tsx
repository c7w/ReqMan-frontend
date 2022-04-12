import React, { ReactElement, useEffect, useState } from "react";
import type { ProColumns } from "@ant-design/pro-table";
import ReactMarkdown from "react-markdown";
import ProTable, { ProColumnType } from "@ant-design/pro-table";
import {
  Button,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Tag,
} from "antd";
import "./UISRList.css";
import { useDispatch, useSelector } from "react-redux";
import {
  IRSRAssociation,
  Iteration,
  SRCardProps,
  SRService,
} from "../../store/ConfigureStore";
import {
  createIRSR,
  createSRInfo,
  createSRIteration,
  createSRService,
  createUserSRInfo,
  deleteIRSR,
  deleteSRInfo,
  deleteSRIteration,
  deleteSRService,
  deleteUserSRInfo,
  updateSRInfo,
} from "../../store/functions/RMS";
import { ToastMessage } from "../../utils/Navigation";
import { getProjectStore } from "../../store/slices/ProjectSlice";
import {
  SR2ChargedUser,
  SR2Iteration,
  SR2Service,
  userId2UserInfo,
} from "../../utils/Association";
import {
  getIterationStore,
  getSRIterationStore,
} from "../../store/slices/IterationSlice";
import {
  getServiceStore,
  getSRServiceStore,
} from "../../store/slices/ServiceSlice";
import { difference } from "underscore";
import { Service } from "./UIServiceReadonly";
import { getUserSRStore } from "../../store/slices/UserSRSlice";
const { TextArea } = Input;
const { Option } = Select;

interface UISRListProps {
  readonly showChoose: boolean;
  readonly onlyShow: boolean;
  readonly project_id: number;
  readonly SRListStr: string;
  readonly userInfo: string;
  readonly IRSRAssociation: string;
  readonly IR_id: number;
}

const UISRList = (props: UISRListProps) => {
  const SRListData = JSON.parse(props.SRListStr).data;
  const IRSRAssociationData = JSON.parse(props.IRSRAssociation).data;

  const dispatcher = useDispatch();
  const project = props.project_id;
  const projectInfo = useSelector(getProjectStore);

  const iterationStore = useSelector(getIterationStore);
  const iterSRAssoStore = useSelector(getSRIterationStore);

  const serviceStore = useSelector(getServiceStore);
  const SRServiceStore = useSelector(getSRServiceStore);

  const userSRStore = useSelector(getUserSRStore);

  const curSRKey: number[] = [];
  if (props.IR_id !== -1) {
    IRSRAssociationData.forEach((value: IRSRAssociation) => {
      if (value.IR === props.IR_id) {
        curSRKey.push(value.SR);
      }
    });
  }

  // 总任务列表
  const dataSRList: SRCardProps[] = [];
  const titleFilter: any = {};
  SRListData.forEach((value: any) => {
    let state = "";
    let color = "";
    if (value.state === "TODO") {
      state = "未开始";
      color = "red";
    }
    if (value.state === "WIP") {
      state = "开发中";
      color = "blue";
    }
    if (value.state === "Reviewing") {
      state = "测试中";
      color = "lime";
    }
    if (value.state === "Done") {
      state = "已交付";
      color = "green";
    }
    if (titleFilter[value.title] === undefined) {
      const curtitle = { text: value.title };
      titleFilter[value.title] = curtitle;
    }

    const user = userId2UserInfo(Number(value.createdBy), projectInfo);
    dataSRList.push({
      id: value.id,
      project: value.project,
      title: value.title,
      description: value.description,
      priority: value.priority,
      currState: state,
      stateColor: color,
      createdBy: user.name,
      createdAt: value.createdAt * 1000,
      iter: SR2Iteration(value.id, iterSRAssoStore, iterationStore),
      chargedBy:
        SR2ChargedUser(value.id, userSRStore, projectInfo).length > 0
          ? SR2ChargedUser(value.id, userSRStore, projectInfo)[0].id
          : -1,
      service:
        SR2Service(value.id, SRServiceStore, serviceStore).length > 0
          ? SR2Service(value.id, SRServiceStore, serviceStore)[0].id
          : -1,
    });
  });

  const showSRList: SRCardProps[] = [];
  const showTitleFilter: any = {};
  SRListData.forEach((value: any) => {
    curSRKey.forEach((curValue: number) => {
      if (curValue === value.id) {
        let state = "";
        let color = "";
        if (value.state === "TODO") {
          state = "未开始";
          color = "red";
        }
        if (value.state === "WIP") {
          state = "开发中";
          color = "blue";
        }
        if (value.state === "Reviewing") {
          state = "测试中";
          color = "lime";
        }
        if (value.state === "Done") {
          state = "已交付";
          color = "green";
        }
        const user = userId2UserInfo(Number(value.createdBy), projectInfo);
        if (showTitleFilter[value.title] === undefined) {
          const curtitle = { text: value.title };
          showTitleFilter[value.title] = curtitle;
        }
        showSRList.push({
          id: value.id,
          project: value.project,
          title: value.title,
          description: value.description,
          priority: value.priority,
          currState: state,
          stateColor: color,
          createdBy: user.name,
          createdAt: value.createdAt * 1000,

          iter: SR2Iteration(value.id, iterSRAssoStore, iterationStore),
          chargedBy: SR2ChargedUser(value.id, userSRStore, projectInfo),
          service:
            SR2Service(value.id, SRServiceStore, serviceStore).length > 0
              ? SR2Service(value.id, SRServiceStore, serviceStore)[0].id
              : -1,
        });
      }
    });
  });

  const [tableListDataSource, settableListDataSource] =
    useState<SRCardProps[]>(dataSRList);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [isCreateModalVisible, setIsCreateModalVisible] =
    useState<boolean>(false);
  const [id, setId] = useState<number>(-1);
  const [title, setTitle] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [priority, setPriority] = useState<number>(1);
  const [currState, setCurrState] = useState<string>("未开始");
  const [iter, setIter] = useState<number[]>([]);
  const [chargedBy, setChargedBy] = useState<number>(-1);
  const [service, setService] = useState<number>(-1);

  const showEditModal = (record: SRCardProps) => {
    setId(record.id);
    setTitle(record.title);
    setDesc(record.description);
    setPriority(record.priority);
    setCurrState(record.currState);
    setIter(record.iter?.map((iter: Iteration) => iter.id as number));
    setChargedBy(record.chargedBy);
    setService(record.service as number);
    setIsEditModalVisible(true);
  };

  const handleEditOk = () => {
    let state = "";
    if (currState === "未开始") {
      state = "TODO";
    }
    if (currState === "开发中") {
      state = "WIP";
    }
    if (currState === "测试中") {
      state = "Reviewing";
    }
    if (currState === "已交付") {
      state = "Done";
    }
    const newSR: SRCardProps = {
      id: id,
      project: project,
      title: title,
      description: desc,
      priority: priority,
      currState: state,
      iter: [],
      chargedBy: chargedBy,
      service: service,
    };

    // Update associations
    // Iteration association
    const lastIteration = SR2Iteration(id, iterSRAssoStore, iterationStore).map(
      (iter: Iteration) => iter.id
    );
    const currIteration = iter;
    const deletedIteration = difference(lastIteration, currIteration);
    const associatedIteration = difference(currIteration, lastIteration);
    deletedIteration.forEach((iter_id: number) => {
      deleteSRIteration(dispatcher, project, {
        SRId: id,
        iterationId: iter_id,
        id: -1,
      });
    });
    associatedIteration.forEach((iter_id: number) => {
      createSRIteration(dispatcher, project, {
        SRId: id,
        iterationId: iter_id,
        id: -1,
      });
    });

    // Service association
    const lastService = SR2Service(id, SRServiceStore, serviceStore).map(
      (service: any) => service.id
    );
    const currService = service;

    const delete_promises: Promise<any>[] = [];
    lastService.forEach((service: number) => {
      delete_promises.push(
        deleteSRService(dispatcher, project, {
          SRId: id,
          serviceId: service,
          id: -1,
        })
      );
    });
    Promise.all(delete_promises).then(() => {
      if (currService !== -1) {
        createSRService(dispatcher, project, {
          SRId: id,
          serviceId: currService,
          id: -1,
        });
      }
    });

    // ChargedBy Association
    const lastChargedBy = SR2ChargedUser(id, userSRStore, projectInfo).map(
      (user: any) => user.id
    );
    const currChargedBy = chargedBy;
    const delete_promises_: Promise<any>[] = [];
    lastChargedBy.forEach((user: number) => {
      delete_promises_.push(
        deleteUserSRInfo(dispatcher, project, {
          sr: id,
          user: user,
          id: -1,
        })
      );
    });
    Promise.all(delete_promises_).then(() => {
      if (currChargedBy !== -1) {
        createUserSRInfo(dispatcher, project, {
          sr: id,
          user: currChargedBy,
          id: -1,
        });
      }
    });

    // Main SR Info
    updateSRInfo(dispatcher, project, newSR).then((data: any) => {
      if (data.code === 0) {
        ToastMessage("success", "修改成功", "您的功能需求修改成功");
        // setTimeout(() => window.location.reload(), 1000);
        setId(-1);
        setTitle("");
        setDesc("");
        setPriority(1);
        setCurrState("未开始");
        setIter([]);
        setChargedBy(-1);
        setService(-1);
        setIsEditModalVisible(false);
      } else {
        ToastMessage("error", "修改失败", "您的功能需求修改失败");
      }
    });
  };

  const handleEditCancel = () => {
    setId(-1);
    setTitle("");
    setDesc("");
    setPriority(1);
    setCurrState("未开始");
    setIsEditModalVisible(false);
    setIter([]);
    setChargedBy(-1);
    setService(-1);
  };

  const showCreateModal = () => {
    setIsCreateModalVisible(true);
  };

  // Handle create
  const handleCreateOk = () => {
    const newSR: SRCardProps = {
      id: id,
      project: project,
      title: title,
      description: desc,
      priority: priority,
      currState: "TODO",
      iter: [],
      chargedBy: -1,
      service: service,
    };

    createSRInfo(dispatcher, project, newSR).then((data: any) => {
      if (data.code === 0) {
        ToastMessage("success", "创建成功", "您的功能需求创建成功");
        // setTimeout(() => window.location.reload(), 1000);
        setId(-1);
        setTitle("");
        setDesc("");
        setPriority(1);
        setCurrState("未开始");
        setIsCreateModalVisible(false);
        setIter([]);
        setChargedBy(-1);
        setService(-1);
      } else {
        ToastMessage("error", "创建失败", "您的功能需求创建失败");
      }
    });
  };

  // Handle create cancel
  const handleCreateCancel = () => {
    setId(-1);
    setTitle("");
    setDesc("");
    setPriority(1);
    setCurrState("未开始");
    setIsCreateModalVisible(false);
    setIter([]);
    setChargedBy(-1);
    setService(-1);
  };

  // Handle delete
  function confirmDelete(record: SRCardProps) {
    deleteSRInfo(dispatcher, project, record).then((data: any) => {
      if (data.code === 0) {
        ToastMessage("success", "删除成功", "您的功能需求删除成功");
        // setTimeout(() => window.location.reload(), 1000);
        setId(-1);
        setTitle("");
        setDesc("");
        setPriority(1);
        setCurrState("TODO");
        setIsCreateModalVisible(false);
      } else {
        ToastMessage("error", "删除失败", "您的功能需求删除失败");
      }
    });
  }

  // Handle state change
  function handleStateChange(value: string) {
    setCurrState(value);
  }

  // Handle iteration change
  function handleIterChange(value: Array<any>) {
    setIter(value);
  }

  const iterChildren = JSON.parse(iterationStore).data.map(
    (iter: Iteration) => <Option value={iter.id}>{iter.title}</Option>
  );

  // Handle service change
  function handleServiceChange(value: number) {
    console.debug(service);
    console.debug(value);
    setService(value);
  }

  const serviceChildren = [<Option value={-1}>　</Option>];
  JSON.parse(serviceStore).data.forEach((service: any) =>
    serviceChildren.push(<Option value={service.id}>{service.title}</Option>)
  );

  const chargedByChildren = [<Option value={-1}>　</Option>];
  JSON.parse(projectInfo).data.users.forEach((user: any) =>
    chargedByChildren.push(<Option value={user.id}>{user.name}</Option>)
  );

  function handleChargedByChange(value: number) {
    console.log(value);
    setChargedBy(value);
  }

  const columnTitle1: ProColumns<SRCardProps> = {
    title: "功能需求标题",
    filters: true,
    onFilter: true,
    filterSearch: true,
    width: "15%",
    dataIndex: "title",
    align: "center",
    valueEnum: titleFilter,
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
  };
  const columnTitle2: ProColumns<SRCardProps> = {
    title: "功能需求标题",
    filters: true,
    onFilter: true,
    filterSearch: true,
    width: "15%",
    dataIndex: "title",
    align: "center",
    valueEnum: showTitleFilter,
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
  };
  const columnState: ProColumns<SRCardProps> = {
    title: "状态",
    filters: true,
    onFilter: true,
    filterSearch: true,
    search: false,
    width: "10%",
    dataIndex: "currState",
    valueType: "select",
    valueEnum: {
      未开始: {
        text: "未开始",
      },
      开发中: {
        text: "开发中",
      },
      测试中: {
        text: "测试中",
      },
      已交付: {
        text: "已交付",
      },
    },
    align: "center",
    render: (_, record) => (
      <Space>
        <Tag color={record.stateColor}>{record.currState}</Tag>
      </Space>
    ),
  };
  const columnDesc: ProColumns<SRCardProps> = {
    search: false,
    title: "功能需求描述",
    dataIndex: "description",
    ellipsis: true,
    align: "center",
    render: (_, record) => (
      <ReactMarkdown className={"markdown"} children={record.description} />
    ),
  };
  const columnChargedBy: ProColumns<SRCardProps> = {
    title: "负责人",
    filters: true,
    onFilter: true,
    width: "12%",
    dataIndex: "chargedBy",
    align: "center",
    render: (text, record, _, action) => [
      <div>
        {record.chargedBy === -1
          ? "-"
          : JSON.parse(projectInfo).data.users.filter(
              (user: any) => user.id === record.chargedBy
            ).length > 0
          ? JSON.parse(projectInfo).data.users.filter(
              (user: any) => user.id === record.chargedBy
            )[0].name
          : "-"}
      </div>,
    ],
  };
  const columnIter: ProColumns<SRCardProps> = {
    title: "关联迭代",
    filters: true,
    onFilter: true,
    width: "15%",
    dataIndex: "iter",
    align: "center",
    render: (_, record) => {
      const iter = record.iter.map((iter: Iteration) => iter.title);
      return iter.length === 0 ? <div></div> : <div>{iter.join(", ")}</div>;
    },
  };
  const columnService: ProColumns<SRCardProps> = {
    title: "关联服务",
    filters: true,
    onFilter: true,
    width: "10%",
    dataIndex: "service",
    align: "center",
    render: (text, record, _, action) => [
      <div>
        {record.service === -1
          ? "-"
          : JSON.parse(serviceStore).data.filter(
              (data: Service) => data.id === record.service
            ).length > 0
          ? JSON.parse(serviceStore).data.filter(
              (data: Service) => data.id === record.service
            )[0].title
          : "-"}
      </div>,
    ],
  };
  const columnOpration: ProColumns<SRCardProps> = {
    search: false,
    title: "操作",
    width: "10%",
    valueType: "option",
    align: "center",
    render: (text, record, _, action) => [
      // 编辑内含修改删除等，须继续与后端接口适配
      <a onClick={() => showEditModal(record)}>编辑</a>,
      <Popconfirm
        title="你确定要删除该功能需求吗？"
        onConfirm={() => confirmDelete(record)}
        okText="是"
        cancelText="否"
      >
        <a href="#">删除</a>
      </Popconfirm>,
    ],
  };

  const columns: ProColumns<SRCardProps>[] = [];
  columns.push(columnTitle1);
  columns.push(columnState);
  columns.push(columnDesc);
  columns.push(columnChargedBy);
  columns.push(columnIter);
  columns.push(columnService);
  columns.push(columnOpration);

  const showColumn: ProColumns<SRCardProps>[] = [];
  showColumn.push(columnTitle2);
  showColumn.push(columnState);
  showColumn.push(columnDesc);
  showColumn.push(columnChargedBy);
  showColumn.push(columnIter);
  showColumn.push(columnService);
  // showColumn.push(columnOpration);

  const chooseColumn: ProColumns<SRCardProps>[] = [];
  chooseColumn.push(columnTitle1);
  chooseColumn.push(columnState);
  chooseColumn.push(columnDesc);
  chooseColumn.push(columnChargedBy);
  chooseColumn.push(columnIter);
  chooseColumn.push(columnService);
  // chooseColumn.push(columnOpration);

  const rowSelection = {
    onSelect: (record: SRCardProps, selected: boolean) => {
      const IRSR: IRSRAssociation = {
        id: 0,
        IR: props.IR_id,
        SR: record.id,
      };
      if (selected) {
        createIRSR(dispatcher, props.project_id, IRSR).then((data: any) => {
          console.log(data);
        });
      } else if (!selected) {
        deleteIRSR(dispatcher, props.project_id, IRSR).then((data: any) => {
          console.log(data);
        });
      }
    },
    onSelectAll: (
      selected: boolean,
      selectedRows: ProColumns<SRCardProps>[],
      changedRows: ProColumns<SRCardProps>[]
    ) => {
      changedRows.forEach((value: any, index: number) => {
        const IRSR: IRSRAssociation = {
          id: 0,
          IR: props.IR_id,
          SR: value.id,
        };
        if (selected) {
          createIRSR(dispatcher, props.project_id, IRSR).then((data: any) => {
            console.log(data);
          });
        } else if (!selected) {
          deleteIRSR(dispatcher, props.project_id, IRSR).then((data: any) => {
            console.log(data);
          });
        }
      });
    },
    onSelectNone: () => {
      SRListData.forEach((value: any, index: number) => {
        const IRSR: IRSRAssociation = {
          id: 0,
          IR: props.IR_id,
          SR: value.id,
        };
        deleteIRSR(dispatcher, props.project_id, IRSR).then((data: any) => {
          console.log(data);
        });
      });
    },
  };

  if (!props.showChoose && !props.onlyShow) {
    return (
      <div className={"SRTable"}>
        <ProTable<SRCardProps>
          headerTitle="功能需求列表"
          toolBarRender={() => {
            return [
              <Button key="create" onClick={showCreateModal} type="primary">
                新建功能需求
              </Button>,
            ];
          }}
          rowKey="id"
          columns={columns}
          dataSource={dataSRList}
          pagination={false}
          options={{
            fullScreen: false,
            reload: false,
            setting: true,
            density: true,
          }}
          // scroll={{ y: 400 }}
          search={false}
          dateFormatter="string"
        />
        <Modal
          title="新增功能需求"
          centered={true}
          visible={isCreateModalVisible}
          onOk={handleCreateOk}
          onCancel={handleCreateCancel}
          width={"70%"}
          destroyOnClose={true}
        >
          <p
            style={{
              marginBottom: "5px",
              fontSize: "16px",
            }}
          >
            功能需求名称
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
            功能需求介绍
          </p>
          <TextArea
            rows={4}
            allowClear
            value={desc}
            onChange={(e) => {
              setDesc(e.target.value);
            }}
          />
          <p
            style={{
              paddingTop: "10px",
              marginBottom: "5px",
              fontSize: "16px",
            }}
          >
            状态选择
          </p>
          <Select
            defaultValue={currState}
            style={{ width: 120 }}
            onChange={handleStateChange}
          >
            <Option value="未开始">未开始</Option>
            <Option value="开发中" disabled>
              开发中
            </Option>
            <Option value="测试中" disabled>
              测试中
            </Option>
            <Option value="已交付" disabled>
              已交付
            </Option>
          </Select>
          <p
            style={{
              paddingTop: "10px",
              marginBottom: "5px",
              fontSize: "16px",
            }}
          >
            功能需求权重
            <span style={{ color: "grey", fontSize: "0.6rem" }}>
              （用于计算需求完成进度）
            </span>
          </p>
          <InputNumber
            style={{ width: 120 }}
            value={priority}
            onChange={(e: number) => {
              setPriority(e);
            }}
          />
        </Modal>

        <Modal
          title="编辑功能需求"
          centered={true}
          visible={isEditModalVisible}
          onOk={handleEditOk}
          onCancel={handleEditCancel}
          width={"70%"}
          destroyOnClose={true}
        >
          <p
            style={{
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
          <p
            style={{
              paddingTop: "10px",
              marginBottom: "5px",
              fontSize: "16px",
            }}
          >
            状态选择
          </p>
          <Select
            defaultValue={currState}
            style={{ width: 120 }}
            onChange={handleStateChange}
          >
            <Option value="未开始">未开始</Option>
            <Option value="开发中">开发中</Option>
            <Option value="测试中">测试中</Option>
            <Option value="已交付">已交付</Option>
          </Select>
          <p
            style={{
              paddingTop: "10px",
              marginBottom: "5px",
              fontSize: "16px",
            }}
          >
            迭代选择
          </p>
          <Select
            mode="multiple"
            style={{ width: "100%" }}
            defaultValue={iter}
            onChange={handleIterChange}
          >
            {iterChildren}
          </Select>
          <p
            style={{
              paddingTop: "10px",
              marginBottom: "5px",
              fontSize: "16px",
            }}
          >
            服务选择
          </p>
          <Select
            defaultValue={service}
            style={{ width: 120 }}
            onChange={handleServiceChange}
          >
            {serviceChildren}
          </Select>
          <p
            style={{
              paddingTop: "10px",
              marginBottom: "5px",
              fontSize: "16px",
            }}
          >
            指定负责人
          </p>
          <Select
            defaultValue={chargedBy}
            style={{ width: 120 }}
            onChange={handleChargedByChange}
          >
            {chargedByChildren}
          </Select>
          <p
            style={{
              paddingTop: "10px",
              marginBottom: "5px",
              fontSize: "16px",
            }}
          >
            项目优先级
          </p>
          <InputNumber
            value={priority}
            onChange={(e: number) => {
              setPriority(e);
            }}
          />
        </Modal>
      </div>
    );
  } else if (props.showChoose) {
    return (
      <div className={"ChooseSRTable"}>
        <ProTable<SRCardProps>
          columns={chooseColumn}
          rowSelection={{
            // hideSelectAll: false,
            defaultSelectedRowKeys: curSRKey,
            ...rowSelection,
          }}
          tableAlertOptionRender={({ selectedRowKeys, selectedRows }) => (
            <Space size={24}>
              <span>{`关联功能需求: ${selectedRows.reduce(
                (pre, item: SRCardProps) => pre + item.title + ", ",
                ""
              )} `}</span>
            </Space>
          )}
          dataSource={dataSRList}
          pagination={false}
          // scroll={{ y: 300 }}
          search={false}
          rowKey="id"
          dateFormatter="string"
          toolBarRender={false}
        />
      </div>
    );
  } else {
    return (
      <div className={"showSRTable"}>
        <ProTable<SRCardProps>
          headerTitle="功能需求列表"
          toolBarRender={false}
          rowKey="id"
          columns={showColumn}
          dataSource={showSRList}
          pagination={false}
          options={{
            fullScreen: false,
            reload: false,
            setting: true,
            density: true,
          }}
          // scroll={{ y: 400 }}
          search={false}
          dateFormatter="string"
        />
      </div>
    );
  }
};

export default UISRList;
