import React, { useState } from "react";
import ReactEcharts from "echarts-for-react";
import "./UIUserCard.css";
import { Avatar, Divider, Modal } from "antd";
import getUserAvatar from "../../utils/UserAvatar";
import moment from "moment";

interface UIUserCardProps {
  readonly userStore: string;
  readonly visible: boolean;
  readonly close: () => void;
}

const UIUserCard = (props: UIUserCardProps) => {
  const userInfo = JSON.parse(props.userStore).data;
  console.log(userInfo);

  const date = new Date(); // 当前时间
  const date_now = moment(date.getTime()).format("YYYY-MM-DD"); // 格式化当前时间
  date.setFullYear(date.getFullYear() - 1); // 去年时间
  const date_past = moment(date.getTime()).format("YYYY-MM-DD"); // 格式化去年时间

  const test = [
    ["2022-04-20", "10"],
    ["2022-04-21", "20"],
    ["2022-04-22", "50"],
  ];

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
      max: 100,
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
      itemStyle: {
        borderWidth: 0.5,
      },
      yearLabel: { show: false },
    },
    series: {
      type: "heatmap",
      coordinateSystem: "calendar",
      tooltip: {
        formatter: (params: any) => {
          return params.data[0] + "：" + params.data[1] + "个贡献";
        },
      },
      data: test,
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
