import { Modal, Select, Space, Tag, Timeline, Typography } from "antd";
import moment from "moment";
import React, { ReactElement, useEffect, useState } from "react";
import { UIMergeCard } from "./UIMergeCard";
import { IssueProps, MergeRequestProps } from "../../store/ConfigureStore";
import { userId2UserInfo } from "../../utils/Association";
import { useSelector } from "react-redux";
import { getProjectStore } from "../../store/slices/ProjectSlice";
import request_json from "../../utils/Network";
import API from "../../utils/APIList";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { getMergeStore } from "../../store/slices/IssueSlice";

interface UIIssueCardProps {
  data: string;
  visible: boolean;
  close: () => void;
}

interface UIIssueCardPreviewProps {
  data: string;
}

interface TimelineEntry {
  time: number;
  color: string;
  content: ReactElement;
}

const UIIssueCard = (props: UIIssueCardProps) => {
  const projectStore = useSelector(getProjectStore);
  const MRStore = useSelector(getMergeStore);

  const [MRIssueAssociation, setMRIssueAssociation] = useState("[]");

  const data: IssueProps = JSON.parse(props.data);

  useEffect(() => {
    request_json(API.GET_RDTS, {
      getParams: { repo: data.repo, type: "issue-mr", issueId: data.id },
    }).then((data: any) => {
      setMRIssueAssociation(JSON.stringify(data.data));
    });
  });

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

  let authoredBy = data.authoredByUserName;
  if (data.user_authored > 0) {
    const find_result = userId2UserInfo(data.user_authored, projectStore);
    if (find_result !== "not_found") {
      authoredBy = find_result.name;
    }
  }

  let reviewedBy = data.assigneeUserName;
  if (data.user_assignee > 0) {
    const find_result = userId2UserInfo(data.user_assignee, projectStore);
    if (find_result !== "not_found") {
      reviewedBy = find_result.name;
    }
  }

  let closedBy = data.closedByUserName;
  if (data.user_closed > 0) {
    const find_result = userId2UserInfo(data.user_closed, projectStore);
    if (find_result !== "not_found") {
      closedBy = find_result.name;
    }
  }

  console.debug();
  const timeline_list: TimelineEntry[] = [];
  timeline_list.push({
    time: data.authoredAt,
    color: "red",
    content: (
      <span>
        {authoredBy} 提出了本项目缺陷（#{data.issue_id}）
      </span>
    ),
  });
  if (closedBy) {
    timeline_list.push({
      time: data.closedAt,
      color: "green",
      content: (
        <span>
          {closedBy} 审核并关闭了本项目缺陷（#{data.issue_id}）
        </span>
      ),
    });
  }
  JSON.parse(MRIssueAssociation).forEach((asso: any) => {
    const filtered: MergeRequestProps[] = JSON.parse(MRStore).data.filter(
      (entry: MergeRequestProps) => entry.id === asso.MR
    );
    if (filtered.length > 0) {
      let MRBy = filtered[0].authoredByUserName;
      if (filtered[0].user_authored > 0) {
        const find_result = userId2UserInfo(
          filtered[0].user_authored,
          projectStore
        );
        if (find_result !== "not_found") {
          MRBy = find_result.name;
        }
      }
      timeline_list.push({
        time: filtered[0].authoredAt,
        color: "purple",
        content: (
          <span>
            {closedBy} 提出了合并请求 !{filtered[0].merge_id} &nbsp;&nbsp;
            {asso.auto_added ? <Tag color={"green"}>自动关联</Tag> : null}
          </span>
        ),
      });
    }
  });

  data.description = data.description.replace(/!\[image\]\((.*?)\)/, "");

  return (
    <Modal
      centered={true}
      footer={null}
      destroyOnClose={true}
      visible={props.visible}
      onCancel={() => props.close()}
      width={"70%"}
      style={{ maxHeight: "80vh", overflowY: "scroll" }}
      title={"合并请求查看"}
    >
      <div className={"meta-data"}>
        <Typography.Title level={4}>
          {data.title} (#{data.issue_id})
        </Typography.Title>
        <div>
          <span className={"meta-data-label"}>项目缺陷描述</span>
          <div style={{ marginTop: "1rem", marginLeft: "2rem" }}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {data.description === "" ? data.title : data.description}
            </ReactMarkdown>
          </div>
        </div>
        <div>
          <span className={"meta-data-label"}>项目缺陷状态</span>
          <Space>
            <Tag
              color={getBackgroundColor(data.state)}
              style={{
                color: "black",
                marginLeft: "1rem",
                fontWeight: "bold",
                padding: "0.2rem 0.5rem",
              }}
            >
              {getIssueState(data.state)}
            </Tag>
          </Space>
        </div>
        <div>
          <span className={"meta-data-label"}>项目缺陷提交者</span>
          <span style={{ marginLeft: "1rem" }}>{authoredBy}</span>
          &nbsp;&nbsp;
          <span>@&nbsp;&nbsp;{moment(data.authoredAt * 1000).calendar()}</span>
        </div>
        <div>
          <span className={"meta-data-label"}>项目缺陷解决者</span>
          <span style={{ marginLeft: "1rem" }}>{reviewedBy}</span>
        </div>
        {closedBy ? (
          <div>
            <span className={"meta-data-label"}>项目缺陷修复审核者</span>
            <span style={{ marginLeft: "1rem" }}>{closedBy}</span>
            &nbsp;&nbsp;
            <span>@&nbsp;&nbsp;{moment(data.closedAt * 1000).calendar()}</span>
          </div>
        ) : null}

        <div>
          <span className={"meta-data-label"} style={{ marginRight: "1rem" }}>
            项目缺陷进展
          </span>
          <Timeline style={{ marginTop: "1rem", marginLeft: "2rem" }}>
            {timeline_list
              .sort((entryA, entryB) => entryB.time - entryA.time)
              .map((entry: TimelineEntry) => (
                <Timeline.Item color={entry.color}>
                  <>
                    <span>
                      [{moment(entry.time * 1000).format("lll")}]&nbsp;&nbsp;
                    </span>
                    {entry.content}
                  </>
                </Timeline.Item>
              ))}
          </Timeline>
        </div>

        {/*<div>*/}
        {/*  <span className={"meta-data-label"} style={{ marginRight: "1rem" }}>*/}
        {/*    关联功能需求*/}
        {/*  </span>*/}
        {/*  <Select*/}
        {/*    showSearch={true}*/}
        {/*    style={{ width: "20rem" }}*/}
        {/*    placeholder="功能需求"*/}
        {/*    optionFilterProp="children"*/}
        {/*    onChange={onSRAssociatedChange}*/}
        {/*    defaultValue={currAssociatedSRId.toString()}*/}
        {/*    filterOption={(input, option: any) =>*/}
        {/*      option.children.indexOf(input.toLowerCase()) >= 0*/}
        {/*    }*/}
        {/*  >*/}
        {/*    <Select.Option value="-1">　</Select.Option>*/}
        {/*    {JSON.parse(props.SRListStore).data.map((sr: any) => (*/}
        {/*      <Select.Option key={sr.id} value={sr.id.toString()}>*/}
        {/*        {sr.title}*/}
        {/*      </Select.Option>*/}
        {/*    ))}*/}
        {/*  </Select>*/}
        {/*</div>*/}
      </div>
    </Modal>
  );
};

const UIIssueCardPreview = (props: UIIssueCardPreviewProps) => {
  const data: IssueProps = JSON.parse(props.data);
  const [visible, setVisible] = useState(false);

  return (
    <>
      <UIIssueCard
        data={props.data}
        visible={visible}
        close={() => setVisible(false)}
      />
      <a onClick={() => setVisible(true)}>{data.title}</a>
    </>
  );
};

export { UIIssueCard, UIIssueCardPreview };
