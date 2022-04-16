import { Modal, Select, Space, Tag, Typography } from "antd";
import moment from "moment";
import React, { useState } from "react";
import { UIMergeCard } from "./UIMergeCard";
import { IssueProps } from "../../store/ConfigureStore";

interface UIIssueCardProps {
  data: string;
  visible: boolean;
  close: () => void;
}

interface UIIssueCardPreviewProps {
  data: string;
}

const UIIssueCard = (props: UIIssueCardProps) => {
  const data: IssueProps = JSON.parse(props.data);

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
          <span className={"meta-data-label"}>项目缺陷描述</span>
          <p style={{ marginLeft: "1rem" }}>
            {data.description === "" ? data.title : data.description}
          </p>
        </div>
        <div>
          <span className={"meta-data-label"}>项目缺陷状态</span>
          {/*<Space>*/}
          {/*  <Tag*/}
          {/*    color={getBackgroundColor(data.state)}*/}
          {/*    style={{*/}
          {/*      color: "black",*/}
          {/*      marginLeft: "1rem",*/}
          {/*      fontWeight: "bold",*/}
          {/*      padding: "0.2rem 0.5rem",*/}
          {/*    }}*/}
          {/*  >*/}
          {/*    {getMergeState(data.state)}*/}
          {/*  </Tag>*/}
          {/*</Space>*/}
        </div>
        <div>
          <span className={"meta-data-label"}>项目缺陷发起人</span>
          {/*<span style={{ marginLeft: "1rem" }}>{authoredBy}</span>*/}
          &nbsp;&nbsp;
          <span>@&nbsp;&nbsp;{moment(data.authoredAt * 1000).calendar()}</span>
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
