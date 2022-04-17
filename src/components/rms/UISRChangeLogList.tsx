import React, { useEffect, useState } from "react";
import { Space, Tag, Timeline } from "antd";
import moment from "moment";
import { state2ChineseState, state2Color } from "../../utils/SRStateConvert";

interface SRChangeLogListProps {
  SRChangeLogListInfo: string;
  userInfo: string;
}

const UISRChangeLogList = (props: SRChangeLogListProps) => {
  const [SRChangeLogListData, setSRChangeLogListData] = useState([]);

  useEffect(() => {
    if (props.SRChangeLogListInfo !== "") {
      const newSRChangeLogList: any = [];
      const SRChangeLogList = JSON.parse(props.SRChangeLogListInfo).data;
      if (SRChangeLogList && SRChangeLogList !== []) {
        for (let i = SRChangeLogList.length - 1; i >= 0; i--) {
          newSRChangeLogList.push(
            <Timeline.Item
              key={SRChangeLogList[i].id}
              label={moment(SRChangeLogList[i].changedAt * 1000).format(
                "YYYY-MM-DD HH:mm:ss"
              )}
            >
              <Space>
                <Tag
                  color={state2Color.get(SRChangeLogList[i].formerState)}
                  style={{ borderRadius: "10px" }}
                >
                  {state2ChineseState.get(SRChangeLogList[i].formerState)}
                </Tag>
              </Space>
              <span>Create a services</span>
            </Timeline.Item>
          );
        }
      }
      setSRChangeLogListData(newSRChangeLogList);
    }
  }, [props.SRChangeLogListInfo]);

  return (
    <div
      className="SRModal-content-SRChangeLog"
      style={{
        maxWidth: "50vw",
        overflowY: "scroll",
        maxHeight: "70vh",
        paddingTop: "1rem",
        paddingRight: "1rem",
      }}
    >
      <Timeline mode="left">{SRChangeLogListData}</Timeline>
    </div>
  );
};

export default UISRChangeLogList;
