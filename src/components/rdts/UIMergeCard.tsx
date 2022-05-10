import { Modal, Select, Space, Tag, Typography } from "antd";
import React, { useState } from "react";
import "./UIMergeCard.css";
import { MergeRequestProps } from "../../store/ConfigureStore";
import { userId2UserInfo } from "../../utils/Association";
import { useDispatch, useSelector } from "react-redux";
import { getProjectStore } from "../../store/slices/ProjectSlice";
import moment from "moment";
import { useParams } from "react-router-dom";
import {
  createMRSRAssociation,
  deleteMRSRAssociation,
} from "../../store/functions/RDTS";
import { getRepoStore } from "../../store/slices/RepoSlice";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { MergeRelatedSR } from "./UIMerge";

import SRSearchBox from "../Shared/SRSearchBox";

interface UIMergeCardProps {
  data: string;
  SRListStore: string;
  MRSRAssociationStore: string;
  visible: boolean;
  close: () => void;
  onlyShow?: boolean;
}

interface UIMergeCardPreviewProps {
  SRListStore: string;
  MRSRAssociationStore: string;
  data: string;
  onlyShow?: boolean;
}

const UIMergeCard = (props: UIMergeCardProps) => {
  const dispatcher = useDispatch();
  const params = useParams<"id">();
  const project_id = Number(params.id);

  const projectStore = useSelector(getProjectStore);
  const repoStore = useSelector(getRepoStore);

  const data: MergeRequestProps = JSON.parse(props.data);
  const [mrId, setMrId] = useState(data.id);

  const getBackgroundColor = (state: "closed" | "merged" | "opened") => {
    switch (state) {
      case "closed":
        return "#ffe5e5";
      case "merged":
        return "#e5ffe5";
      case "opened":
        return "#e5e5ff";
    }
  };

  const getMergeState = (state: "closed" | "merged" | "opened") => {
    switch (state) {
      case "closed":
        return "已关闭";
      case "merged":
        return "已合并";
      case "opened":
        return "正在审核";
    }
  };

  let authoredBy = data.authoredByUserName;
  if (data.user_authored > 0) {
    const find_result = userId2UserInfo(data.user_authored, projectStore);
    if (find_result !== "not_found") {
      authoredBy = find_result.name;
    }
  }

  let reviewedBy = data.reviewedByUserName;
  if (data.user_reviewed > 0) {
    const find_result = userId2UserInfo(data.user_reviewed, projectStore);
    if (find_result !== "not_found") {
      reviewedBy = find_result.name;
    }
  }

  let currAssociatedSRId = -1;
  // console.debug(JSON.parse(props.MRSRAssociationStore).data);
  const filtered_list = JSON.parse(props.MRSRAssociationStore).data.filter(
    (asso: any) => asso.MR === mrId
  );
  if (filtered_list.length > 0) {
    currAssociatedSRId = filtered_list[0].SR;
  }

  const onSRAssociatedChange = (from: number[], to: number[]) => {
    const key = Number(to);
    if (currAssociatedSRId > 0) {
      console.debug(currAssociatedSRId);
      deleteMRSRAssociation(
        dispatcher,
        project_id,
        mrId,
        currAssociatedSRId,
        repoStore
      ).then((data: any) => {
        console.debug(key);
        if (data.code === 0 && key !== Number(-1)) {
          createMRSRAssociation(dispatcher, project_id, mrId, key, repoStore);
        }
      });
    } else {
      createMRSRAssociation(dispatcher, project_id, mrId, key, repoStore);
    }
  };

  // Picture prefix website
  const indices = [];
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
  // console.debug(data.description);

  // console.debug(
  //   JSON.parse(props.MRSRAssociationStore).data.filter(
  //     (asso: any) => asso.MR === data.id
  //   )
  // );

  return (
    <Modal
      centered={true}
      footer={null}
      destroyOnClose={true}
      visible={props.visible}
      onCancel={() => props.close()}
      width={"70%"}
      title={"合并请求查看"}
    >
      <div className={"meta-data"}>
        <Typography.Title level={4}>{data.title}</Typography.Title>
        <div>
          <span className={"meta-data-label"}>合并请求描述</span>
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
          <span className={"meta-data-label"}>合并请求状态</span>
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
              {getMergeState(data.state)}
            </Tag>
          </Space>
        </div>
        <div>
          <span className={"meta-data-label"}>合并请求发起人</span>
          <span style={{ marginLeft: "1rem" }}>{authoredBy}</span>
          &nbsp;&nbsp;
          <span>@&nbsp;&nbsp;{moment(data.authoredAt * 1000).calendar()}</span>
        </div>
        {data.state === "merged" ? (
          <div>
            <span className={"meta-data-label"}>合并请求负责人</span>
            <span style={{ marginLeft: "1rem" }}>{reviewedBy}</span>
            &nbsp;&nbsp;
            <span>
              @&nbsp;&nbsp;{moment(data.reviewedAt * 1000).calendar()}
            </span>
          </div>
        ) : null}
        <div>
          <span className={"meta-data-label"} style={{ marginRight: "1rem" }}>
            关联功能需求
          </span>

          {props.onlyShow ? (
            <MergeRelatedSR
              currAssociatedSRId={
                JSON.parse(props.MRSRAssociationStore)
                  .data.filter((asso: any) => asso.MR === data.id)
                  .map((asso: any) => asso.SR)[0]
              }
              show_digest={true}
            />
          ) : (
            <SRSearchBox
              value={JSON.parse(props.MRSRAssociationStore)
                .data.filter((asso: any) => asso.MR === data.id)
                .map((asso: any) => asso.SR)}
              onChange={onSRAssociatedChange}
              multiple={false}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

const UIMergeCardPreview = (props: UIMergeCardPreviewProps) => {
  const data = JSON.parse(props.data);
  const [visible, setVisible] = useState(false);
  return (
    <>
      <UIMergeCard
        data={props.data}
        visible={visible}
        close={() => setVisible(false)}
        MRSRAssociationStore={props.MRSRAssociationStore}
        SRListStore={props.SRListStore}
        onlyShow={props.onlyShow}
      />
      <a onClick={() => setVisible(true)}>{data.title}</a>
    </>
  );
};

export { UIMergeCard, UIMergeCardPreview };
