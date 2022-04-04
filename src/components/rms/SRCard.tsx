import React, { useRef, useState } from "react";
import "./SRCard.css";
import { Avatar, Typography, Menu, Dropdown, Space, Tag, Modal } from "antd";
import { UserOutlined, DownOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { updateSRListStore } from "../../store/slices/IRSRSlice";
import { SRCardProps } from "../../store/ConfigureStore";
import { updateSRInfo } from "../../store/functions/RMS";
const { Text } = Typography;

const SRCard = (props: SRCardProps) => {
  const dispatcher = useDispatch();
  const state2Color = new Map();
  const state2ChineseState = new Map();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const draggleRef = React.createRef();
  console.log(props);
  state2Color.set("TODO", "red");
  state2Color.set("WIP", "blue");
  state2Color.set("Reviewing", "yellow");
  state2Color.set("Done", "orange");
  state2ChineseState.set("TODO", "未开始");
  state2ChineseState.set("WIP", "开发中");
  state2ChineseState.set("Reviewing", "测试中");
  state2ChineseState.set("Done", "已完成");
  const onClick = (e: any) => {
    alert("click " + e.key);
    updateSRInfo(dispatcher, props.project, {
      id: props.id,
      project: props.project,
      title: props.title,
      description: props.description,
      priority: props.priority,
      rank: props.priority,
      currState: e.key,
      createdBy: props.createdBy,
      createdAt: props.createdAt,
      disabled: props.disabled,
      iter: "迭代1",
      chargedBy: "某某某",
      service: "服务1",
    });
  };
  const menu = (
    <Menu onClick={onClick} defaultSelectedKeys={["未开始"]}>
      <Menu.Item key="未开始">未开始</Menu.Item>
      <Menu.Item key="开发中">开发中</Menu.Item>
      <Menu.Item key="测试中">测试中</Menu.Item>
      <Menu.Item key="已完成">已完成</Menu.Item>
    </Menu>
  );
  return (
    <>
      <div
        className="card-small"
        onClick={() => {
          // document.getElementsByTagName("input")[0].checked = true;
          setModalVisible(true);
        }}
      >
        <div className="card-small-header">
          <div className="card-small-header-left">{props.title}</div>
          <div className="card-small-header-right">
            <Space>
              <Tag
                color={state2Color.get(props.currState)}
                style={{ borderRadius: "10px" }}
              >
                {state2ChineseState.get(props.currState)}
              </Tag>
            </Space>
          </div>
        </div>
        <div className="card-small-description">
          <Typography>
            <Text ellipsis={true}>{props.description}</Text>
          </Typography>
        </div>
        <div className="card-small-down">
          <Avatar.Group>
            <Avatar
              className="card-small-avatar"
              size="small"
              src="https://joeschmoe.io/api/v1/random"
            />
            <Avatar
              className="card-small-avatar"
              size="small"
              style={{ backgroundColor: "#f56a00" }}
            >
              K
            </Avatar>
            <Avatar
              className="card-small-avatar"
              size="small"
              style={{ backgroundColor: "#87d068" }}
              icon={<UserOutlined />}
            />
            <Avatar
              className="card-small-avatar"
              size="small"
              style={{ backgroundColor: "#1890ff" }}
              icon={<UserOutlined />}
            />
          </Avatar.Group>
        </div>
      </div>
      {/*<input className="card-input" id="button" type="checkbox" />*/}
      <Modal
        title={"功能需求：" + props.title}
        centered={true}
        visible={modalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
        width={"70%"}
      >
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-header-desc">
              {"需求描述： " + props.description}
            </div>
            <Space style={{ paddingLeft: "1rem" }}>
              <Tag
                color={state2Color.get(props.currState)}
                style={{ borderRadius: "10px" }}
              >
                {state2ChineseState.get(props.currState)}
              </Tag>
            </Space>
          </div>
          <div className="modal-header-right"></div>
        </div>
        <div className="modal-content">{props.description}</div>
      </Modal>
    </>
  );
};

export default SRCard;
