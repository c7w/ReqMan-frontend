import { Modal, Space, Tag, Typography } from "antd";
import React, { useState } from "react";
import "./UIMergeCard.css";
import { MergeRequestProps } from "../../store/ConfigureStore";
import { userId2UserInfo } from "../../utils/Association";
import { useSelector } from "react-redux";
import { getProjectStore } from "../../store/slices/ProjectSlice";
import moment from "moment";

interface UIMergeCardProps {
  data: string;
  visible: boolean;
  close: () => void;
}

interface UIMergeCardPreviewProps {
  data: string;
}

const UIMergeCard = (props: UIMergeCardProps) => {
  const projectStore = useSelector(getProjectStore);
  const data: MergeRequestProps = JSON.parse(props.data);

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

  const getMergeState = (state: "closed" | "merged" | "opened") => {
    switch (state) {
      case "closed":
        return "已关闭";
      case "merged":
        return "已合并";
      case "opened":
        return "正在审核";
    }
  };

  let authoredBy = data.authoredByUserName;
  if (data.user_authored > 0) {
    const find_result = userId2UserInfo(data.user_authored, projectStore);
    if (find_result !== "not_found") {
      authoredBy = find_result.name;
    }
  }

  let reviewedBy = data.reviewedByUserName;
  if (data.user_reviewed > 0) {
    const find_result = userId2UserInfo(data.user_reviewed, projectStore);
    if (find_result !== "not_found") {
      reviewedBy = find_result.name;
    }
  }

  return (
    <Modal
      centered={true}
      destroyOnClose={true}
      visible={props.visible}
      onCancel={() => props.close()}
      width={"70%"}
      title={"合并请求查看"}
    >
      <div className={"meta-data"}>
        <Typography.Title level={4}>{data.title}</Typography.Title>
        <div>
          <span className={"meta-data-label"}>合并请求描述</span>
          <p style={{ marginLeft: "1rem" }}>
            {data.description === "" ? data.title : data.description}
          </p>
        </div>
        <div>
          <span className={"meta-data-label"}>合并请求状态</span>
          <Space>
            <Tag
              color={getBackgroundColor(data.state)}
              style={{
                color: "black",
                marginLeft: "1rem",
                fontWeight: "bold",
                padding: "0.2rem 0.5rem",
              }}
            >
              {getMergeState(data.state)}
            </Tag>
          </Space>
        </div>
        <div>
          <span className={"meta-data-label"}>合并请求发起人</span>
          <span style={{ marginLeft: "1rem" }}>{authoredBy}</span>
          &nbsp;&nbsp;
          <span>@&nbsp;&nbsp;{moment(data.authoredAt * 1000).calendar()}</span>
        </div>
        <div>
          <span className={"meta-data-label"}>合并请求负责人</span>
          <span style={{ marginLeft: "1rem" }}>{reviewedBy}</span>
          &nbsp;&nbsp;
          <span>@&nbsp;&nbsp;{moment(data.reviewedAt * 1000).calendar()}</span>
        </div>
      </div>
      <hr />
    </Modal>
  );
};

const UIMergeCardPreview = (props: UIMergeCardPreviewProps) => {
  const data = JSON.parse(props.data);
  const [visible, setVisible] = useState(false);
  return (
    <>
      <UIMergeCard
        data={props.data}
        visible={visible}
        close={() => setVisible(false)}
      />
      <a onClick={() => setVisible(true)}>{data.title}</a>
    </>
  );
};

export { UIMergeCard, UIMergeCardPreview };
