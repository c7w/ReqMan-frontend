import "./UIMerge.css";
import React from "react";
import moment from "moment";

interface MergeEntryProps {
  title: string;
  description: string;
  state: "merged" | "opened" | "closed";
  mid: number;
  associate_sr_id: number;
  author_id: number;
  author_time: number;
}

const SingleMergeEntry = (props: MergeEntryProps) => {
  const getBackgroundColor = () => {
    switch (props.state) {
      case "closed":
        return "#ffe5e5";
      case "merged":
        return "#e5ffe5";
      case "opened":
        return "#ffffff";
    }
  };

  const getIssueState = () => {
    switch (props.state) {
      case "closed":
        return "已关闭";
      case "merged":
        return "已合并";
      case "opened":
        return "正在审核";
    }
  };

  return (
    <div
      className="issuable-info-container"
      style={{ backgroundColor: getBackgroundColor() }}
    >
      <div className="issuable-main-info">
        <div className="merge-request-title">
          <span style={{ fontWeight: "bold" }}>[{props.title}]</span>
          &nbsp;&nbsp;
          <span>{props.description}</span>
        </div>
        <div className="issuable-info">
          <span className="issuable-reference">!{props.mid}</span>
          &nbsp;·&nbsp;
          <span className="author">{props.author_id}</span>
          &nbsp;·&nbsp;
          <span className="authoredAt">
            {moment(props.author_time * 1000).calendar()}
          </span>
        </div>
      </div>

      <div className="issuable-meta">
        <div className="issuable-status">{getIssueState()}</div>

        <div className="float-right issuable-updated-at d-none d-sm-inline-block">
          <span>关联 {props.associate_sr_id}</span>
        </div>
      </div>
    </div>
  );
};

const UIMerge = () => {
  return (
    <div className={"merge-card"}>
      <div
        style={{
          fontSize: "2rem",
          marginLeft: "1rem",
          userSelect: "none",
          alignSelf: "flex-start",
        }}
      >
        合并情况查看
      </div>
      <hr style={{ width: "98%", margin: "1rem auto" }} />
      <SingleMergeEntry
        title={"SR.001.001"}
        description={"Merge dev into master"}
        associate_sr_id={1}
        author_id={1}
        mid={64}
        state={"closed"}
        author_time={1649836206}
      />
    </div>
  );
};

export default UIMerge;
