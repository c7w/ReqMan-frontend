import React, { useState } from "react";
import "./UIUserCard.css";
import { useSelector } from "react-redux";
import { getUserStore } from "../../store/slices/UserSlice";
import { Avatar, Modal, Space, Tag, Typography } from "antd";
import { state2ChineseState, state2Color } from "../../utils/SRStateConvert";
import getUserAvatar from "../../utils/UserAvatar";
import moment from "moment";

// 上层逻辑组件保证 userStore 已更新

interface UIUserCardProps {
  readonly visible: boolean;
  readonly close: () => void;
}

const UIUserCard = (props: UIUserCardProps) => {
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
      <span>I am UIUserCard</span>
    </Modal>
  );
};

const UIUserCardPreview = () => {
  const userStore = useSelector(getUserStore);
  const [visible, setVisible] = useState(false);
  const userInfo = JSON.parse(userStore).data;
  console.log(userInfo);
  return (
    <>
      <UIUserCard visible={visible} close={() => setVisible(false)} />
      <div
        className="UserCard-small"
        onClick={() => {
          setVisible(true);
        }}
      >
        <Avatar
          className="UserCard-small-avatar"
          size="small"
          src={getUserAvatar(userStore)}
        />
      </div>
    </>
  );
};

export { UIUserCardPreview, UIUserCard };
