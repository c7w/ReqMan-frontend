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

  const getDescription = (formerState: any, currState: SRState) => {
    let resState: any, resDescription: any;
    if (formerState.formerState !== currState.currState) {
      resState = (
        <>
          <span>状态从&nbsp;</span>
          <Space>
            <Tag
              color={state2Color.get(formerState.formerState)}
              style={{ borderRadius: "10px" }}
            >
              {state2ChineseState.get(formerState.formerState)}
            </Tag>
          </Space>
          <span>修改为&nbsp;</span>
          <Space>
            <Tag
              color={state2Color.get(currState.currState)}
              style={{ borderRadius: "10px" }}
            >
              {state2ChineseState.get(currState.currState)}
            </Tag>
          </Space>
        </>
      );
    }

    if (formerState.formerDescription !== currState.description) {
      resDescription = (
        <>
          <span>将描述&nbsp;</span>
          <span style={{ background: "orange" }}>
            {formerState.formerDescription}
          </span>
          <span>&nbsp;修改为&nbsp;</span>
          <span style={{ background: "lightblue" }}>
            {currState.description}
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
      const SRChangeLogList = JSON.parse(props.SRChangeLogListInfo).data;
      // console.debug(SRChangeLogList);

      SRChangeLogList.map((item: any, index: number) => {
        if (index === 0) {
          return item;
        }
        if (item.description === "") {
          item.formerDescription = SRChangeLogList[index - 1].formerDescription;
        } else if (item.description?.indexOf("rollback") !== -1) {
          item.formerDescription = SRChangeLogList[index - 1].formerDescription;
        }
        return item;
      });

      SRChangeLogList.push({
        formerDescription: props.description,
        formerState: props.currState,
      });

      console.debug("before", SRChangeLogList);

      if (SRChangeLogList && SRChangeLogList !== []) {
        for (let i = 1; i < SRChangeLogList.length; i++) {
          const userInfo = userId2UserInfo(
            SRChangeLogList[i - 1].changedBy,
            props.projectStore
          );

          let user_name = "";

          if (userInfo === "not found") {
            user_name = "Anonymous";
          } else {
            user_name = userInfo.name;
          }

          if (SRChangeLogList[i - 1].description === "") {
            user_name = "自动状态更新";
          } else if (
            SRChangeLogList[i - 1].description?.indexOf("rollback") !== -1
          ) {
            user_name = "需求状态回滚";
          }

          const description = getDescription(SRChangeLogList[i - 1], {
            description: SRChangeLogList[i].formerDescription,
            currState: SRChangeLogList[i].formerState,
          });

          if (description === 0) continue;
          newSRChangeLogList.push({
            element: (
              <Timeline.Item
                key={SRChangeLogList[i - 1].id}
                label={
                  <>
                    <span style={{ fontWeight: "bold" }}>
                      {"@" + user_name + " "}
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
            time: SRChangeLogList[i - 1].changedAt * 1000,
          });
        }
      }

      setSRChangeLogListData(newSRChangeLogList);
      console.debug("after", SRChangeLogList);
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
