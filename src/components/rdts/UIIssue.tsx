import "./UIMerge.css";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProjectStore } from "../../store/slices/ProjectSlice";
import { getRepoStore } from "../../store/slices/RepoSlice";
import { getIssueStore, getMergeStore } from "../../store/slices/IssueSlice";
import ProTable, { ProColumns } from "@ant-design/pro-table";
import { IssueProps, MergeRequestProps } from "../../store/ConfigureStore";
import { userId2UserInfo } from "../../utils/Association";
import { UIIssueCardPreview } from "./UIIssueCard";

const UIIssue = () => {
  const dispatcher = useDispatch();

  const projectStore = useSelector(getProjectStore);
  const repoStore = useSelector(getRepoStore);
  const issueStore = useSelector(getIssueStore);

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
      title: "项目缺陷信息",
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
        let user = record.assigneeUserName;
        if (record.user_assignee > 0) {
          const find_result = userId2UserInfo(
            record.user_assignee,
            projectStore
          );
          if (find_result !== "not_found") {
            user = find_result.name;
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
        let user = record.authoredByUserName;
        if (record.user_authored > 0) {
          const find_result = userId2UserInfo(
            record.user_authored,
            projectStore
          );
          if (find_result !== "not_found") {
            user = find_result.name;
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
          return [];
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
