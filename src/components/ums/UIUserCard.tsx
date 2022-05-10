import React, { useEffect, useState } from "react";
import ReactEcharts from "echarts-for-react";
import "./UIUserCard.css";
import { Avatar, Divider, Modal, Tooltip } from "antd";
import moment from "moment";
import { getCommitCountInfo } from "../../store/functions/UMS";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../layout/components/Loading";
import UserActivityType from "../../utils/UserActivityType";
import UIUserActivityList from "./UIUserActivityList";
import CryptoJS from "crypto-js";
import { getIssueStore, getMergeStore } from "../../store/slices/IssueSlice";
import request_json from "../../utils/Network";
import API from "../../utils/APIList";

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

  const issueStore = useSelector(getIssueStore);
  const mergeStore = useSelector(getMergeStore);

  // console.log(userInfo);
  const [commitInfo, setCommitInfo] = useState("");
  const [myActivities, setActivities] = useState("");
  const [reload, setReload] = useState(0);
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

  const reset_activities = async () => {
    const myActivities: any = {
      activities: Array<{
        type: UserActivityType;
        timestamp: number;
        info: any;
        project: number;
      }>(),
    };
    const project_id = projectInfo.project.id;

    const res = await request_json(API.GET_RECENT_ACTIVITY, {
      body: {
        digest: false,
        limit: -1,
        project: project_id,
        dev_id: [props.userId],
      },
    });
    console.debug(res);
    for (const activity of res.data[0].merges) {
      if (activity.user_authored === props.userId) {
        myActivities.activities.push({
          type: UserActivityType.OPEN_MR,
          timestamp: activity.authoredAt,
          info: activity,
          project: project_id,
        });
      }
      if (activity.user_reviewed === props.userId) {
        myActivities.activities.push({
          type: UserActivityType.REVIEW_MR,
          timestamp: activity.reviewedAt,
          info: activity,
          project: project_id,
        });
      }
    }
    for (const activity of res.data[0].issues) {
      if (activity.user_authored === props.userId) {
        myActivities.activities.push({
          type: UserActivityType.OPEN_ISSUE,
          timestamp: activity.authoredAt,
          info: activity,
          project: project_id,
        });
      }
      if (activity.user_closed === props.userId) {
        myActivities.activities.push({
          type: UserActivityType.CLOSE_ISSUE,
          timestamp: activity.closedAt,
          info: activity,
          project: project_id,
        });
      }
    }

    for (const activity of res.data[0].commits) {
      myActivities.activities.push({
        type: UserActivityType.COMMIT,
        timestamp: activity.createdAt,
        info: activity,
        project: project_id,
      });
    }

    // 按时间戳倒序，将最新活动放在前面
    myActivities.activities.sort((value1: any, value2: any) => {
      return value1.timestamp < value2.timestamp
        ? 1
        : value1.timestamp === value2.timestamp
        ? 0
        : -1;
    });
    setActivities(JSON.stringify(myActivities));
  };

  useEffect(() => {
    if (reload > 0) {
      getCommitCountInfo(dispatcher, projectInfo.project.id, props.userId).then(
        (data: any) => {
          const date = new Date(); // 当前时间
          const date_now = date.getTime();
          date.setFullYear(date.getFullYear() - 1); // 去年时间
          const date_past = date.getTime();

          const commitData = getAllDay(date_past, date_now);
          // console.log(data);
          const commitTimes = data.data[0].commit_times;
          commitTimes.forEach((commitTime: any) => {
            commitData[moment(commitTime * 1000).format("YYYY-MM-DD")]++;
          });
          setCommitInfo(JSON.stringify(commitData));
        }
      );

      reset_activities();
    }
  }, [reload]);
  useEffect(() => {
    if (props.visible) {
      setReload(reload + 1);
    }
  }, [props.visible]);

  if (issueStore === "" || mergeStore === "") {
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
        <div>
          <Loading />
        </div>
      </Modal>
    );
  }

  if (commitInfo === "" || myActivities === "")
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
        <div>
          <Loading />
        </div>
      </Modal>
    );

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
      max: 30,
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
                ? `https://s1.ax1x.com/2022/05/08/O3S6sI.jpg`
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
        </div>
      </div>
    </Modal>
  );
};

interface UIUserCardPreviewProps {
  readonly projectStore: string;
  readonly userId: number;
  readonly previewSize: number;
}

const UIUserCardPreview = (props: UIUserCardPreviewProps) => {
  const [visible, setVisible] = useState(false);
  const projectInfo = JSON.parse(props.projectStore).data;
  // console.log(projectInfo);
  // console.log(props.userId);
  const userInfo = projectInfo.users.filter(
    (user: any) => user.id === props.userId
  )[0];

  if (userInfo === undefined) {
    console.debug("???");
    return <></>;
  }

  // console.log(userInfo);
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
      <Tooltip title={userInfo.name}>
        <div
          className="UserCard-small"
          onClick={() => {
            setVisible(true);
          }}
        >
          <Avatar
            className="UserCard-small-avatar"
            size={props.previewSize}
            src={
              userInfo.avatar.length < 5
                ? `https://s1.ax1x.com/2022/05/08/O3S6sI.jpg`
                : userInfo.avatar
            }
          />
        </div>
      </Tooltip>
    </>
  );
};

export { UIUserCardPreview, UIUserCard };
