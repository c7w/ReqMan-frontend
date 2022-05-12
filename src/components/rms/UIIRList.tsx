import React, { useEffect, useRef, useState } from "react";
import type { ProColumns } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import {
  Input,
  Button,
  Modal,
  Progress,
  Popconfirm,
  Typography,
  Pagination,
} from "antd";
import { IRCardProps, IRSRAssociation } from "../../store/ConfigureStore";
import "./UIIRList.css";
import SRList from "./UISRList";
import { useDispatch, useSelector } from "react-redux";
import {
  createIRInfo,
  createIRSR,
  deleteIRInfo,
  deleteIRSR,
  updateIRInfo,
} from "../../store/functions/RMS";
import { ToastMessage } from "../../utils/Navigation";
import ReactMarkdown from "react-markdown";
import {
  oneIR2AllSR,
  SRId2SRInfo,
  userId2UserInfo,
} from "../../utils/Association";
import { getProjectStore } from "../../store/slices/ProjectSlice";
import { UIUserCardPreview } from "../ums/UIUserCard";
import IRCard from "./IRCard";
import SRSearchBox from "../Shared/SRSearchBox";
import { difference } from "underscore";
import Loading from "../../layout/components/Loading";
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
  console.debug("UIIRList ");
  const IRListData = JSON.parse(props.IRListStr).data;
  const IRSRAssociationData = JSON.parse(props.IRSRAssociation).data;
  const dispatcher = useDispatch();
  const project = props.project_id;
  const [dataIRList, setDataIRList] = useState<any[]>([]);
  const projectInfo = useSelector(getProjectStore);
  const [reload, setReload] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [explorerParams, setExplorerParams] = useState({
    current: 1,
    pageSize: 10,
  });

  const cntIR = JSON.parse(props.IRListStr).data.length;

  useEffect(() => {
    if (reload !== 0) {
      setReload(reload + 1);
    }
  }, [props.IRListStr]);

  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [isCreateModalVisible, setIsCreateModalVisible] =
    useState<boolean>(false);
  const [isSRModalVisible, setIsSRModalVisible] = useState<boolean>(false);
  const [isCardModalVisible, setIsCardModalVisible] = useState<boolean>(false);

  const [id, setId] = useState<number>(-1);
  const [title, setTitle] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [rank, setRank] = useState<number>(1);
  const [ifok, setIfok] = useState<boolean>(true);
  const [IRCardRecord, setIRCardRecord] = useState<IRCardProps>(IRListData[0]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const showSRModal = (record: IRCardProps) => {
    setId(record.id);
    setIsSRModalVisible(true);
  };

  const handleSROk = () => {
    setId(-1);
    // setTimeout(() => window.location.reload(), 1000);
    ToastMessage("success", "关联成功", "您的需求关联成功");
    setIsSRModalVisible(false);
    setReload(reload + 1);
  };

  const handleSRCancel = () => {
    setId(-1);
    // setTimeout(() => window.location.reload(), 0);
    setIsSRModalVisible(false);
    setReload(reload + 1);
  };

  const showEditModal = (record: IRCardProps) => {
    setIfok(false);
    setId(record.id);
    setTitle(record.title);
    setDesc(record.description);
    setRank(record.rank);
    setIsEditModalVisible(true);
  };

  const handleEditOk = () => {
    const newIR: IRCardProps = {
      id: id,
      project: project,
      title: title,
      description: desc,
      rank: rank,
      iter: [],
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
        setReload(reload + 1);
      } else {
        ToastMessage("error", "修改失败", "您的原始需求修改失败");
      }
    });
    setIfok(true);
  };

  const handleEditCancel = () => {
    setId(-1);
    setTitle("");
    setDesc("");
    setRank(1);
    setIsEditModalVisible(false);
    setIfok(true);
  };

  const showCreateModal = () => {
    setIsCreateModalVisible(true);
    setIfok(true);
  };

  const handleCreateOk = () => {
    const newIR: IRCardProps = {
      id: id,
      project: project,
      title: title,
      description: desc,
      rank: rank,
      iter: [],
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
        setReload(reload + 1);
      } else {
        ToastMessage("error", "创建失败", "您的原始需求创建失败");
      }
    });
    setIfok(true);
  };

  const handleCreateCancel = () => {
    setId(-1);
    setTitle("");
    setDesc("");
    setRank(1);
    setIsCreateModalVisible(false);
    setIfok(true);
  };

  function confirmDelete(record: IRCardProps) {
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

  const showCardModal = (record: IRCardProps) => {
    setIsCardModalVisible(true);
    setIRCardRecord(record);
  };

  const handleCardCancel = () => {
    setIsCardModalVisible(false);
  };

  const handleCardOk = () => {
    setIsCardModalVisible(false);
    setReload(reload + 1);
  };

  const columns: ProColumns<IRCardProps>[] = [
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
            cursor: "pointer",
          }}
          onClick={() => showCardModal(record)}
        >
          <Typography.Link>{record.title}</Typography.Link>
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
      width: "12%",
      align: "center",
      render: (_, record) => (
        <Progress className={"prgressProp"} percent={record.progress} />
      ),
    },
    {
      title: "创建者",
      width: "8%",
      ellipsis: true,
      align: "center",
      render: (_, record) => {
        return (
          <div style={{}}>
            <UIUserCardPreview
              projectStore={projectInfo}
              userId={Number(record.createdBy)}
              previewSize={30}
            />
          </div>
        );
      },
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
      width: "25%",
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

  const expandedRowRender = (record: IRCardProps) => {
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

  const onlyShowColumn: ProColumns<IRCardProps>[] = [];
  for (let i = 0; i < 5; i += 1) {
    onlyShowColumn.push(columns[i]);
  }

  const reload_IR_request = async (page: number, pageSize: number) => {
    setIsLoading(true);
    setCurrentPage(page);
    setPageSize(pageSize);
    // First, slice the IRListData
    // console.debug(12312312312312);
    // console.debug(JSON.parse(props.IRListStr).data);
    // console.debug(props.IRListStr);
    const _IRListData = JSON.parse(props.IRListStr).data.slice(
      (page - 1) * pageSize,
      page * pageSize
    );
    // console.debug(_IRListData);

    // Then, post-process the IRListData
    const IRListData_processed = await Promise.all(
      _IRListData.map(async (item: any) => {
        item.createdAt *= 1000;
        // Calc item.progress
        let totalWeight = 0;
        let curWeight = 0;
        const curSRs = await oneIR2AllSR(item.id, "", "", project);

        for (const SRInfo of curSRs) {
          totalWeight += SRInfo.priority;
          if (SRInfo.state === "Done") {
            curWeight += SRInfo.priority;
          }
        }
        item.progress = 0 | ((curWeight * 100) / totalWeight);
        return item;
      })
    );
    setDataIRList(IRListData_processed);
    setIsLoading(false);
    // return {
    //   data: IRListData_processed,
    //   total: JSON.parse(props.IRListStr).data.length,
    //   success: true,
    // };
  };

  useEffect(() => {
    reload_IR_request(currentPage, pageSize);
  }, [reload]);

  const [selectedSR, setSelectedSR] = useState<any>(
    JSON.stringify({ code: 0, data: [] })
  );

  if (!props.onlyShow) {
    return (
      <div className={`IRTable`}>
        <ProTable<IRCardProps>
          style={{ minHeight: "70vh" }}
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
          defaultSize={"small"}
          dataSource={dataIRList}
          // request={reload_IR_request}
          // params={{ reload: reload }}
          rowKey="id"
          // pagination={{
          //   pageSize: 10,
          // }}
          loading={isLoading}
          tableStyle={{ padding: "1rem 1rem 2rem" }}
          dateFormatter="string"
          search={false}
          pagination={false}
        />
        <div
          className="bottom-pagination"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: "bold", marginRight: "1rem" }}>
            {cntIR > 0
              ? "第 " +
                (pageSize * (currentPage - 1) + 1).toString() +
                "-" +
                Math.min(pageSize * currentPage, cntIR) +
                " 条"
              : "暂无原始需求"}
          </span>
          <Pagination
            total={cntIR}
            onChange={reload_IR_request}
            defaultPageSize={pageSize}
            showSizeChanger
            showQuickJumper
          />
        </div>

        <Modal
          title="功能需求关联列表"
          centered={true}
          visible={isSRModalVisible}
          onCancel={handleSRCancel}
          footer={null}
          width={"70%"}
          destroyOnClose={true}
        >
          <SRSearchBox
            value={JSON.parse(props.IRSRAssociation)
              .data.filter((value: any) => {
                return value.IR === id;
              })
              .map((value: any) => {
                return value.SR;
              })}
            onChange={(from: number[], to: number[]) => {
              difference(from, to).forEach((value: number) => {
                deleteIRSR(dispatcher, project, {
                  IR: id,
                  SR: value,
                  id: -1,
                });
              });
              difference(to, from).forEach((value: number) => {
                createIRSR(dispatcher, project, {
                  IR: id,
                  SR: value,
                  id: -1,
                });
              });
            }}
            getSelectedSR={(value: any[]) => {
              console.debug("update to UIIRList", value);
              setSelectedSR(JSON.stringify({ code: 0, data: value }));
            }}
            multiple={true}
          />
          <SRList
            showChoose={false}
            onlyShow={true}
            project_id={props.project_id}
            SRListStr={selectedSR}
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
          okButtonProps={{ disabled: ifok }}
        >
          <p style={{ marginBottom: "5px", fontSize: "16px" }}>原始需求名称</p>
          <Input
            value={title}
            onChange={(e) => {
              if (e.target.value === "") {
                setIfok(true);
              }
              if (e.target.value !== "") {
                setIfok(false);
              }
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
        </Modal>

        <Modal
          title="编辑原始需求"
          centered={true}
          visible={isEditModalVisible}
          onOk={handleEditOk}
          onCancel={handleEditCancel}
          width={"70%"}
          okButtonProps={{ disabled: ifok }}
        >
          <p
            style={{
              paddingTop: "10px",
              marginBottom: "5px",
              fontSize: "16px",
            }}
          >
            原始需求标题
          </p>
          <Input
            value={title}
            onChange={(e) => {
              if (e.target.value === "") {
                setIfok(true);
              }
              if (e.target.value !== "") {
                setIfok(false);
              }
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
            原始需求描述
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
        {IRCardRecord === undefined ? null : (
          <Modal
            title="IRCard展示"
            centered={true}
            visible={isCardModalVisible}
            onCancel={handleCardCancel}
            footer={[
              <Button key="confirm" onClick={handleCardOk}>
                确认
              </Button>,
            ]}
            width={"40%"}
            destroyOnClose={true}
          >
            <IRCard
              title={IRCardRecord.title}
              iter={IRCardRecord.iter}
              id={IRCardRecord.id}
              project={IRCardRecord.project}
              description={IRCardRecord.description}
              progress={IRCardRecord.progress}
              createdAt={Number(IRCardRecord.createdAt) / 1000}
              createdBy={IRCardRecord.createdBy}
              rank={IRCardRecord.rank}
            />
          </Modal>
        )}
      </div>
    );
  } else {
    return (
      <div className={`showIRTable`}>
        <ProTable<IRCardProps>
          headerTitle="需求展示列表"
          style={{ minHeight: "70vh" }}
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
          // expandable={{ expandedRowRender }}
          dataSource={dataIRList}
          // request={reload_IR_request}
          // params={{ reload: reload }}
          rowKey="id"
          pagination={false}
          loading={isLoading}
          scroll={{ y: 400 }}
          tableStyle={{ padding: "1rem 1rem 2rem" }}
          dateFormatter="string"
          search={false}
        />
        <div
          className="bottom-pagination"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: "bold", marginRight: "1rem" }}>
            {cntIR > 0
              ? "第 " +
                (pageSize * (currentPage - 1) + 1).toString() +
                "-" +
                Math.min(pageSize * currentPage, cntIR) +
                " 条"
              : "暂无原始需求"}
          </span>
          <Pagination
            total={cntIR}
            onChange={reload_IR_request}
            defaultPageSize={pageSize}
            showSizeChanger
            showQuickJumper
          />
        </div>
        {IRCardRecord === undefined ? null : (
          <Modal
            title="IRCard展示"
            centered={true}
            visible={isCardModalVisible}
            onCancel={handleCardCancel}
            footer={[
              <Button key="confirm" onClick={handleCardOk}>
                确认
              </Button>,
            ]}
            width={"40%"}
            destroyOnClose={true}
          >
            <IRCard
              title={IRCardRecord.title}
              iter={IRCardRecord.iter}
              id={IRCardRecord.id}
              project={IRCardRecord.project}
              description={IRCardRecord.description}
              progress={IRCardRecord.progress}
              createdAt={Number(IRCardRecord.createdAt) / 1000}
              createdBy={IRCardRecord.createdBy}
              rank={IRCardRecord.rank}
            />
          </Modal>
        )}
      </div>
    );
  }
};

export default UIIRList;
