import React, { useEffect, useState } from "react";
import { Empty, Space, Tag, Timeline } from "antd";
import moment from "moment";
import { state2ChineseState, state2Color } from "../../utils/SRStateConvert";
import { userId2UserInfo } from "../../utils/Association";

interface SRChangeLogListProps {
  SRChangeLogListInfo: string;
  projectStore: string;
}

const UISRChangeLogList = (props: SRChangeLogListProps) => {
  const [SRChangeLogListData, setSRChangeLogListData] = useState([]);

  useEffect(() => {
    if (props.SRChangeLogListInfo !== "" && props.projectStore !== "") {
      const newSRChangeLogList: any = [];
      const SRChangeLogList = JSON.parse(props.SRChangeLogListInfo).data;
      if (SRChangeLogList && SRChangeLogList !== []) {
        for (let i = SRChangeLogList.length - 1; i >= 0; i--) {
          const userInfo = userId2UserInfo(
            SRChangeLogList[i].changedBy,
            props.projectStore
          );
          newSRChangeLogList.push(
            <Timeline.Item
              key={SRChangeLogList[i].id}
              label={
                <>
                  <span style={{ fontWeight: "bold" }}>
                    {"@" +
                      (userInfo === "not found" ? "anonymous" : userInfo.name) +
                      " "}
                  </span>
                  &nbsp;&nbsp;
                  <span>
                    {moment(SRChangeLogList[i].changedAt * 1000).format(
                      "YYYY-MM-DD HH:mm:ss"
                    )}
                  </span>
                </>
              }
            >
              <Space>
                <Tag
                  color={state2Color.get(SRChangeLogList[i].formerState)}
                  style={{ borderRadius: "10px" }}
                >
                  {state2ChineseState.get(SRChangeLogList[i].formerState)}
                </Tag>
              </Space>
              <span>{SRChangeLogList[i].description}</span>
            </Timeline.Item>
          );
        }
      }
      setSRChangeLogListData(newSRChangeLogList);
    }
  }, [props.SRChangeLogListInfo, props.projectStore]);

  return (
    <div
      className="SRModal-content-SRChangeLog"
      style={{
        maxWidth: "50vw",
        overflowY: "scroll",
        maxHeight: "35vh",
        paddingTop: "1rem",
        paddingRight: "1rem",
      }}
    >
      {SRChangeLogListData.length === 0 ? (
        <Empty />
      ) : (
        <Timeline mode="left">{SRChangeLogListData}</Timeline>
      )}
    </div>
  );
};

export default UISRChangeLogList;
