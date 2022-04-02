import React, { useState } from "react";
import "./SRCard.css";
import { Avatar, Typography, Menu, Dropdown, Space, Tag } from "antd";
import { UserOutlined, DownOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { updateSRListStore } from "../../store/slices/IRSRSlice";
import { SRCardProps } from "../../store/ConfigureStore";
const { Text } = Typography;

const SRCard = (props: SRCardProps) => {
  const dispatch = useDispatch();
  const state2Color = new Map();
  const state2ChineseState = new Map();
  console.log(props);
  state2Color.set("TODO", "red");
  state2Color.set("WIP", "blue");
  state2Color.set("Reviewing", "yellow");
  state2ChineseState.set("TODO", "未开始");
  state2ChineseState.set("WIP", "开发中");
  state2ChineseState.set("Reviewing", "测试中");
  const onClick = (e: any) => {
    // alert("click " + e.key);
    // dispatch(updateSRListStore(e.key));
  };
  const menu = (
    <Menu onClick={onClick}>
      <Menu.Item key="TODO">TODO</Menu.Item>
      <Menu.Item key="WIP">WIP</Menu.Item>
      <Menu.Item key="Reviewing">Reviewing</Menu.Item>
      <Menu.Item key="Done">Done</Menu.Item>
    </Menu>
  );
  return (
    <>
      <div
        className="card-small"
        onClick={() => {
          document.getElementsByTagName("input")[0].checked = true;
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
      <input className="card-input" id="button" type="checkbox" />
      <div className="modal">
        <div className="modal-header">
          <div className="modal-header-left">{props.title}</div>
          <div className="modal-header-right">
            <Dropdown overlay={menu}>
              <a className="ant-dropdown-link">
                {props.currState} <DownOutlined />
              </a>
            </Dropdown>
          </div>
        </div>
        <div className="modal-content">
          <Typography>
            <Text>{props.description}</Text>
          </Typography>
        </div>
      </div>
    </>
  );
};

export default SRCard;
