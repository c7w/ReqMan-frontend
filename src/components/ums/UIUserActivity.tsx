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
  userInfo: string;
  // { type: UserActivityType; timestamp: number; info: any }
}

const UIUserActivity = (props: UIUserActivityProps) => {
  const activity = JSON.parse(props.activity);
  const userInfo = JSON.parse(props.userInfo);
  const repoStore = useSelector(getRepoStore);
  const SRListStore = useSelector(getSRListStore);
  const MRSRAssoStore = useSelector(getMRSRAssociationStore);
  const dispatcher = useDispatch();

  const timeFromNow = (dateTimeStamp: number) => {
    // dateTimeStamp是一个时间毫秒，注意时间戳是秒的形式，在这个毫秒的基础上除以 1000，就是十位数的时间戳。13位数的都是时间毫秒。
    const minute = 1000 * 60; //把分，时，天，周，半个月，一个月用毫秒表示
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const halfamonth = day * 15;
    const month = day * 30;
    const now = new Date().getTime(); //获取当前时间毫秒
    const diffValue = now - dateTimeStamp; //时间差
    let result = "";
    if (diffValue < 0) {
      return;
    }
    const minC = diffValue / minute; //计算时间差的分，时，天，周，月
    const hourC = diffValue / hour;
    const dayC = diffValue / day;
    const weekC = diffValue / week;
    const monthC = diffValue / month;
    //此处考虑小数情况
    if (monthC >= 1 && monthC < 4) {
      result = " " + Math.floor(monthC) + " 个月前";
    } else if (weekC >= 1 && weekC < 5) {
      result = " " + Math.floor(weekC) + " 周前";
    } else if (dayC >= 1 && dayC < 7) {
      result = " " + Math.floor(dayC) + " 天前";
    } else if (hourC >= 1 && hourC < 24) {
      result = " " + Math.floor(hourC) + " 小时前";
    } else if (minC >= 1 && minC < 60) {
      result = " " + Math.floor(minC) + " 分钟前";
    } else if (diffValue >= 0 && diffValue <= minute) {
      result = "刚刚";
    } else {
      const datetime = new Date();
      datetime.setTime(dateTimeStamp);
      const Nyear = datetime.getFullYear();
      const Nmonth =
        datetime.getMonth() + 1 < 10
          ? "0" + (datetime.getMonth() + 1)
          : datetime.getMonth() + 1;
      const Ndate =
        datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
      const Nhour =
        datetime.getHours() < 10
          ? "0" + datetime.getHours()
          : datetime.getHours();
      const Nminute =
        datetime.getMinutes() < 10
          ? "0" + datetime.getMinutes()
          : datetime.getMinutes();
      const Nsecond =
        datetime.getSeconds() < 10
          ? "0" + datetime.getSeconds()
          : datetime.getSeconds();
      result = Nyear + "-" + Nmonth + "-" + Ndate;
    }
    return result;
  };

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
        style={{
          display: "flex",
          flexDirection: "row",
          maxHeight: "15vh",
          width: "100%",
        }}
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
        <div className="user-activity-content" style={{ width: "100%" }}>
          <div
            className="user-activity-header"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontWeight: "bold", fontSize: "1rem" }}>
              {"@ " + userInfo.name}
            </span>
            <span>{timeFromNow(activity.timestamp * 1000)}</span>
          </div>
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
