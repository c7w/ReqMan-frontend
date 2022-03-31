import React, { useState } from "react";
import type { ProColumns } from "@ant-design/pro-table";
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
import { useDispatch } from "react-redux";
import { IRSRAssociation, SRCard } from "../../store/ConfigureStore";
import {
  createIRSR,
  createSRInfo,
  deleteIRSR,
  deleteSRInfo,
  updateSRInfo,
} from "../../store/functions/RMS";
import { ToastMessage } from "../../utils/Navigation";
const { TextArea } = Input;
const { Option } = Select;

interface UISRListProps {
  readonly showChoose: boolean;
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
  // const userData = JSON.parse(props.userInfo).data;
  const IRSRAssociationData = JSON.parse(props.IRSRAssociation).data;
  const dispatcher = useDispatch();
  const project = props.project_id;

  const curSRKey: number[] = [];
  if (props.IR_id !== -1) {
    IRSRAssociationData.forEach((value: any) => {
      if (value.IR === props.IR_id) {
        curSRKey.push(value.SR);
      }
    });
  }
  const [selectedSR, setSelectedSR] = useState<number[]>(curSRKey.slice());
  // 总任务列表
  const dataSRList: SRCard[] = [];
  SRListData.forEach((value: any) => {
    let state = "";
    let color = "";
    if (value.state === "TODO") {
      console.log("I am here");
      state = "未开始";
      color = "red";
    }
    if (value.state === "WIP") {
      state = "开发中";
      color = "blue";
    }
    if (value.state === "Reviewing") {
      state = "测试中";
      color = "yellow";
    }
    if (value.state === "Done") {
      state = "已交付";
      color = "green";
    }
    dataSRList.push({
      id: value.id,
      project: value.project,
      title: value.title,
      description: value.description,
      priority: value.priority,
      rank: value.rank,
      currState: state,
      stateColor: color,
      createdBy: value.createdBy,
      createdAt: value.createdAt * 1000,
      disabled: value.disabled,
    });
  });

  const [tableListDataSource, settableListDataSource] =
    useState<SRCard[]>(dataSRList);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [isCreateModalVisible, setIsCreateModalVisible] =
    useState<boolean>(false);
  const [id, setId] = useState<number>(-1);
  const [title, setTitle] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [priority, setPriority] = useState<number>(1);
  const [rank, setRank] = useState<number>(1);
  const [currState, setCurrState] = useState<string>("未开始");

  const showEditModal = (record: SRCard) => {
    setId(record.id);
    setTitle(record.title);
    setDesc(record.description);
    setPriority(record.priority);
    setRank(record.rank);
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
    const newSR: SRCard = {
      id: id,
      project: project,
      title: title,
      description: desc,
      priority: priority,
      rank: rank,
      currState: state,
      createdBy: "", // 未用到
      createdAt: -1, // 未用到
      disabled: true, // 未用到
    };
    updateSRInfo(dispatcher, project, newSR).then((data: any) => {
      if (data.code === 0) {
        ToastMessage("success", "修改成功", "您的SR修改成功");
        setTimeout(() => window.location.reload(), 1000);
        setId(-1);
        setTitle("");
        setDesc("");
        setPriority(1);
        setRank(1);
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
    setRank(1);
    setCurrState("未开始");
    setIsEditModalVisible(false);
  };

  const showCreateModal = () => {
    setIsCreateModalVisible(true);
  };

  const handleCreateOk = () => {
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
    const newSR: SRCard = {
      id: id,
      project: project,
      title: title,
      description: desc,
      priority: priority,
      rank: rank,
      currState: state,
      createdBy: "", // 未用到
      createdAt: -1, // 未用到
      disabled: true, // 未用到
    };
    createSRInfo(dispatcher, project, newSR).then((data: any) => {
      if (data.code === 0) {
        ToastMessage("success", "创建成功", "您的SR创建成功");
        setTimeout(() => window.location.reload(), 1000);
        setId(-1);
        setTitle("");
        setDesc("");
        setPriority(1);
        setRank(1);
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
    setRank(1);
    setCurrState("未开始");
    setIsCreateModalVisible(false);
  };

  function confirmDelete(record: SRCard) {
    deleteSRInfo(dispatcher, project, record).then((data: any) => {
      if (data.code === 0) {
        ToastMessage("success", "删除成功", "您的SR删除成功");
        setTimeout(() => window.location.reload(), 1000);
        setId(-1);
        setTitle("");
        setDesc("");
        setPriority(1);
        setRank(1);
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

  const columns: ProColumns<SRCard>[] = [
    {
      title: "功能需求标题",
      width: "15%",
      dataIndex: "title",
      align: "center",
    },
    {
      title: "状态",
      width: "10%",
      dataIndex: "currState",
      filters: true,
      onFilter: true,
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
    },
    {
      title: "创建者",
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
      sorter: (a, b) => a.createdAt - b.createdAt,
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

  const chooseColumn: ProColumns<SRCard>[] = [];
  for (let i = 0; i < 5; i += 1) {
    columns[i].filters = false;
    chooseColumn.push(columns[i]);
  }

  const rowSelection = {
    // onChange: (
    //   selectedRowKeys: React.Key[],
    //   selectedRows: ProColumns<SRCard>[]
    // ) => {
    //   const selectedSR = [];
    //   console.log("===========hey I change===========");
    //   // for (let i = 0; i < selectedRowKeys.length; i++) {
    //   //   selectedSR.push(selectedRows[i].key);
    //   // }
    //   // for (let i = 0; i < props.curSRKey.length; i++) {
    //   //   selectedSR.push(props.curSRKey[i]);
    //   // }
    // },
    // getCheckboxProps: (record: ProColumns<SRCard>) => {
    //   console.log("=================");
    //   // for (let i = 0; i < props.curSRKey.length; i++) {
    //   //   if (props.curSRKey[i] === record.key) {
    //   //     return { disabled: true };
    //   //   }
    //   // }
    //   return { disabled: false };
    // },
    onSelect: (record: SRCard, selected: boolean) => {
      const IRSR: IRSRAssociation = {
        id: 0,
        IRId: props.IR_id,
        SRId: record.id,
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
      selectedRows: ProColumns<SRCard>[],
      changedRows: ProColumns<SRCard>[]
    ) => {
      changedRows.forEach((value: any, index: number) => {
        const IRSR: IRSRAssociation = {
          id: 0,
          IRId: props.IR_id,
          SRId: value.id,
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
          IRId: props.IR_id,
          SRId: value.id,
        };
        deleteIRSR(dispatcher, props.project_id, IRSR).then((data: any) => {
          console.log(data);
        });
      });
    },
  };

  if (!props.showChoose) {
    return (
      <div className={"SRTable"}>
        <ProTable<SRCard>
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
          request={() => {
            return Promise.resolve({
              data: tableListDataSource,
              success: true,
            });
          }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
          }}
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
  } else {
    return (
      <div className={"ChooseSRTable"}>
        <ProTable<SRCard>
          // onReset={() => {
          //   setSelectedSR(curSRKey);
          // }}
          params={selectedSR}
          columns={chooseColumn}
          rowSelection={{
            // hideSelectAll: false,
            defaultSelectedRowKeys: curSRKey,
            ...rowSelection,
          }}
          // tableAlertRender={({ selectedRowKeys, selectedRows }) => (
          //   <Space size={24}>
          //     <span>已选 {selectedRowKeys.length} 项</span>
          //     <span>{`关联 SR 任务: ${selectedRows.reduce(
          //       (pre, item: SRCard) => pre + ", " + item.title,
          //       ""
          //     )} `}</span>
          //   </Space>
          // )}
          tableAlertRender={false}
          request={() => {
            return Promise.resolve({
              data: tableListDataSource,
              success: true,
            });
          }}
          pagination={{
            pageSize: 5,
          }}
          rowKey="id"
          dateFormatter="string"
          toolBarRender={false}
          search={{
            labelWidth: "auto",
          }}
        />
      </div>
    );
  }
};

export default UISRList;
