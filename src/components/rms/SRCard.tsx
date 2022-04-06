import React, { useEffect, useRef, useState } from "react";
import "./SRCard.css";
import {
  Avatar,
  Typography,
  Menu,
  Dropdown,
  Space,
  Tag,
  Modal,
  Divider,
  Breadcrumb,
  Select,
} from "antd";
import { UserOutlined, DownOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { updateSRListStore } from "../../store/slices/IRSRSlice";
import { SRCardProps } from "../../store/ConfigureStore";
import { updateSRInfo } from "../../store/functions/RMS";
import { projId2ProjInfo, SRId2SRInfo } from "../../utils/Association";
import CryptoJS from "crypto-js";
import { getUserStore } from "../../store/slices/UserSlice";
import { getProjectStore } from "../../store/slices/ProjectSlice";
import { updateProjectInfo } from "../../store/functions/UMS";
import Loading from "../../layout/components/Loading";
import { Option } from "antd/es/mentions";
const { Text } = Typography;

const SRCard = (props: SRCardProps) => {
  const dispatcher = useDispatch();
  const userInfo = useSelector(getUserStore);
  const projectInfo = useSelector(getProjectStore);
  const state2Color = new Map();
  const state2ChineseState = new Map();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });

  state2Color.set("TODO", "red");
  state2Color.set("WIP", "blue");
  state2Color.set("Reviewing", "yellow");
  state2Color.set("Done", "orange");
  state2ChineseState.set("TODO", "未开始");
  state2ChineseState.set("WIP", "开发中");
  state2ChineseState.set("Reviewing", "测试中");
  state2ChineseState.set("Done", "已完成");
  // 获取用户头像
  const getUserAvatar = (userStore: string): string => {
    if (userStore === "" || JSON.parse(userStore).code !== 0) {
      return "";
    }
    const userInfo = JSON.parse(userStore);
    if (userInfo.data.user.avatar.length < 5) {
      return `https://www.gravatar.com/avatar/${CryptoJS.MD5(
        userInfo.data.user.email
      )}`;
    } else {
      return userInfo.data.user.avatar;
    }
  };
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
      iter: [],
      chargedBy: -1,
      service: -1,
    });
  };
  const handleChange = (value: string) => {
    alert(value + "selected");
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
              src={getUserAvatar(userInfo)}
            />
          </Avatar.Group>
        </div>
      </div>
      {/*<input className="card-input" id="button" type="checkbox" />*/}
      <Modal
        centered={true}
        visible={modalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
        width={"70%"}
      >
        <div className="modal-header">
          <div
            className="modal-header-left"
            style={{ fontWeight: "bold", fontSize: "1.5rem" }}
          >
            <Breadcrumb style={{ margin: "1rem 0", fontSize: "1.5rem" }}>
              <Breadcrumb.Item>{props.title}</Breadcrumb.Item>
            </Breadcrumb>
            <Select
              defaultValue={state2ChineseState.get(props.currState)}
              style={{ width: 120 }}
              onChange={handleChange}
            >
              <Option value="未开始">未开始</Option>
              <Option value="开发中">开发中</Option>
              <Option value="测试中">测试中</Option>
              <Option value="已完成">已完成</Option>
            </Select>
          </div>
          <Divider />
          <div className="modal-header-right"></div>
        </div>
        <div className="modal-content">
          <div className="modal-content-up"></div>
          <div className="modal-content-middle"></div>
          <div className="modal-content-bottom"></div>
        </div>
      </Modal>
    </>
  );
};

export default SRCard;
