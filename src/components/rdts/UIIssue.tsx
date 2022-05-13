import "./UIMerge.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProjectStore } from "../../store/slices/ProjectSlice";
import { getRepoStore } from "../../store/slices/RepoSlice";
import {
  getIssueStore,
  getMergeStore,
  getMRIssueAssociationStore,
} from "../../store/slices/IssueSlice";
import ProTable, { ProColumns } from "@ant-design/pro-table";
import { IssueProps, MergeRequestProps } from "../../store/ConfigureStore";
import { MRId2MRInfo, userId2UserInfo } from "../../utils/Association";
import { UIIssueCardPreview } from "./UIIssueCard";
import { Typography } from "antd";
import { getRDTSInfo } from "../../store/functions/RDTS";
import { useParams } from "react-router-dom";
import { SyncOutlined, ReloadOutlined } from "@ant-design/icons";
import moment from "moment";
import { addRDTSTimer } from "../../utils/Timer";
import { UIUserCardPreview } from "../ums/UIUserCard";
import request_json from "../../utils/Network";
import API from "../../utils/APIList";

const IssueRelatedMerge = (props: { issueId: number; repo: number }) => {
  // get project id
  const params = useParams();
  const project_id = Number(params.id);

  const issueId = props.issueId;
  const [relatedMerge, setRelatedMerge] = useState("-");
  const [relatedMergeTitle, setRelatedMergeTitle] = useState("");

  const mergeStore = useSelector(getMergeStore);

  const reload_related_merge = async () => {
    const association_list = await request_json(API.GET_RDTS, {
      getParams: { repo: props.repo, type: "issue-mr", issueId: props.issueId },
    });
    if (association_list.code === 0) {
      if (association_list.data.length > 0) {
        const mr_info = await MRId2MRInfo(
          association_list.data[0].MR,
          mergeStore,
          project_id
        );

        setRelatedMerge(props.repo + "-!" + mr_info.merge_id);
        setRelatedMergeTitle(mr_info.title);
      }
    }
    // console.debug("association_list", association_list);
  };

  useEffect(() => {
    reload_related_merge();
  }, [issueId]);

  return <div title={relatedMergeTitle}>{relatedMerge}</div>;
};

const UIIssue = () => {
  const dispatcher = useDispatch();

  const projectStore = useSelector(getProjectStore);
  const repoStore = useSelector(getRepoStore);
  const issueStore = useSelector(getIssueStore);

  const issueMergeStore = useSelector(getMRIssueAssociationStore);

  // Get project_id
  const params = useParams();
  const project_id = Number(params.id);

  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(moment());

  useEffect(() => {
    // Add RDTS Timer
    // addRDTSTimer(() => {
    //   setIsUpdating(true);
    //   getRDTSInfo(dispatcher, project_id).then(() => {
    //     setIsUpdating(false);
    //     setLastUpdate(moment());
    //   });
    // });
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
      title: "提交者",
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
                  previewSize={30}
                />
              </div>
            );
          }
        }
        return (
          <div
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {user}
          </div>
        );
      },
    },
    {
      title: "解决者",
      width: "12%",
      ellipsis: true,
      dataIndex: "createdBy",
      align: "center",
      render: (_, record) => {
        const user = record.assigneeUserName || "-";
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
                  previewSize={30}
                />
                {/*<span>{"@" + find_result.name}</span>*/}
              </div>
            );
          }
        }
        return (
          <div
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {user}
          </div>
        );
      },
    },
    {
      title: "关联合并请求",
      width: "15%",
      ellipsis: true,
      dataIndex: "Merge",
      align: "center",
      render: (_, record) => {
        return <IssueRelatedMerge issueId={record.id} repo={record.repo} />;
        // const filtered_list = JSON.parse(issueMergeStore).data.filter(
        //   (asso: any) => asso.commit === record.id
        // );
        // if (filtered_list.length > 0) {
        //   currAssociatedSRId = filtered_list[0].SR;
        // }
        // return <CommitRelatedSR currAssociatedSRId={currAssociatedSRId} />;
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
              {/*<Typography.Text style={{ width: "10rem", marginRight: "1rem" }}>*/}
              {/*  上次更新：{lastUpdate.fromNow()}*/}
              {/*</Typography.Text>*/}
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
        params={{ lastUpdate: lastUpdate }}
        request={async ({ pageSize, current }, sort, filter) => {
          const retrieved_data = await request_json(API.GET_BUGS_PAGED, {
            getParams: {
              from: ((current as number) - 1) * (pageSize as number),
              size: pageSize,
              project: project_id,
            },
          });
          // console.debug(retrieved_data);

          return {
            data: retrieved_data.data.payload,
            success: true,
            total: retrieved_data.data.total_size,
          };
        }}
        defaultSize={"small"}
        // dataSource={data_source}
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
