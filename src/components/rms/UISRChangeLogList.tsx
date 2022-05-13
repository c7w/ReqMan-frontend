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
    let resState: any, resDescription: any;
    if (currentSRChangeLog.formerState !== formerSRState.currState) {
      resState = (
        <>
          <span>状态从&nbsp;</span>
          <Space>
            <Tag
              color={state2Color.get(currentSRChangeLog.formerState)}
              style={{ borderRadius: "10px" }}
            >
              {state2ChineseState.get(currentSRChangeLog.formerState)}
            </Tag>
          </Space>
          <span>修改为&nbsp;</span>
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
    // if (currentSRChangeLog.description.indexOf("rollback") !== -1) {
    //   resState = (
    //     <>
    //       <span>因角色更改导致需求状态从&nbsp;</span>
    //       <Space>
    //         <Tag
    //           color={state2Color.get(currentSRChangeLog.formerState)}
    //           style={{ borderRadius: "10px" }}
    //         >
    //           {state2ChineseState.get(currentSRChangeLog.formerState)}
    //         </Tag>
    //       </Space>
    //       <span>修改为&nbsp;</span>
    //       <Space>
    //         <Tag
    //           color={state2Color.get(formerSRState.currState)}
    //           style={{ borderRadius: "10px" }}
    //         >
    //           {state2ChineseState.get(formerSRState.currState)}
    //         </Tag>
    //       </Space>
    //     </>
    //   );
    // }
    if (currentSRChangeLog.formerDescription !== formerSRState.description) {
      resDescription = (
        <>
          <span>将描述&nbsp;</span>
          <span style={{ background: "orange" }}>
            {currentSRChangeLog.formerDescription}
          </span>
          <span>&nbsp;修改为&nbsp;</span>
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
      return 0; // 表示无变化
    }
  };

  useEffect(() => {
    if (props.SRChangeLogListInfo !== "" && props.projectStore !== "") {
      const newSRChangeLogList: any = [];
      const SRChangeLogList_bak = JSON.parse(props.SRChangeLogListInfo).data;
      const SRChangeLogList = SRChangeLogList_bak?.filter(
        (item: any) => item.description.indexOf("rollback") === -1
      );
      // console.debug(SRChangeLogList);
      SRChangeLogList.push({
        formerDescription: props.description,
        formerState: props.currState,
      });

      if (SRChangeLogList && SRChangeLogList !== []) {
        for (let i = 1; i < SRChangeLogList.length; i++) {
          const userInfo = userId2UserInfo(
            SRChangeLogList[i].changedBy,
            props.projectStore
          );

          const description = getDescription(
            SRChangeLogList[i],
            SRChangeLogList[i - 1].formerState
          );

          if (description === 0) continue;
          newSRChangeLogList.push({
            element: (
              <Timeline.Item
                key={SRChangeLogList[i - 1].id}
                label={
                  <>
                    <span style={{ fontWeight: "bold" }}>
                      {"@" +
                        (userInfo === "not found"
                          ? "anonymous"
                          : userInfo.name) +
                        " "}
                    </span>
                    &nbsp;&nbsp;
                    <span>
                      {moment(SRChangeLogList[i - 1].changedAt * 1000).format(
                        "YYYY-MM-DD HH:mm:ss"
                      )}
                    </span>
                  </>
                }
                style={{ minHeight: "5vh" }}
              >
                <span>{description}</span>
              </Timeline.Item>
            ),
            time: SRChangeLogList[i].changedAt * 1000,
          });
        }
      }

      const SRChangeLogList_rollback = SRChangeLogList_bak?.filter(
        (item: any) => item.description.indexOf("rollback") !== -1
      );
      if (SRChangeLogList_rollback && SRChangeLogList_rollback !== []) {
        for (let i = SRChangeLogList_rollback.length - 1; i >= 0; i--) {
          const userInfo = userId2UserInfo(
            SRChangeLogList_rollback[i].changedBy,
            props.projectStore
          );
          newSRChangeLogList.push({
            element: (
              <Timeline.Item
                key={SRChangeLogList_rollback[i].id}
                label={
                  <>
                    <span style={{ fontWeight: "bold" }}>
                      {"@" +
                        (userInfo === "not found"
                          ? "anonymous"
                          : userInfo.name) +
                        " "}
                    </span>
                    &nbsp;&nbsp;
                    <span>
                      {moment(
                        SRChangeLogList_rollback[i].changedAt * 1000
                      ).format("YYYY-MM-DD HH:mm:ss")}
                    </span>
                  </>
                }
                style={{ minHeight: "5vh" }}
              >
                <span>因角色更改导致需求状态回退</span>
              </Timeline.Item>
            ),
            time: SRChangeLogList_rollback[i].changedAt * 1000,
          });
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
        maxHeight: "23vh",
        paddingTop: "1rem",
        paddingRight: "1rem",
      }}
    >
      {SRChangeLogListData.length === 0 ? (
        <Empty />
      ) : (
        <Timeline mode="left">
          {SRChangeLogListData.sort((a: any, b: any) => b.time - a.time).map(
            (item: any) => item.element
          )}
        </Timeline>
      )}
    </div>
  );
};

export default UISRChangeLogList;
