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
import {
  getIRListStore,
  getIRSRStore,
  getSRListStore,
  updateIRSRStore,
  updateSRListStore,
} from "../../store/slices/IRSRSlice";
import { Draggable } from "react-beautiful-dnd";
import {
  IRCardProps,
  Iteration,
  SRCardProps,
} from "../../store/ConfigureStore";
import {
  getIRListInfo,
  getIRSRInfo,
  updateSRInfo,
} from "../../store/functions/RMS";
import {
  oneIR2AllSR,
  oneSR2AllIR,
  projId2ProjInfo,
  SRId2SRInfo,
} from "../../utils/Association";
import CryptoJS from "crypto-js";
import { getUserStore } from "../../store/slices/UserSlice";
import { getProjectStore } from "../../store/slices/ProjectSlice";
import { updateProjectInfo } from "../../store/functions/UMS";
import Loading from "../../layout/components/Loading";
import { Option } from "antd/es/mentions";
import Paragraph from "antd/es/typography/Paragraph";
import { Service } from "./UIServiceReadonly";
import { ToastMessage } from "../../utils/Navigation";
import { set } from "husky";
import {
  updateCounter,
  updateTodoSRList,
} from "../../store/slices/CalendarSlice";
import moment from "moment";
const { Text } = Typography;

const SRCard = (props: SRCardProps) => {
  const dispatcher = useDispatch();
  const userInfo = useSelector(getUserStore);
  const projectInfo = useSelector(getProjectStore);
  const IRSRAssoStore = useSelector(getIRSRStore);
  const IRListStore = useSelector(getIRListStore);
  const state2Color = new Map();
  const state2ChineseState = new Map();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [id, setId] = useState<number>(props.id);
  const [title, setTitle] = useState<string>(props.title);
  const [description, setDescription] = useState<string>(props.description);
  const [priority, setPriority] = useState<number>(props.priority);
  const [currState, setCurrState] = useState<string>(props.currState);
  const [chargedBy, setChargedBy] = useState(props.createdBy);
  const [service, setService] = useState(props.service);
  const [assoIRListData, setAssoIRListData] = useState([]);
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

  // 更新打开的 modal 对应的 SR 的所有关系
  const updateAssociation = () => {
    console.log("updating !");
    // 该项目所有 IRSR
    getIRSRInfo(dispatcher, props.project).then(() => {
      console.log(IRSRAssoStore);
    });
    // 该项目所有 IR
    getIRListInfo(dispatcher, props.project).then(() => {
      console.log(IRListStore);
    });
  };

  useEffect(() => {
    if (IRSRAssoStore !== "" && IRListStore !== "") {
      setAssoIRListData(oneSR2AllIR(props.id, IRSRAssoStore, IRListStore));
      console.log(assoIRListData);
    }
  }, [IRSRAssoStore, IRListStore]);

  const handleOK = () => {
    if (
      title === props.title &&
      description === props.description &&
      currState === props.currState
    ) {
      setModalVisible(false);
      return;
    }
    updateSRInfo(dispatcher, props.project, {
      id: id,
      project: props.project,
      title: title,
      description: description,
      priority: priority,
      currState: currState,
      iter: props.iter,
      chargedBy: props.chargedBy,
      service: props.service,
    }).then((data: any) => {
      if (data.code === 0) {
        ToastMessage("success", "修改成功", "您的功能需求描述修改成功");
        dispatcher(updateCounter("")); // test
      } else {
        ToastMessage("error", "修改失败", "您的功能需求描述修改失败");
      }
    });
    // 关闭模态框
    setModalVisible(false);
  };
  const handleCancel = () => {
    setId(props.id);
    setTitle(props.title);
    setDescription(props.description);
    setCurrState(props.currState);
    setChargedBy(props.createdBy);
    setPriority(props.priority);
    setService(props.service);
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
  const onClick = (e: any) => {
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
    if (value === "未开始") {
      setCurrState("TODO");
    } else if (value === "开发中") {
      setCurrState("WIP");
    } else if (value === "测试中") {
      setCurrState("Reviewing");
    } else if (value === "已完成") {
      setCurrState("Done");
    }
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
          updateAssociation(); // 更新 store
        }}
      >
        <div className="card-small-header">
          <div className="card-small-header-left">{title}</div>
          <div className="card-small-header-right">
            <Space>
              <Tag
                color={state2Color.get(currState)}
                style={{ borderRadius: "10px" }}
              >
                {state2ChineseState.get(currState)}
              </Tag>
            </Space>
          </div>
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
            <Select
              defaultValue={state2ChineseState.get(props.currState)}
              style={{ width: 120 }}
              onChange={handleChange}
            >
              <Select.Option value="未开始">未开始</Select.Option>
              <Select.Option value="开发中">开发中</Select.Option>
              <Select.Option value="测试中">测试中</Select.Option>
              <Select.Option value="已完成">已完成</Select.Option>
            </Select>
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
              功能需求描述
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
              <div className="title-related">关联原始需求</div>
              <div className="content-related">
                {JSON.stringify(assoIRListData)}
              </div>
            </div>
            <div className="wrap">
              <div className="title-related">关联缺陷</div>
              <div className="content-related">i am issue</div>
            </div>
            <div className="commit-related wrap">
              <div className="title-related">关联提交</div>
              <div className="content-related">i am commit</div>
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

export default SRCard;
