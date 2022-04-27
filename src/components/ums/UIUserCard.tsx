import React, { useEffect, useState } from "react";
import ReactEcharts from "echarts-for-react";
import "./UIUserCard.css";
import { Avatar, Divider, Modal } from "antd";
import moment from "moment";
import { getCommitCountInfo } from "../../store/functions/UMS";
import { useDispatch } from "react-redux";
import Loading from "../../layout/components/Loading";
import { getRDTSInfo } from "../../store/functions/RDTS";
import UserActivityType from "../../utils/UserActivityType";
import UIUserActivityList from "./UIUserActivityList";
import UIProjectList from "../rms/UIProjectList";
import CryptoJS from "crypto-js";

interface UIUserCardProps {
  readonly projectStore: string;
  // readonly yourSelf: boolean; // 是否是自己的
  readonly userId: number;
  // readonly projectStore: string;
  readonly visible: boolean;
  readonly close: () => void;
}

const UIUserCard = (props: UIUserCardProps) => {
  // const userInfo = JSON.parse(props.projectStore).data.users.filter(
  //   (user: any) => user.id === props.userId
  // )[0];
  const projectInfo = JSON.parse(props.projectStore).data;
  // console.log(projectInfo);
  const userInfo = projectInfo.users.filter(
    (user: any) => user.id === props.userId
  )[0];
  // console.log(userInfo);
  const [commitInfo, setCommitInfo] = useState("");
  const [myActivities, setActivities] = useState("");
  const dispatcher = useDispatch();

  const date = new Date(); // 当前时间
  const date_now = moment(date.getTime()).format("YYYY-MM-DD"); // 格式化当前时间
  date.setFullYear(date.getFullYear() - 1); // 去年时间
  const date_past = moment(date.getTime()).format("YYYY-MM-DD"); // 格式化去年时间
  // 获得一年内的所有天
  const getAllDay = (start_tmp: number, end_tmp: number) => {
    const dateDic: any = {};
    const start = new Date(start_tmp);
    const end = new Date(end_tmp);
    while (end.getTime() - start.getTime() >= 0) {
      const year = start.getFullYear();
      const month =
        (start.getMonth() + 1).toString().length === 1
          ? "0" + (start.getMonth() + 1).toString()
          : start.getMonth() + 1;
      const day =
        start.getDate().toString().length === 1
          ? "0" + start.getDate().toString()
          : start.getDate();
      dateDic[year + "-" + month + "-" + day] = 0;
      start.setDate(start.getDate() + 1);
    }
    return dateDic;
  };

  useEffect(() => {
    getCommitCountInfo(dispatcher, projectInfo.project.id).then((data: any) => {
      const date = new Date(); // 当前时间
      const date_now = date.getTime();
      date.setFullYear(date.getFullYear() - 1); // 去年时间
      const date_past = date.getTime();
      const commitData = getAllDay(date_past, date_now);
      // console.log(data);
      const commitTimes = data.data.commit_times;
      commitTimes.forEach((commitTime: any) => {
        commitData[moment(commitTime * 1000).format("YYYY-MM-DD")]++;
      });
      setCommitInfo(JSON.stringify(commitData));
    });
    getRDTSInfo(dispatcher, projectInfo.project.id).then((data: any) => {
      // console.log(data);
      const myActivities: any = {
        activities: Array<{
          type: UserActivityType;
          timestamp: number;
          info: any;
          project: number;
        }>(),
      };
      const project_id = projectInfo.project.id;
      const issueInfo = data[0].data;
      const MRInfo = data[2].data;
      // 加入 open issue 和 close issue 两个活动
      issueInfo.forEach((issue: any) => {
        if (issue.user_authored === props.userId) {
          myActivities.activities.push({
            type: UserActivityType.OPEN_ISSUE,
            timestamp: issue.authoredAt,
            info: issue,
            project: project_id,
          });
        }
        if (issue.user_closed === props.userId) {
          myActivities.activities.push({
            type: UserActivityType.CLOSE_ISSUE,
            timestamp: issue.closedAt,
            info: issue,
            project: project_id,
          });
        }
      });
      // 加入 open MR 和 close MR 两个活动
      MRInfo.forEach((mr: any) => {
        if (mr.user_authored === props.userId) {
          myActivities.activities.push({
            type: UserActivityType.OPEN_MR,
            timestamp: mr.authoredAt,
            info: mr,
            project: project_id,
          });
        }
        if (mr.user_reviewed === props.userId) {
          myActivities.activities.push({
            type: UserActivityType.REVIEW_MR,
            timestamp: mr.reviewedAt,
            info: mr,
            project: project_id,
          });
        }
      });
      // 按时间戳倒序，将最新活动放在前面
      myActivities.activities.sort((value1: any, value2: any) => {
        return value1.timestamp < value2.timestamp
          ? 1
          : value1.timestamp === value2.timestamp
          ? 0
          : -1;
      });
      setActivities(JSON.stringify(myActivities));
    });
  }, []);

  if (commitInfo === "" || myActivities === "") return <></>;

  const commitDataObj = JSON.parse(commitInfo);
  const keys = Object.keys(commitDataObj);
  const values = Object.values(commitDataObj);
  const commitData = keys.map((key: string, index) => [key, values[index]]);

  const option = {
    title: {
      top: 20,
      left: "center",
      text:
        "@ " +
        userInfo.name +
        "    加入 ReqMan 于" +
        moment(userInfo.createdAt * 1000).format("YYYY-MM-DD"),
      textStyle: {
        fontSize: 15,
      },
    },
    tooltip: {
      trigger: "item",
    },
    visualMap: {
      min: 0,
      max: 20,
      type: "continuous",
      orient: "horizontal",
      left: "center",
      calculable: true,
      top: 50,
      inRange: {
        color: ["#ffffff", "#ff7f50"],
      },
    },
    calendar: {
      top: 120,
      left: 30,
      right: 30,
      range: [date_past, date_now],
      cellSize: ["auto", 13],
      splitLine: {
        show: true,
        lineStyle: {
          color: "#000",
          width: 2,
          type: "solid",
        },
      },
      itemStyle: {
        borderWidth: 0.5,
        color: "#000",
      },
      yearLabel: { show: false },
    },
    series: {
      type: "heatmap",
      universalTransition: "enabled",
      coordinateSystem: "calendar",
      tooltip: {
        formatter: (params: any) => {
          return params.data[0] + "：" + params.data[1] + "个贡献";
        },
      },
      data: commitData,
      emphasis: {
        itemStyle: {
          shadowBlur: 5,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  };
  return (
    <Modal
      centered={true}
      footer={null}
      destroyOnClose={true}
      visible={props.visible}
      onCancel={() => props.close()}
      width={"80%"}
      title={"个人信息"}
    >
      <div className="UserCard-modal">
        <div className="UserCard-modal-up">
          <Avatar
            className="SRCard-small-avatar"
            size={100}
            src={
              userInfo.avatar.length < 5
                ? `https://www.gravatar.com/avatar/${CryptoJS.MD5(
                    userInfo.email
                  )}`
                : userInfo.avatar
            }
          />
          <ReactEcharts option={option} style={{ width: "100%" }} />
        </div>
        <div className="UserCard-modal-down">
          <div className="UserCard-activity">
            <div className="UserCard-activity-header" style={{ width: "100%" }}>
              <span style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
                我的动态
              </span>
            </div>
            <UIUserActivityList
              myActivities={myActivities}
              userInfo={JSON.stringify(userInfo)}
            />
          </div>
          {/*<div className="UserCard-projects">*/}
          {/*  <span style={{ fontWeight: "bold", fontSize: "1.5rem" }}>*/}
          {/*    我的项目*/}
          {/*  </span>*/}
          {/*</div>*/}
        </div>
      </div>
    </Modal>
  );
};

interface UIUserCardPreviewProps {
  readonly projectStore: string;
  readonly userId: number;
  // readonly yourSelf: boolean;
}

const UIUserCardPreview = (props: UIUserCardPreviewProps) => {
  const [visible, setVisible] = useState(false);
  const projectInfo = JSON.parse(props.projectStore).data;
  const userInfo = projectInfo.users.filter(
    (user: any) => user.id === props.userId
  )[0];
  return (
    <>
      <UIUserCard
        visible={visible}
        close={() => setVisible(false)}
        projectStore={props.projectStore}
        userId={props.userId}
        // projectStore={props.projectStore}
        // yourSelf={props.yourSelf}
      />
      <div
        className="UserCard-small"
        onClick={() => {
          setVisible(true);
        }}
      >
        <Avatar
          className="UserCard-small-avatar"
          size="small"
          src={
            userInfo.avatar.length < 5
              ? `https://www.gravatar.com/avatar/${CryptoJS.MD5(
                  userInfo.email
                )}`
              : userInfo.avatar
          }
        />
      </div>
    </>
  );
};

export { UIUserCardPreview, UIUserCard };