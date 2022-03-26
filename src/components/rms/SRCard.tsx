import React, { useState } from "react";
import "./SRCard.css";
import { Avatar, Typography, Menu, Dropdown } from "antd";
import { UserOutlined, DownOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getSR, updateSRStore } from "../../store/slices/rmsSlice";
const { Text } = Typography;

interface SRCardProps {
  readonly id: number; // id
  // readonly project: string; // the project belongs to
  // readonly title: string; // title
  // readonly description: string; // description
  // readonly priority: number; // the priority which indicates the importance of the SR
  // readonly currState: string; // "TODO", "WIP", "Reviewing", "Done"
  // readonly createdBy: string; // somebody
  // readonly createdAt: number; // sometime
  // readonly disabled: boolean;
}

const SRCard = (props: SRCardProps) => {
  const SRCardState = useSelector(getSR(props.id));
  const dispatch = useDispatch();

  const onClick = (e: any) => {
    alert("click " + e.key);
    dispatch(updateSRStore(e.key));
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
          <div className="card-small-header-left">{SRCardState.title}</div>
          <div className="card-small-header-right">right</div>
        </div>
        <div className="card-small-description">
          <Typography>
            <Text ellipsis={true}>{SRCardState.description}</Text>
          </Typography>
        </div>
        <div className="card-small-down">
          <Avatar
            className="card-small-avatar"
            size="small"
            icon={<UserOutlined />}
          />
          <Avatar
            className="card-small-avatar"
            size="small"
            icon={<UserOutlined />}
          />
          <Avatar
            className="card-small-avatar"
            size="small"
            icon={<UserOutlined />}
          />
        </div>
      </div>
      <input className="card-input" id="button" type="checkbox" />
      <div className="modal">
        <div className="modal-header">
          <div className="modal-header-left">{SRCardState.title}</div>
          <div className="modal-header-right">
            <Dropdown overlay={menu}>
              <a className="ant-dropdown-link">
                {SRCardState.currState} <DownOutlined />
              </a>
            </Dropdown>
          </div>
        </div>
        <div className="modal-content">
          <Typography>
            <Text>{SRCardState.description}</Text>
          </Typography>
        </div>
      </div>
    </>
  );
};

// default props for SRCard
SRCard.defaultProps = {
  id: 0, // id
  project: "test", // the project belongs to
  title: "SR.002.103", // title
  description:
    " hbx is working hard ! hbx is working hard ! hbx is working hard ! hbx is working hard ! hbx is working hard ! hbx is working hard ! hbx is working hard ! hbx is working hard ! hbx is working hard ! hbx is working hard ! hbx is working hard ! hbx is working hard ! hbx is working hard ! hbx is working hard ! hbx is working hard ! hbx is working hard ! hbx is working hard ! hbx is working hard !", // description
  priority: 0, // the priority which indicates the importance of the SR
  currState: "TODO", // "TODO", "WIP", "Reviewing", "Done"
  createdBy: "hbx", // somebody
  createdAt: new Date().getDate(), // sometime
  disabled: false,
};

export default SRCard;
