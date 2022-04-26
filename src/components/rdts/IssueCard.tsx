import React, { useState } from "react";
import { IssueProps } from "../../store/ConfigureStore";
import { UIIssueCard } from "./UIIssueCard";
import { Space, Tag, Typography } from "antd";
import "./IssueCard.css";
import Text from "antd/es/typography/Text";

interface IssueCardProps {
  readonly data: string;
}

const IssueCard = (props: IssueCardProps) => {
  const data: IssueProps = JSON.parse(props.data);
  console.log(data);
  const [visible, setVisible] = useState(false);

  const getBackgroundColor = (state: "closed" | "opened") => {
    switch (state) {
      case "closed":
        return "#f0f0f0";
      case "opened":
        return "#ffe5e5";
    }
  };

  const getIssueState = (state: "closed" | "opened") => {
    switch (state) {
      case "closed":
        return "已解决";
      case "opened":
        return "修复中";
    }
  };

  return (
    <>
      <UIIssueCard
        data={props.data}
        visible={visible}
        close={() => setVisible(false)}
      />
      <div
        className="IssueCard-small"
        onClick={() => {
          setVisible(true);
        }}
      >
        <div className="IssueCard-small-header">
          <span className="IssueCard-small-header-left">{data.title}</span>
          <div className="IssueCard-small-header-right"></div>
        </div>
        <div className="IssueCard-small-description">
          <Typography>
            <Text ellipsis={true}>{data.description}</Text>
          </Typography>
        </div>
        <div className="IssueCard-small-down">
          <span>{"@" + data.authoredByUserName}</span>
          <Space>
            <Tag
              color={getBackgroundColor(data.state)}
              style={{
                color: "black",
                borderRadius: "10px",
                fontWeight: "bold",
              }}
            >
              {getIssueState(data.state)}
            </Tag>
          </Space>
        </div>
      </div>
    </>
  );
};

export default IssueCard;
