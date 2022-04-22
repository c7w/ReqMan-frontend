import React, { useState } from "react";
import "./UIUserCard.css";
import { useSelector } from "react-redux";
import { getUserStore } from "../../store/slices/UserSlice";
import { Modal } from "antd";

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
    </>
  );
};

export { UIUserCardPreview, UIUserCard };
