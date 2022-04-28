import React, { useEffect, useState } from "react";
import { Empty, Space, Tag, Timeline } from "antd";
import moment from "moment";
import { state2ChineseState, state2Color } from "../../utils/SRStateConvert";
import { userId2UserInfo } from "../../utils/Association";

interface SRChangeLogListProps {
  SRChangeLogListInfo: string;
  projectStore: string;
  currState: string;
  description: string;
}

interface SRState {
  description: string;
  currState: string;
}

const UISRChangeLogList = (props: SRChangeLogListProps) => {
  const [SRChangeLogListData, setSRChangeLogListData] = useState([]);

  const getDescription = (currentSRChangeLog: any, formerSRState: SRState) => {
    // console.log(currentSRChangeLog);
    let resState: any, resDescription: any;
    if (currentSRChangeLog.formerState !== formerSRState.currState) {
      resState = (
        <>
          <span>Changed from&nbsp;</span>
          <Space>
            <Tag
              color={state2Color.get(currentSRChangeLog.formerState)}
              style={{ borderRadius: "10px" }}
            >
              {state2ChineseState.get(currentSRChangeLog.formerState)}
            </Tag>
          </Space>
          <span>to&nbsp;</span>
          <Space>
            <Tag
              color={state2Color.get(formerSRState.currState)}
              style={{ borderRadius: "10px" }}
            >
              {state2ChineseState.get(formerSRState.currState)}
            </Tag>
          </Space>
        </>
      );
    }
    if (currentSRChangeLog.formerDescription !== formerSRState.description) {
      resDescription = (
        <>
          <span>Changed from&nbsp;</span>
          <span style={{ background: "orange" }}>
            {currentSRChangeLog.formerDescription}
          </span>
          <span>&nbsp;to&nbsp;</span>
          <span style={{ background: "lightblue" }}>
            {formerSRState.description}
          </span>
        </>
      );
    }
    if (resState || resDescription) {
      return (
        <>
          {resState}
          {resDescription}
        </>
      );
    } else {
      return currentSRChangeLog.description;
    }
  };

  useEffect(() => {
    if (props.SRChangeLogListInfo !== "" && props.projectStore !== "") {
      const newSRChangeLogList: any = [];
      const SRChangeLogList = JSON.parse(props.SRChangeLogListInfo).data;
      if (SRChangeLogList && SRChangeLogList !== []) {
        const formerSRState: SRState = {
          description: props.description,
          currState: props.currState,
        };
        for (let i = SRChangeLogList.length - 1; i >= 0; i--) {
          const userInfo = userId2UserInfo(
            SRChangeLogList[i].changedBy,
            props.projectStore
          );
          const description = getDescription(SRChangeLogList[i], formerSRState);
          formerSRState.description = SRChangeLogList[i].formerDescription;
          formerSRState.currState = SRChangeLogList[i].formerState;
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
              style={{ minHeight: "5vh" }}
            >
              <span>{description}</span>
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
