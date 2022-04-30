import "./UIMerge.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProjectStore } from "../../store/slices/ProjectSlice";
import { getRepoStore } from "../../store/slices/RepoSlice";
import { getIssueStore, getMergeStore } from "../../store/slices/IssueSlice";
import ProTable, { ProColumns } from "@ant-design/pro-table";
import { IssueProps, MergeRequestProps } from "../../store/ConfigureStore";
import { userId2UserInfo } from "../../utils/Association";
import { UIIssueCardPreview } from "./UIIssueCard";
import { Typography } from "antd";
import { getRDTSInfo } from "../../store/functions/RDTS";
import { useParams } from "react-router-dom";
import { SyncOutlined, ReloadOutlined } from "@ant-design/icons";
import moment from "moment";
import { addRDTSTimer } from "../../utils/Timer";
import { UIUserCardPreview } from "../ums/UIUserCard";

const UIIssue = () => {
  const dispatcher = useDispatch();

  const projectStore = useSelector(getProjectStore);
  const repoStore = useSelector(getRepoStore);
  const issueStore = useSelector(getIssueStore);

  // Get project_id
  const params = useParams();
  const project_id = Number(params.id);

  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(moment());

  useEffect(() => {
    // Add RDTS Timer
    addRDTSTimer(() => {
      setIsUpdating(true);
      getRDTSInfo(dispatcher, project_id).then(() => {
        setIsUpdating(false);
        setLastUpdate(moment());
      });
    });
  }, []);

  const getBackgroundColor = (state: "closed" | "opened") => {
    switch (state) {
      case "closed":
        return "#f0f0f0";
      case "opened":
        return "#ffe5e5";
    }
  };

  const columns: ProColumns<IssueProps>[] = [
    {
      title: "项目缺陷编号",
      width: "15%",
      dataIndex: "id",
      ellipsis: true,
      align: "center",
      render: (_, record) => (
        <div
          style={{
            fontWeight: "bold",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            backgroundColor: getBackgroundColor(record.state),
          }}
        >
          {record.repo}-#{record.issue_id}
        </div>
      ),
    },
    {
      title: "项目缺陷信息（项目缺陷指远端仓库中带有 bug 标记的 Issue）",
      ellipsis: true,
      width: "61%",
      dataIndex: "description",
      align: "left",
      render: (_, record) => (
        <div
          style={{
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          <UIIssueCardPreview data={JSON.stringify(record)} />
        </div>
      ),
    },
    {
      title: "项目缺陷解决人",
      width: "12%",
      ellipsis: true,
      dataIndex: "createdBy",
      align: "center",
      render: (_, record) => {
        const user = record.assigneeUserName;
        if (record.user_assignee > 0) {
          const find_result = userId2UserInfo(
            record.user_assignee,
            projectStore
          );
          if (find_result !== "not_found") {
            return (
              <div style={{}}>
                <UIUserCardPreview
                  projectStore={projectStore}
                  userId={find_result.id}
                />
                {/*<span>{"@" + find_result.name}</span>*/}
              </div>
            );
          }
        }
        return <div style={{}}>{user}</div>;
      },
    },
    {
      title: "项目缺陷提交者",
      width: "12%",
      ellipsis: true,
      dataIndex: "authoredBy",
      align: "center",
      render: (_, record) => {
        const user = record.authoredByUserName;
        if (record.user_authored > 0) {
          const find_result = userId2UserInfo(
            record.user_authored,
            projectStore
          );
          if (find_result !== "not_found") {
            return (
              <div style={{}}>
                <UIUserCardPreview
                  projectStore={projectStore}
                  userId={find_result.id}
                />
              </div>
            );
          }
        }
        return <div style={{}}>{user}</div>;
      },
    },
  ];

  const data_source = JSON.parse(issueStore).data;

  return (
    <div className={"merge-card"}>
      <ProTable<IssueProps>
        headerTitle="项目缺陷查看"
        toolBarRender={() => {
          return [
            <div style={{ minWidth: "15rem" }}>
              <Typography.Text style={{ width: "10rem", marginRight: "1rem" }}>
                上次更新：{lastUpdate.fromNow()}
              </Typography.Text>
              <Typography.Link
                style={{ marginRight: "10px" }}
                onClick={() => {
                  if (!isUpdating) {
                    setIsUpdating(true);
                    getRDTSInfo(dispatcher, project_id)
                      .then((data: any) => {
                        setIsUpdating(false);
                        setLastUpdate(moment());
                      })
                      .catch((err: any) => {
                        setIsUpdating(false);
                      });
                  }
                }}
              >
                {isUpdating ? <SyncOutlined spin={true} /> : <ReloadOutlined />}
              </Typography.Link>
            </div>,
          ];
        }}
        cardBordered={true}
        columns={columns}
        options={{
          fullScreen: false,
          setting: true,
          density: true,
          reload: false,
        }}
        // request={() => {
        //   return Promise.resolve({
        //     data: tableListDataSource,
        //     success: true,
        //   });
        // }}
        defaultSize={"small"}
        dataSource={data_source}
        rowKey="id"
        pagination={{ position: ["bottomRight"] }}
        tableStyle={{ padding: "1rem 1rem 2rem" }}
        dateFormatter="string"
        search={false}
      />
    </div>
  );
};

export default UIIssue;
