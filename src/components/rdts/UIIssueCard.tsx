import { Modal, Select, Space, Tag, Timeline, Typography } from "antd";
import moment from "moment";
import React, { ReactElement, useEffect, useState } from "react";
import { UIMergeCard } from "./UIMergeCard";
import { IssueProps, MergeRequestProps } from "../../store/ConfigureStore";
import { MRId2MRInfo, userId2UserInfo } from "../../utils/Association";
import { useDispatch, useSelector } from "react-redux";
import { getProjectStore } from "../../store/slices/ProjectSlice";
import request_json from "../../utils/Network";
import API from "../../utils/APIList";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { getMergeStore } from "../../store/slices/IssueSlice";
import { difference, values } from "underscore";
import {
  createMRIssueAssociation,
  deleteMRIssueAssociation,
} from "../../store/functions/RDTS";
import { useParams } from "react-router-dom";

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

  const dispatcher = useDispatch();
  const params = useParams();
  const project_id = Number(params.id);

  const [MRIssueAssociation, setMRIssueAssociation] = useState("[]");

  const [MRBindDisabled, setMRBindDisabled] = useState(false);

  const [timeline_list, setTimelineList] = useState<TimelineEntry[]>([]);

  const [reload, setReload] = useState(0);

  const data: IssueProps = JSON.parse(props.data);

  useEffect(() => {
    if (reload > 0) {
      request_json(API.GET_RDTS, {
        getParams: { repo: data.repo, type: "issue-mr", issueId: data.id },
      }).then((data: any) => {
        setMRIssueAssociation(JSON.stringify(data.data));
        console.debug("MR-Issue has been reset");
      });
    }
  }, [reload]);

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
    if (find_result !== "no _found") {
      authoredBy = find_result.name;
    }
  }

  let reviewedBy = data.assigneeUserName;
  if (data.user_assignee > 0) {
    const find_result = userId2UserInfo(data.user_assignee, projectStore);
    if (find_result !== "not found") {
      reviewedBy = find_result.name;
    }
  }

  let closedBy = data.closedByUserName;
  if (data.user_closed > 0) {
    const find_result = userId2UserInfo(data.user_closed, projectStore);
    if (find_result !== "not found") {
      closedBy = find_result.name;
    }
  }

  const reload_timeline = async () => {
    console.debug("reload timeline");
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
    // console.debug(MRIssueAssociation);

    const curr_mr_issue_asso = await request_json(API.GET_RDTS, {
      getParams: { repo: data.repo, type: "issue-mr", issueId: data.id },
    });
    setMRIssueAssociation(JSON.stringify(curr_mr_issue_asso.data));

    for (const asso of curr_mr_issue_asso.data) {
      // If asso.issue is not my id, skip it
      if (asso.issue !== data.id) {
        continue;
      }

      const mrInfo = await MRId2MRInfo(asso.MR, MRStore, project_id);

      const filtered: MergeRequestProps[] = [];
      if (mrInfo !== "not found") {
        filtered.push(mrInfo);
      }

      // console.debug(filtered);
      if (filtered.length > 0) {
        let MRBy = filtered[0].authoredByUserName;
        if (filtered[0].user_authored > 0) {
          const find_result = userId2UserInfo(
            filtered[0].user_authored,
            projectStore
          );
          if (find_result !== "not found") {
            MRBy = find_result.name;
          }
        }
        timeline_list.push({
          time: filtered[0].authoredAt,
          color: "purple",
          content: (
            <>
              <span>{MRBy} 提出了合并请求 </span>
              <span
                style={{
                  fontWeight: "bold",
                }}
              >
                !{filtered[0].merge_id}
              </span>
              <span>
                {" "}
                &nbsp;
                {filtered[0].title}
                &nbsp;
                {asso.auto_added ? <Tag color={"green"}>自动关联</Tag> : null}
              </span>
            </>
          ),
        });
      }
    }
    setTimelineList(timeline_list);
    // console.debug(timeline_list);
  };

  useEffect(() => {
    reload_timeline();
  }, []);

  const indices = [];

  if (data.url !== undefined) {
    let idx = data.url.indexOf("/");
    while (idx != -1) {
      indices.push(idx);
      idx = data.url.indexOf("/", idx + 1);
    }

    const image_front_url = data.url.slice(0, indices[indices.length - 3]);

    data.description = data.description.replaceAll(
      /!\[image\]\((.*?)\)/g,
      `<img src='${image_front_url}/$1' style="width: auto; height: auto; max-width: 90%"></img>`
    );
  }

  const onSelectionChange = (val: number[]) => {
    setMRBindDisabled(true);
    // console.debug(val);
    const former = JSON.parse(MRIssueAssociation).map((asso: any) => asso.MR);
    const promise_list: any[] = [];
    difference(former, val).forEach((to_delete: number) => {
      const promise = deleteMRIssueAssociation(
        dispatcher,
        project_id,
        to_delete,
        data.id
      );
      promise_list.push(promise);
    });
    difference(val, former).forEach((to_create: number) => {
      const promise = createMRIssueAssociation(
        dispatcher,
        project_id,
        to_create,
        data.id
      );
      promise_list.push(promise);
    });
    Promise.all(promise_list).then((data: any) => {
      setReload(reload + 1);
      setMRBindDisabled(false);
    });
  };

  useEffect(() => {
    if (props.visible) {
      setReload(reload + 1);
    }
  }, [props.visible]);

  return (
    <Modal
      centered={true}
      footer={null}
      destroyOnClose={true}
      visible={props.visible}
      onCancel={() => props.close()}
      width={"70%"}
      title={"项目缺陷查看"}
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
            关联合并请求
          </span>
          <Select
            mode={"multiple"}
            showSearch={true}
            style={{ width: "60%", margin: "0.5rem 0 0.5rem 1rem" }}
            placeholder="合并请求"
            disabled={MRBindDisabled}
            optionFilterProp="children"
            onChange={onSelectionChange}
            value={JSON.parse(MRIssueAssociation).map((asso: any) => asso.MR)}
            filterOption={(input, option: any) =>
              option.children.indexOf(input) >= 0
            }
          >
            {JSON.parse(MRStore).data.map((mr: MergeRequestProps) => (
              <Select.Option
                key={mr.id}
                value={mr.id}
                children={`<${mr.repo}-!${mr.merge_id}> ${mr.title}`}
              />
            ))}
          </Select>
        </div>

        <div>
          <span className={"meta-data-label"} style={{ marginRight: "1rem" }}>
            项目缺陷进展
          </span>
          <Timeline style={{ marginTop: "1rem", marginLeft: "2rem" }}>
            {timeline_list
              .sort((entryA, entryB) => entryB.time - entryA.time)
              .map((entry: TimelineEntry, ind) => (
                <Timeline.Item color={entry.color} key={ind}>
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
