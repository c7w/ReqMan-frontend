import "./UIMerge.css";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { IRCardProps, MergeRequestProps } from "../../store/ConfigureStore";
import { Button, Popconfirm, Progress, Typography } from "antd";
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
import { addRDTSTimer } from "../../utils/Timer";
import { getRDTSInfo } from "../../store/functions/RDTS";
import { useParams } from "react-router-dom";
import { ReloadOutlined, SyncOutlined } from "@ant-design/icons";
import { UIUserCardPreview } from "../ums/UIUserCard";
import request_json from "../../utils/Network";
import API from "../../utils/APIList";

const MergeRelatedSR = (props: {
  currAssociatedSRId: number;
  show_digest?: boolean;
}) => {
  const currAssociatedSRId = props.currAssociatedSRId;
  const show_digest = props.show_digest || false;

  // get project id
  const params = useParams<"id">();
  const project_id = Number(params.id);

  const SRListStore = useSelector(getSRListStore);

  const [related, setRelated] = useState("-");
  const [desp, setDesp] = useState("-");

  const resetRelated = async () => {
    // console.debug("related", currAssociatedSRId);
    if (currAssociatedSRId !== undefined && currAssociatedSRId > 0) {
      const res = await SRId2SRInfo(
        currAssociatedSRId,
        SRListStore,
        project_id
      );

      setRelated(res.title);
      setDesp(res.description);
    } else {
      setRelated("-");
      setDesp("-");
    }
  };

  useEffect(() => {
    resetRelated();
  }, [currAssociatedSRId]);

  let display_message = "";
  let display_title = "";
  if (show_digest) {
    if (related === "-" && desp === "-") {
      display_message = "未关联功能需求";
      display_title = "未关联功能需求";
    } else {
      display_message = `[${related}]  ${desp}`;
      display_title = `[${related}]  ${desp}`;
    }
  } else {
    if (related === "-" && desp === "-") {
      display_message = "-";
      display_title = "未关联功能需求";
    } else {
      display_message = related;
      display_title = `[${related}]  ${desp}`;
    }
  }

  return (
    <div
      style={{
        marginLeft: props.show_digest ? "2rem" : "0",
        marginTop: props.show_digest ? "1rem" : "0rem",
      }}
      title={display_title}
    >
      {display_message}
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
      title: "合并请求合入者",
      width: "15%",
      ellipsis: true,
      dataIndex: "mergedBy",
      align: "center",
      render: (_, record) => {
        const user = record.reviewedByUserName || "-";
        if (record.user_reviewed > 0) {
          const find_result = userId2UserInfo(
            record.user_reviewed,
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
        // console.debug(JSON.parse(MRSRAssoStore).data);
        const filtered_list = JSON.parse(MRSRAssoStore).data.filter(
          (asso: any) => asso.MR === record.id
        );
        if (filtered_list.length > 0) {
          currAssociatedSRId = filtered_list[0].SR;
        }
        return <MergeRelatedSR currAssociatedSRId={currAssociatedSRId} />;
      },
    },
  ];

  const data_source = JSON.parse(mergeStore).data;

  return (
    <div className={"merge-card"}>
      <ProTable<MergeRequestProps>
        headerTitle="项目合并请求查看"
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
        // dataSource={data_source}
        rowKey="id"
        params={{ lastUpdate: lastUpdate }}
        request={async ({ pageSize, current }, sort, filter) => {
          const retrieved_data = await request_json(API.GET_MERGES_PAGED, {
            getParams: {
              from: ((current as number) - 1) * (pageSize as number),
              size: pageSize,
              project: project_id,
            },
          });
          console.debug(retrieved_data);

          return {
            data: retrieved_data.data.payload,
            success: true,
            total: retrieved_data.data.total_size,
          };
        }}
        pagination={{ position: ["bottomRight"] }}
        tableStyle={{ padding: "1rem 1rem 2rem" }}
        dateFormatter="string"
        search={false}
      />
    </div>
  );
};

export default UIMerge;
export { MergeRelatedSR };
