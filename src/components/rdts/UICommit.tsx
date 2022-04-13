import "./UIMerge.css";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProjectStore } from "../../store/slices/ProjectSlice";
import { getRepoStore } from "../../store/slices/RepoSlice";
import { getCommitStore, getIssueStore } from "../../store/slices/IssueSlice";
import ProTable, { ProColumns } from "@ant-design/pro-table";
import { CommitProps, IssueProps } from "../../store/ConfigureStore";
import { userId2UserInfo } from "../../utils/Association";

const UICommit = () => {
  const dispatcher = useDispatch();

  const projectStore = useSelector(getProjectStore);
  const repoStore = useSelector(getRepoStore);
  const commitStore = useSelector(getCommitStore);

  const getBackgroundColor = (changed_lines: number) => {
    if (changed_lines < 50) {
      return "#e5e5ff";
    } else if (changed_lines >= 200) {
      return "#c3c3ff";
    } else {
      return "#d4d4ff";
    }
  };

  const columns: ProColumns<CommitProps>[] = [
    {
      title: "项目贡献编号",
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
            backgroundColor: getBackgroundColor(
              record.additions + record.deletions
            ),
          }}
        >
          {record.repo}-#{record.hash_id.slice(0, 8)}
        </div>
      ),
    },
    {
      title: "项目贡献信息",
      ellipsis: true,
      width: "70%",
      dataIndex: "description",
      align: "left",
      render: (_, record) => (
        <div
          style={{
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          {record.title}
        </div>
      ),
    },
    {
      title: "项目贡献提交人",
      width: "15%",
      ellipsis: true,
      dataIndex: "createdBy",
      align: "center",
      render: (_, record) => {
        let user = record.commiter_email;
        if (record.user_committer > 0) {
          const find_result = userId2UserInfo(
            record.user_committer,
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

  const data_source = JSON.parse(commitStore).data;

  return (
    <div className={"merge-card"}>
      <ProTable<CommitProps>
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

export default UICommit;
