import React, { useState } from "react";
import { UIMergeCard } from "./UIMergeCard";
import { Avatar, Space, Tag, Typography } from "antd";
import { state2ChineseState, state2Color } from "../../utils/SRStateConvert";
import getUserAvatar from "../../utils/UserAvatar";
import "./MRCard.css";
import moment from "moment";
import Text from "antd/es/typography/Text";

interface MRCardProps {
  SRListStore: string;
  MRSRAssociationStore: string;
  data: string;
}

const MRCard = (props: MRCardProps) => {
  const data = JSON.parse(props.data);
  console.log(data);
  const [visible, setVisible] = useState(false);
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
          <div className="MRCard-small-header-left">{data.title}</div>
          <div className="MRCard-small-header-right"></div>
        </div>
        <div className="MRCard-small-description">
          <Typography>
            <Text ellipsis={true}>{data.description}</Text>
          </Typography>
        </div>
        <div className="MRCard-small-down">
          <Avatar.Group></Avatar.Group>
          <div>
            {data.authoredAt
              ? moment(data.authoredAt * 1000).format("YYYY-MM-DD HH:mm:ss")
              : "无创建时间记录"}
          </div>
          <div>
            {data.authoredAt
              ? moment(data.reviewedAt * 1000).format("YYYY-MM-DD HH:mm:ss")
              : "无创建时间记录"}
          </div>
        </div>
      </div>
      <a onClick={() => setVisible(true)}>{data.title}</a>
    </>
  );
};

export default MRCard;
