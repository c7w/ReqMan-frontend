import React, { useEffect } from "react";
import UserActivityType from "../../utils/UserActivityType";
import {
  BugTwoTone,
  CheckCircleTwoTone,
  BulbTwoTone,
  SmileTwoTone,
  BranchesOutlined,
} from "@ant-design/icons";
import { Divider } from "antd";
import { UIIssueCardPreview } from "../rdts/UIIssueCard";
import { useDispatch, useSelector } from "react-redux";
import { getRepoStore } from "../../store/slices/RepoSlice";
import { getRDTSInfo, getRepoInfo } from "../../store/functions/RDTS";
import { getProjectStore } from "../../store/slices/ProjectSlice";
import { updateProjectInfo } from "../../store/functions/UMS";
import Loading from "../../layout/components/Loading";
import { repoId2RepoInfo } from "../../utils/Association";
import { UIMergeCardPreview } from "../rdts/UIMergeCard";
import { getSRListStore } from "../../store/slices/IRSRSlice";
import { getMRSRAssociationStore } from "../../store/slices/IssueSlice";

interface UIUserActivityProps {
  activity: string;
  userStore: string;
  // { type: UserActivityType; timestamp: number; info: any }
}

const UIUserActivity = (props: UIUserActivityProps) => {
  const activity = JSON.parse(props.activity);
  const userInfo = JSON.parse(props.userStore).data;
  const repoStore = useSelector(getRepoStore);
  const SRListStore = useSelector(getSRListStore);
  const MRSRAssoStore = useSelector(getMRSRAssociationStore);
  const dispatcher = useDispatch();
  console.log(activity);
  useEffect(() => {
    getRDTSInfo(dispatcher, activity.project).then((data: any) => {
      return;
    });
  }, []);
  if (repoStore === "" || MRSRAssoStore === "" || SRListStore === "")
    return <Loading />;
  return (
    <>
      <div
        className="user-activity"
        style={{ display: "flex", flexDirection: "row", height: "8vh" }}
      >
        <div
          className="user-activity-icon"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginRight: "1rem",
          }}
        >
          {(() => {
            switch (activity.type) {
              case UserActivityType.OPEN_ISSUE:
                return (
                  <BugTwoTone
                    twoToneColor="red"
                    style={{ fontSize: "1.5rem" }}
                  />
                );
              case UserActivityType.CLOSE_ISSUE:
                return (
                  <CheckCircleTwoTone
                    twoToneColor="#52c41a"
                    style={{ fontSize: "1.5rem" }}
                  />
                );
              case UserActivityType.OPEN_MR:
                return (
                  <BulbTwoTone
                    twoToneColor="#52c41a"
                    style={{ fontSize: "1.5rem" }}
                  />
                );
              case UserActivityType.REVIEW_MR:
                return <BranchesOutlined style={{ fontSize: "1.5rem" }} />;
              default:
                return <SmileTwoTone style={{ fontSize: "1.5rem" }} />;
            }
          })()}
        </div>
        <div className="user-activity-content">
          <span style={{ fontWeight: "bold", fontSize: "1rem" }}>
            {"@ " + userInfo.user.name}
          </span>
          <div className="user-activity-description">
            {(() => {
              let description = "";
              switch (activity.type) {
                case UserActivityType.OPEN_ISSUE:
                  description =
                    "在仓库 " +
                    repoId2RepoInfo(activity.info.repo, repoStore).title +
                    " 中" +
                    "提交项目缺陷 (" +
                    activity.info.repo +
                    "-#" +
                    activity.info.issue_id +
                    ") :   ";
                  return (
                    <>
                      {description}
                      <br />
                      <UIIssueCardPreview
                        data={JSON.stringify(activity.info)}
                      />
                    </>
                  );
                case UserActivityType.CLOSE_ISSUE:
                  description =
                    "在仓库 " +
                    repoId2RepoInfo(activity.info.repo, repoStore).title +
                    " 中" +
                    "关闭项目缺陷 (" +
                    activity.info.repo +
                    "-#" +
                    activity.info.issue_id +
                    ") :   ";
                  return (
                    <>
                      {description}
                      <br />
                      <UIIssueCardPreview
                        data={JSON.stringify(activity.info)}
                      />
                    </>
                  );
                case UserActivityType.OPEN_MR:
                  description =
                    "在仓库 " +
                    repoId2RepoInfo(activity.info.repo, repoStore).title +
                    " 中" +
                    "发起合并请求 (" +
                    activity.info.repo +
                    "-#" +
                    activity.info.merge_id +
                    ") :   ";
                  return (
                    <>
                      {description}
                      <br />
                      <UIMergeCardPreview
                        SRListStore={SRListStore}
                        MRSRAssociationStore={MRSRAssoStore}
                        data={JSON.stringify(activity.info)}
                      />
                    </>
                  );
                case UserActivityType.REVIEW_MR:
                  description =
                    "在仓库 " +
                    repoId2RepoInfo(activity.info.repo, repoStore).title +
                    " 中" +
                    "审核合并请求 (" +
                    activity.info.repo +
                    "-#" +
                    activity.info.merge_id +
                    ") :   ";
                  return (
                    <>
                      {description}
                      <br />
                      <UIMergeCardPreview
                        SRListStore={SRListStore}
                        MRSRAssociationStore={MRSRAssoStore}
                        data={JSON.stringify(activity.info)}
                      />
                    </>
                  );
                default:
                  return <SmileTwoTone style={{ fontSize: "1.5rem" }} />;
              }
            })()}
          </div>
        </div>
      </div>
      <Divider />
    </>
  );
};

export default UIUserActivity;
