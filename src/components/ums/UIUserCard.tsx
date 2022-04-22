import React, { useEffect, useState } from "react";
import ReactEcharts from "echarts-for-react";
import "./UIUserCard.css";
import { Avatar, Divider, Modal } from "antd";
import getUserAvatar from "../../utils/UserAvatar";
import moment from "moment";
import { getCommitCountInfo } from "../../store/functions/UMS";
import { useDispatch } from "react-redux";
import Loading from "../../layout/components/Loading";

interface UIUserCardProps {
  readonly userStore: string;
  readonly visible: boolean;
  readonly close: () => void;
}

const UIUserCard = (props: UIUserCardProps) => {
  const userInfo = JSON.parse(props.userStore).data;
  const [commitInfo, setCommitInfo] = useState("");
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
    getCommitCountInfo(dispatcher, props.userStore).then((data: any) => {
      console.log(data);
      const date = new Date(); // 当前时间
      const date_now = date.getTime();
      date.setFullYear(date.getFullYear() - 1); // 去年时间
      const date_past = date.getTime();
      const commitData = getAllDay(date_past, date_now);
      data.forEach((activity: any) => {
        const commitTimes = activity.data[0].commit_times;
        commitTimes.forEach((commitTime: any) => {
          commitData[moment(commitTime * 1000).format("YYYY-MM-DD")]++;
        });
      });
      setCommitInfo(JSON.stringify(commitData));
    });
  }, []);

  if (commitInfo === "") return <Loading />;

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
        userInfo.user.name +
        "    加入 ReqMan 于" +
        moment(userInfo.user.createdAt * 1000).format("YYYY-MM-DD"),
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
      type: "piecewise",
      orient: "horizontal",
      left: "center",
      top: 65,
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
            src={getUserAvatar(props.userStore)}
          />
          <ReactEcharts option={option} style={{ width: "100%" }} />
        </div>
        <div className="UserCard-modal-down">
          <div className="UserCard-modal-down-left">left</div>
          <Divider type="vertical" />
          <div className="UserCard-modal-down-right">right</div>
        </div>
      </div>
    </Modal>
  );
};

interface UIUserCardPreviewProps {
  readonly userStore: string; // 保证非空
}

const UIUserCardPreview = (props: UIUserCardPreviewProps) => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <UIUserCard
        visible={visible}
        close={() => setVisible(false)}
        userStore={props.userStore}
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
          src={getUserAvatar(props.userStore)}
        />
      </div>
    </>
  );
};

export { UIUserCardPreview, UIUserCard };
