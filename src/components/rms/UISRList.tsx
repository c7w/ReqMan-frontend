import React, { ReactElement, useEffect, useState } from "react";
import type { ProColumns } from "@ant-design/pro-table";
import ReactMarkdown from "react-markdown";
import ProTable from "@ant-design/pro-table";
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
import { IRSRAssociation, SRCardProps } from "../../store/ConfigureStore";
import {
  createIRSR,
  createSRInfo,
  deleteIRSR,
  deleteSRInfo,
  updateSRInfo,
} from "../../store/functions/RMS";
import { ToastMessage } from "../../utils/Navigation";
import { getProjectStore } from "../../store/slices/ProjectSlice";
import { SR2Iteration, userId2UserInfo } from "../../utils/Association";
import {
  getIterationStore,
  getSRIterationStore,
} from "../../store/slices/IterationSlice";
import ProjectList from "../../page/route/Project/ProjectList";
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

/*
SRListStr:  {"code":0,"data":[{"id":1,"project":2,"title":"sr","description":"sr","priority":1000,"rank":1000,"state":"TODO","createdBy":17,"createdAt":1648475583.008951,"disabled":false}]}
 */
/*
IRSRAssociation: {"code":0,"data":[{"id":6,"IR":19,"SR":5}]}
*/
/*
userData: {"code":0,"data":{"user":{"id":17,"name":"hbx20","email":"hbx@hbx.boy","avatar":"","createdAt":1648273276.15087},"projects":[{"id":2,"title":"addIR","description":"test addIR","createdAt":1648384603.824133,"avatar":""},{"id":3,"title":"project QC","description":"df","createdAt":1648569673.895546,"avatar":"X"},{"id":8,"title":"aaaa","description":"aaaaaaaaaaaaaaaaaaaaaa","createdAt":1648609511.781126,"avatar":"X"}],"schedule":{"done":[],"wip":[],"todo":[]}},"avatar":""}
*/

const UISRList = (props: UISRListProps) => {
  const SRListData = JSON.parse(props.SRListStr).data;
  const IRSRAssociationData = JSON.parse(props.IRSRAssociation).data;
  const dispatcher = useDispatch();
  const project = props.project_id;
  const projectInfo = useSelector(getProjectStore);
  const SRIterInfo = useSelector(getSRIterationStore);
  const IterationInfo = useSelector(getIterationStore);
  // const output = SR2Iteration(props.project_id, SRIterInfo, IterationInfo);
  console.log(JSON.parse(projectInfo));
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
    const user = userId2UserInfo(Number(value.createdBy), projectInfo);
    dataSRList.push({
      id: value.id,
      project: value.project,
      title: value.title,
      description: value.description,
      priority: value.priority,
      rank: value.rank,
      currState: state,
      stateColor: color,
      createdBy: user.name,
      createdAt: value.createdAt * 1000,
      disabled: value.disabled,
      iter: "迭代1",
      chargedBy: "某某某",
      service: "服务1",
    });
  });

  const showSRList: SRCardProps[] = [];
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
        showSRList.push({
          id: value.id,
          project: value.project,
          title: value.title,
          description: value.description,
          priority: value.priority,
          rank: value.rank,
          currState: state,
          stateColor: color,
          createdBy: user.name,
          createdAt: value.createdAt * 1000,
          disabled: value.disabled,
          iter: "迭代1",
          chargedBy: "某某某",
          service: "服务1",
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
  const [iter, setIter] = useState<string>("未开始");
  const [chargedBy, setChargedBy] = useState<string>("某某某");
  const [service, setService] = useState<string>("服务");

  const showEditModal = (record: SRCardProps) => {
    setId(record.id);
    setTitle(record.title);
    setDesc(record.description);
    setPriority(record.priority);
    setCurrState(record.currState);
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
      rank: 1, //未用到
      currState: state,
    };
    updateSRInfo(dispatcher, project, newSR).then((data: any) => {
      if (data.code === 0) {
        ToastMessage("success", "修改成功", "您的SR修改成功");
        // setTimeout(() => window.location.reload(), 1000);
        setId(-1);
        setTitle("");
        setDesc("");
        setPriority(1);
        setCurrState("未开始");
        setIsEditModalVisible(false);
      } else {
        ToastMessage("error", "修改失败", "您的SR修改失败");
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
  };

  const showCreateModal = () => {
    setIsCreateModalVisible(true);
  };

  const handleCreateOk = () => {
    const newSR: SRCardProps = {
      id: id,
      project: project,
      title: title,
      description: desc,
      priority: priority,
      currState: "TODO",
    };
    createSRInfo(dispatcher, project, newSR).then((data: any) => {
      if (data.code === 0) {
        ToastMessage("success", "创建成功", "您的SR创建成功");
        // setTimeout(() => window.location.reload(), 1000);
        setId(-1);
        setTitle("");
        setDesc("");
        setPriority(1);
        setCurrState("未开始");
        setIsCreateModalVisible(false);
      } else {
        ToastMessage("error", "创建失败", "您的SR创建失败");
      }
    });
  };

  const handleCreateCancel = () => {
    setId(-1);
    setTitle("");
    setDesc("");
    setPriority(1);
    setCurrState("未开始");
    setIsCreateModalVisible(false);
  };

  function confirmDelete(record: SRCardProps) {
    deleteSRInfo(dispatcher, project, record).then((data: any) => {
      if (data.code === 0) {
        ToastMessage("success", "删除成功", "您的SR删除成功");
        // setTimeout(() => window.location.reload(), 1000);
        setId(-1);
        setTitle("");
        setDesc("");
        setPriority(1);
        setCurrState("TODO");
        setIsCreateModalVisible(false);
      } else {
        ToastMessage("error", "删除失败", "您的SR删除失败");
      }
    });
  }

  function handleStateChange(value: string) {
    console.log(`selected ${value}`);
    setCurrState(value);
  }

  const columns: ProColumns<SRCardProps>[] = [
    {
      title: "功能需求标题",
      filters: true,
      onFilter: true,
      width: "15%",
      dataIndex: "title",
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
      title: "状态",
      filters: true,
      onFilter: true,
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
    },
    {
      search: false,
      title: "功能需求描述",
      dataIndex: "description",
      ellipsis: true,
      align: "center",
      render: (_, record) => (
        <ReactMarkdown className={"markdown"} children={record.description} />
      ),
    },
    {
      title: "创建者",
      filters: true,
      onFilter: true,
      width: "15%",
      dataIndex: "createdBy",
      align: "center",
    },
    {
      search: false,
      title: "创建时间",
      width: "20%",
      dataIndex: "createdAt",
      valueType: "dateTime",
      align: "center",
    },
    {
      search: false,
      title: "操作",
      width: "15%",
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
    },
  ];

  const chooseColumn: ProColumns<SRCardProps>[] = [];
  for (let i = 0; i < 5; i += 1) {
    chooseColumn.push(columns[i]);
  }

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
      //setSelectedSR([]);
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
      //setSelectedSR([]);
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

  const [table, setTable] = useState<ReactElement>();
  useEffect(() => {
    setTable(
      <div>
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
          // tableAlertRender={false}
          // request={() => {
          //   return Promise.resolve({
          //     data: tableListDataSource,
          //     success: true,
          //   });
          // }}
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
  }, [props.SRListStr]);

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
          // request={() => {
          //   return Promise.resolve({
          //     data: tableListDataSource,
          //     success: true,
          //   });
          // }}
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
            项目优先级
          </p>
          <InputNumber
            value={priority}
            onChange={(e: number) => {
              setPriority(e);
            }}
          />
          {/*<p*/}
          {/*  style={{*/}
          {/*    paddingTop: "10px",*/}
          {/*    marginBottom: "5px",*/}
          {/*    fontSize: "16px",*/}
          {/*  }}*/}
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
          title="编辑功能需求"
          centered={true}
          visible={isEditModalVisible}
          onOk={handleEditOk}
          onCancel={handleEditCancel}
          width={"70%"}
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
            项目优先级
          </p>
          <InputNumber
            value={priority}
            onChange={(e: number) => {
              setPriority(e);
            }}
          />
          {/*<p*/}
          {/*  style={{*/}
          {/*    paddingTop: "10px",*/}
          {/*    marginBottom: "5px",*/}
          {/*    fontSize: "16px",*/}
          {/*  }}*/}
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
      </div>
    );
  } else if (props.showChoose) {
    return <div className={"ChooseSRTable"}>{table}</div>;
  } else {
    return (
      <div className={"showSRTable"}>
        <ProTable<SRCardProps>
          headerTitle="功能需求列表"
          toolBarRender={false}
          rowKey="id"
          columns={chooseColumn}
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
