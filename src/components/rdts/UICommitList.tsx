import React, { useEffect, useState } from "react";
import { Empty, Space, Tag, Timeline } from "antd";
import moment from "moment";

interface UICommitListProps {
  commitListData: string;
  userInfo: string;
}

const UICommitList = (props: UICommitListProps) => {
  const [commitListData, setCommitListData] = useState([]);
  useEffect(() => {
    if (props.commitListData !== "") {
      const newCommitListData: any = [];
      const commitList = JSON.parse(props.commitListData);
      if (commitList && commitList !== []) {
        for (let i = commitList.length - 1; i >= 0; i--) {
          newCommitListData.push(
            <Timeline.Item
              key={commitList[i].id}
              label={
                <>
                  <span style={{ fontWeight: "bold" }}>
                    {"@" + commitList[i].commiter_name + " "}
                  </span>
                  &nbsp;&nbsp;
                  <span>
                    {moment(commitList[i].createdAt * 1000).format(
                      "YYYY-MM-DD HH:mm:ss"
                    )}
                  </span>
                </>
              }
            >
              <span>{commitList[i].title}</span>
            </Timeline.Item>
          );
        }
      }
      setCommitListData(newCommitListData);
    }
  }, [props.commitListData]);

  return (
    <div
      className="SRModal-content-SRChangeLog"
      style={{
        maxWidth: "50vw",
        overflowY: "scroll",
        maxHeight: "25vh",
        paddingTop: "1rem",
        paddingRight: "1rem",
      }}
    >
      {commitListData.length === 0 ? (
        <Empty />
      ) : (
        <Timeline mode="left">{commitListData}</Timeline>
      )}
    </div>
  );
};

export default UICommitList;
