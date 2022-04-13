import { IRCardProps } from "../../store/ConfigureStore";
import React, { useEffect, useState } from "react";
import { updateIRInfo } from "../../store/functions/RMS";
import { ToastMessage } from "../../utils/Navigation";
import { updateCounter } from "../../store/slices/CalendarSlice";
import { useDispatch, useSelector } from "react-redux";
import { getUserStore } from "../../store/slices/UserSlice";
import { getProjectStore } from "../../store/slices/ProjectSlice";
import CryptoJS from "crypto-js";
import {
  Avatar,
  Breadcrumb,
  Divider,
  Modal,
  Select,
  Space,
  Tag,
  Typography,
} from "antd";
import moment from "moment";
import Paragraph from "antd/es/typography/Paragraph";
import Text from "antd/es/typography/Text";
import { getIRSRStore, getSRListStore } from "../../store/slices/IRSRSlice";
import { oneIR2AllSR } from "../../utils/Association";

const IRCard = (props: IRCardProps) => {
  const dispatcher = useDispatch();
  const userInfo = useSelector(getUserStore);
  const projectInfo = useSelector(getProjectStore);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(props.title);
  const [progress, setProgress] = useState<number>(props.progress);
  const [description, setDescription] = useState<string>(props.description);

  const handleOK = () => {
    if (
      title === props.title &&
      description === props.description &&
      progress === props.progress
    ) {
      setModalVisible(false);
      return;
    }
    updateIRInfo(dispatcher, props.project, {
      id: props.id,
      project: props.project,
      title: title,
      rank: props.rank,
      description: description,
      createdAt: props.createdAt,
      createdBy: props.createdBy,
      progress: props.progress,
      iter: props.iter,
    }).then((data: any) => {
      if (data.code === 0) {
        ToastMessage("success", "修改成功", "您的原始需求描述修改成功");
      } else {
        ToastMessage("error", "修改失败", "您的原始需求描述修改失败");
      }
    });
    // 关闭模态框
    setModalVisible(false);
  };

  const handleCancel = () => {
    setTitle(props.title);
    setDescription(props.description);
    setProgress(props.progress);
    setModalVisible(false);
  };

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
          <div className="card-small-header-left">{title}</div>
          <div className="card-small-header-right"></div>
        </div>
        <div className="card-small-description">
          <Typography>
            <Text ellipsis={true}>{description}</Text>
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
          <div>
            {props.createdAt
              ? moment(props.createdAt * 1000).format("YYYY-MM-DD HH:mm:ss")
              : "无创建时间记录"}
          </div>
        </div>
      </div>
      {/*<input className="card-input" id="button" type="checkbox" />*/}
      <Modal
        centered={true}
        visible={modalVisible}
        onOk={handleOK}
        onCancel={handleCancel}
        width={"70%"}
      >
        <div className="modal-header">
          <div
            className="modal-header-left"
            style={{ fontWeight: "bold", fontSize: "1.5rem" }}
          >
            <Breadcrumb
              style={{
                margin: "1rem 0",
                fontSize: "1.5rem",
                paddingRight: "1rem",
              }}
            >
              <Breadcrumb.Item>{props.title}</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className="modal-header-right"></div>
        </div>
        <Divider />
        <div className="modal-content">
          <div className="modal-content-up">
            <div
              style={{
                fontWeight: "bold",
                fontSize: "1.5rem",
                marginBottom: "1rem",
              }}
            >
              原始需求描述
            </div>
            <Typography
              style={{
                overflowWrap: "normal",
                paddingLeft: "1rem",
                paddingRight: "1rem",
                fontSize: "1rem",
              }}
            >
              <Paragraph
                editable={{
                  onChange: setDescription,
                  autoSize: { maxRows: 5 },
                }}
              >
                {description}
              </Paragraph>
            </Typography>
          </div>
          <Divider />
          <div className="modal-content-middle">
            <div style={{ display: "flex", flexDirection: "row" }}>
              <p>负责人：</p>
              <Avatar.Group>
                <Avatar
                  className="card-small-avatar"
                  size="small"
                  src={getUserAvatar(userInfo)}
                />
              </Avatar.Group>
            </div>
            <div>
              <b>创建时间:</b>
              {"   " +
                (props.createdAt
                  ? moment(props.createdAt * 1000).format("YYYY-MM-DD HH:mm:ss")
                  : "无创建时间记录")}
            </div>
          </div>
          <div className="modal-content-bottom">
            <div className="wrap">
              <div className="title-related">关联功能需求</div>
              <div className="content-related">i am SR</div>
            </div>
            <div className="iteration-related wrap">
              <div className="title-related">关联迭代</div>
              <div className="content-related">i am iteration</div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default IRCard;
