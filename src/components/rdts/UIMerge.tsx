import "./UIMerge.css";
import React from "react";
import moment from "moment";
import { IRCard, MergeRequestProps } from "../../store/ConfigureStore";
import { Button, Popconfirm, Progress } from "antd";
import ProTable, { ProColumns } from "@ant-design/pro-table";
import ReactMarkdown from "react-markdown";
import { useDispatch, useSelector } from "react-redux";
import { getRepoStore } from "../../store/slices/RepoSlice";
import {
  getMergeStore,
  getMRSRAssociationStore,
} from "../../store/slices/IssueSlice";
import { SRId2SRInfo, userId2UserInfo } from "../../utils/Association";
import { getProjectStore } from "../../store/slices/ProjectSlice";
import { UIMergeCardPreview } from "./UIMergeCard";
import { getSRListStore } from "../../store/slices/IRSRSlice";

interface MergeEntryProps {
  title: string;
  description: string;
  state: "merged" | "opened" | "closed";
  mid: number;
  associate_sr_id: number;
  author_id: number;
  author_time: number;
}

const SingleMergeEntry = (props: MergeEntryProps) => {
  const getIssueState = () => {
    switch (props.state) {
      case "closed":
        return "已关闭";
      case "merged":
        return "已合并";
      case "opened":
        return "正在审核";
    }
  };

  return (
    <div
      className="issuable-info-container"
      // style={{ backgroundColor: getBackgroundColor() }}
    >
      <div className="issuable-main-info">
        <div className="merge-request-title">
          <span style={{ fontWeight: "bold" }}>{props.title}</span>
        </div>
        <div className="issuable-info">
          <span className="issuable-reference">!{props.mid}</span>
          &nbsp;·&nbsp;
          <span className="author">{props.author_id}</span>
          &nbsp;·&nbsp;
          <span className="authoredAt">
            {moment(props.author_time * 1000).calendar()}
          </span>
        </div>
      </div>

      <div className="issuable-meta">
        <div className="issuable-status">{getIssueState()}</div>
        <div className="float-right issuable-updated-at d-none d-sm-inline-block">
          <span>关联 {props.associate_sr_id}</span>
        </div>
      </div>
    </div>
  );
};

const UIMerge = () => {
  const dispatcher = useDispatch();

  const projectStore = useSelector(getProjectStore);
  const repoStore = useSelector(getRepoStore);
  const mergeStore = useSelector(getMergeStore);

  const SRListStore = useSelector(getSRListStore);
  const MRSRAssoStore = useSelector(getMRSRAssociationStore);

  const getBackgroundColor = (state: "closed" | "merged" | "opened") => {
    switch (state) {
      case "closed":
        return "#ffe5e5";
      case "merged":
        return "#e5ffe5";
      case "opened":
        return "#e5e5ff";
    }
  };

  const columns: ProColumns<MergeRequestProps>[] = [
    {
      title: "合并请求编号",
      width: "12%",
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
          {record.repo}-!{record.merge_id}
        </div>
      ),
    },
    {
      title: "合并请求信息",
      ellipsis: true,
      width: "58%",
      dataIndex: "description",
      align: "left",
      render: (_, record) => (
        <div
          style={{
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          <UIMergeCardPreview
            data={JSON.stringify(record)}
            MRSRAssociationStore={MRSRAssoStore}
            SRListStore={SRListStore}
          />
        </div>
      ),
    },
    {
      title: "合并请求发起人",
      width: "15%",
      ellipsis: true,
      dataIndex: "createdBy",
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
    {
      title: "关联功能需求",
      width: "15%",
      ellipsis: true,
      dataIndex: "SR",
      align: "center",
      render: (_, record) => {
        let currAssociatedSRId = -1;
        console.debug(JSON.parse(MRSRAssoStore).data);
        const filtered_list = JSON.parse(MRSRAssoStore).data.filter(
          (asso: any) => asso.MR === record.id
        );
        if (filtered_list.length > 0) {
          currAssociatedSRId = filtered_list[0].SR;
        }
        const related =
          currAssociatedSRId <= 0
            ? "-"
            : SRId2SRInfo(currAssociatedSRId, SRListStore).title;

        return <div style={{}}>{related}</div>;
      },
    },
  ];

  const data_source = JSON.parse(mergeStore).data;

  return (
    <div className={"merge-card"}>
      <ProTable<MergeRequestProps>
        headerTitle="项目合并请求查看"
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

export default UIMerge;
