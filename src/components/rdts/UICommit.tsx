import "./UIMerge.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProjectStore } from "../../store/slices/ProjectSlice";
import { getRepoStore } from "../../store/slices/RepoSlice";
import {
  getCommitSRAssociationStore,
  getCommitStore,
  getIssueStore,
} from "../../store/slices/IssueSlice";
import ProTable, { ProColumns } from "@ant-design/pro-table";
import { CommitProps, IssueProps } from "../../store/ConfigureStore";
import { SRId2SRInfo, userId2UserInfo } from "../../utils/Association";
import { useParams } from "react-router-dom";
import moment from "moment";
import { addRDTSTimer } from "../../utils/Timer";
import { getRDTSInfo } from "../../store/functions/RDTS";
import { Typography } from "antd";
import { ReloadOutlined, SyncOutlined } from "@ant-design/icons";
import { UIUserCardPreview } from "../ums/UIUserCard";
import request_json from "../../utils/Network";
import API from "../../utils/APIList";
import { getSRListStore } from "../../store/slices/IRSRSlice";

const CommitRelatedSR = (props: { currAssociatedSRId: number }) => {
  const currAssociatedSRId = props.currAssociatedSRId;

  const SRListStore = useSelector(getSRListStore);

  const params = useParams<"id">();
  const project_id = Number(params.id);

  const [related, setRelated] = useState("-");

  const resetRelated = async () => {
    if (currAssociatedSRId > 0) {
      setRelated(
        (await SRId2SRInfo(currAssociatedSRId, SRListStore, project_id)).title
      );
    } else {
      setRelated("-");
    }
  };

  useEffect(() => {
    resetRelated();
  }, [currAssociatedSRId]);

  return <div style={{}}>{related}</div>;
};

const UICommit = () => {
  const dispatcher = useDispatch();

  const projectStore = useSelector(getProjectStore);
  const repoStore = useSelector(getRepoStore);
  const commitStore = useSelector(getCommitStore);

  const commitSRStore = useSelector(getCommitSRAssociationStore);

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
        const user = record.commiter_email;
        if (record.user_committer > 0) {
          const find_result = userId2UserInfo(
            record.user_committer,
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
      title: "关联功能需求",
      width: "15%",
      ellipsis: true,
      dataIndex: "SR",
      align: "center",
      render: (_, record) => {
        let currAssociatedSRId = -1;
        const filtered_list = JSON.parse(commitSRStore).data.filter(
          (asso: any) => asso.commit === record.id
        );
        if (filtered_list.length > 0) {
          currAssociatedSRId = filtered_list[0].SR;
        }
        return <CommitRelatedSR currAssociatedSRId={currAssociatedSRId} />;
      },
    },
  ];

  const data_source = JSON.parse(commitStore).data;

  return (
    <div className={"merge-card"}>
      <ProTable<CommitProps>
        headerTitle="项目贡献查看"
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
                        setLastUpdate(moment());
                      })
                      .finally(() => {
                        setTimeout(() => {
                          setIsUpdating(false);
                        }, 500);
                        // setIsUpdating(false);
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
        params={{ lastUpdate: lastUpdate }}
        request={async ({ pageSize, current }, sort, filter) => {
          const retrieved_data = await request_json(API.GET_COMMITS_PAGED, {
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

export default UICommit;
