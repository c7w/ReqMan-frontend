import React, { useState } from "react";
import { UIMergeCard } from "./UIMergeCard";
import { Avatar, Space, Tag, Typography } from "antd";
import "./MRCard.css";
import Text from "antd/es/typography/Text";
import { userId2UserInfo } from "../../utils/Association";
import { getProjectStore } from "../../store/slices/ProjectSlice";
import { useSelector } from "react-redux";

interface MRCardProps {
  SRListStore: string;
  MRSRAssociationStore: string;
  data: string;
}

const MRCard = (props: MRCardProps) => {
  const data = JSON.parse(props.data);
  const rgx_match = data.title.match(new RegExp("\\[(.*?)\\] (.*)")); // 匹配 [SR.001.001] sth

  const projectInfo = useSelector(getProjectStore);

  const title = rgx_match[1];
  const description = rgx_match[2];
  const [visible, setVisible] = useState(false);
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

  let username = data.authoredByUserName;
  if (data.user_authored > 0) {
    username = userId2UserInfo(data.user_authored, projectInfo)?.name;
  }

  return (
    <>
      <UIMergeCard
        data={props.data}
        visible={visible}
        close={() => setVisible(false)}
        MRSRAssociationStore={props.MRSRAssociationStore}
        SRListStore={props.SRListStore}
      />
      <div
        className="MRCard-small"
        onClick={() => {
          setVisible(true);
        }}
      >
        <div className="MRCard-small-header">
          <span className="MRCard-small-header-left">{title}</span>
          <div className="MRCard-small-header-right"></div>
        </div>
        <div className="MRCard-small-description">
          <Typography>
            <Text ellipsis={true}>{description}</Text>
          </Typography>
        </div>
        <div className="MRCard-small-down">
          <span>{"@" + username}</span>
          <Space>
            <Tag
              color={getBackgroundColor(data.state)}
              style={{
                color: "black",
                borderRadius: "10px",
                fontWeight: "bold",
              }}
            >
              {getMergeState(data.state)}
            </Tag>
          </Space>
        </div>
      </div>
    </>
  );
};

export default MRCard;
