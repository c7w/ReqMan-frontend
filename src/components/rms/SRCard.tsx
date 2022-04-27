import React, { useEffect, useState } from "react";
import "./SRCard.css";
import "../rdts/UIMergeCard.css";
import { ClockCircleTwoTone } from "@ant-design/icons";
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
  Empty,
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
import QueueAnim from "rc-queue-anim";
import { Draggable } from "react-beautiful-dnd";
import {
  IRCardProps,
  IssueProps,
  Iteration,
  MergeRequestProps,
  SRCardProps,
} from "../../store/ConfigureStore";
import {
  getIRListInfo,
  getIRSRInfo,
  getIterationInfo,
  getSRChangeLogInfo,
  getSRIterationInfo,
  getSRListInfo,
  getSRServiceInfo,
  updateServiceInfo,
  updateSRInfo,
} from "../../store/functions/RMS";
import {
  oneIR2AllSR,
  oneSR2AllCommit,
  oneSR2AllIR,
  oneSR2AllMR,
  projId2ProjInfo,
  SR2Issue,
  SR2Iteration,
  SR2Service,
  SRId2SRInfo,
  userId2UserInfo,
} from "../../utils/Association";
import CryptoJS from "crypto-js";
import { getUserStore } from "../../store/slices/UserSlice";
import { getProjectStore } from "../../store/slices/ProjectSlice";
import { updateProjectInfo, updateUserInfo } from "../../store/functions/UMS";
import Loading from "../../layout/components/Loading";
import { Option } from "antd/es/mentions";
import Paragraph from "antd/es/typography/Paragraph";
import { Service, ServiceReadonlyModal } from "./UIServiceReadonly";
import { ToastMessage } from "../../utils/Navigation";
import { set } from "husky";
import {
  updateCounter,
  updateTodoSRList,
} from "../../store/slices/CalendarSlice";
import moment from "moment";
import IRCard from "./IRCard";
import {
  getIterationStore,
  getSRIterationStore,
} from "../../store/slices/IterationSlice";
import {
  getCommitSRAssociationStore,
  getCommitStore,
  getIssueSRAssociationStore,
  getIssueStore,
  getMergeStore,
  getMRSRAssociationStore,
} from "../../store/slices/IssueSlice";
import {
  getMRSRAssociation,
  getRDTSInfo,
  getRepoInfo,
} from "../../store/functions/RDTS";
import { getRepoStore } from "../../store/slices/RepoSlice";
import { getSRChangeLogStore } from "../../store/slices/SRChangeLogSlice";
import { userId2Avatar } from "../../utils/UserAvatar";
import UISRChangeLogList from "./UISRChangeLogList";
import { state2Color, state2ChineseState } from "../../utils/SRStateConvert";
import MRCard from "../rdts/MRCard";
import { UIUserCardPreview } from "../ums/UIUserCard";
import IssueCard from "../rdts/IssueCard";
import UICommitList from "../rdts/UICommitList";
import { getServiceStore } from "../../store/slices/ServiceSlice";
import { ProjectServiceCard } from "./UIService";
const { Text } = Typography;

const SRCard = (props: SRCardProps) => {
  const dispatcher = useDispatch();
  const userInfo = useSelector(getUserStore);
  const projectStore = useSelector(getProjectStore);
  // rms
  const IRSRAssoStore = useSelector(getIRSRStore);
  const IRListStore = useSelector(getIRListStore);
  const SRListStore = useSelector(getSRListStore);
  const serviceStore = useSelector(getServiceStore);
  const SRServiceStore = useSelector(getServiceStore);
  const SRCommitStore = useSelector(getCommitSRAssociationStore);
  const SRIssueStore = useSelector(getIssueSRAssociationStore);
  const SRIterAssoStore = useSelector(getSRIterationStore);
  const iterationStore = useSelector(getIterationStore);
  const SRChangeLogStore = useSelector(getSRChangeLogStore);
  // rdts
  const repoStore = useSelector(getRepoStore);
  const issueSRAssoStore = useSelector(getIssueSRAssociationStore);
  const issueStore = useSelector(getIssueStore);
  const commitSRAssoStore = useSelector(getCommitSRAssociationStore);
  const commitStore = useSelector(getCommitStore);
  const MRSRAssoStore = useSelector(getMRSRAssociationStore);
  const MRStore = useSelector(getMergeStore);
  // state map
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [id, setId] = useState<number>(props.id);
  const [title, setTitle] = useState<string>(props.title);
  const [description, setDescription] = useState<string>(props.description);
  const [priority, setPriority] = useState<number>(props.priority);
  const [currState, setCurrState] = useState<string>(props.currState);
  const [chargedBy, setChargedBy] = useState(props.createdBy);
  const [service, setService] = useState(props.service);
  const [descEditing, setDescEditing] = useState<boolean>(false);
  const [userAvatar, setUserAvatar] = useState<string>("");
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  // SR 关联信息
  const [assoIRCardList, setAssoIRCardList] = useState([]);
  const [assoMRCardList, setAssoMRCardList] = useState([]);
  const [assoIssueCardList, setAssoIssueCardList] = useState([]);
  const [assoCommitList, setAssoCommitList] = useState([]);
  const [assoIterList, setAssoIterList] = useState([]);
  const [assoService, setAssoService] = useState([]);
  // 关联 service 的附带状态
  const [cached, setCached] = useState("");
  const [modal, setModal] = useState(false);

  // 更新打开的 modal 对应的 SR 的所有关系
  const updateAssociation = () => {
    Promise.all([
      getRDTSInfo(dispatcher, props.project),
      getSRListInfo(dispatcher, props.project),
      updateProjectInfo(dispatcher, props.project),
      getSRChangeLogInfo(dispatcher, props.project, props.id),
    ]).then((data) => {
      /*
        data[0][0]: issue
        data[0][1]: commit
        data[0][2]: merge
        data[0][3]: mr-sr
        data[0][4]: issue-sr
        data[0][5]: commit-sr
        data[1]: SRList
        data[2]: ProjectInfo
        data[3]: SRChangeLogInfo
      */
      const assoCommitListData = oneSR2AllCommit(
        props.id,
        JSON.stringify(data[0][5]),
        JSON.stringify(data[0][1])
      );
      assoCommitListData.sort(
        (commit_1: any, commit_2: any) =>
          commit_1.createdAt - commit_2.createdAt
      );
      setAssoCommitList(assoCommitListData);
      const assoIssueListData = SR2Issue(
        props.id,
        JSON.stringify(data[0][4]),
        JSON.stringify(data[0][0])
      );
      const newAssoIssueList: any = [];
      assoIssueListData.forEach((value: any) => {
        if (value !== "not found") {
          newAssoIssueList.push(
            <IssueCard data={JSON.stringify(value)} key={value.id} />
          );
        }
      });
      setAssoIssueCardList(newAssoIssueList);
      const assoMRListData = oneSR2AllMR(
        props.id,
        JSON.stringify(data[0][3]),
        JSON.stringify(data[0][2])
      );
      const newAssoMRCardList: any = [];
      assoMRListData.forEach((value: MergeRequestProps) => {
        newAssoMRCardList.push(
          <MRCard
            data={JSON.stringify(value)}
            key={value.id}
            MRSRAssociationStore={JSON.stringify(data[0][3])}
            SRListStore={JSON.stringify(data[1])}
          />
        );
      });
      setAssoMRCardList(newAssoMRCardList);
    });

    Promise.all([
      getSRIterationInfo(dispatcher, props.project),
      getIterationInfo(dispatcher, props.project),
    ]).then((data: any) => {
      const assoIterData = SR2Iteration(
        props.id,
        JSON.stringify(data[0]),
        JSON.stringify(data[1])
      );
      const newAssoIterList: any = [];
      assoIterData.forEach((value: any) => {
        newAssoIterList.push(
          <div
            key={value.id}
            style={{
              margin: "1rem",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <ClockCircleTwoTone
              twoToneColor="#52c41a"
              style={{ fontSize: "1.5rem" }}
            />
            <span
              style={{
                fontWeight: "bold",
                fontSize: "1rem",
                margin: "0.5rem",
              }}
            >
              {value.title}
            </span>
            <span
              style={{
                fontWeight: "bold",
                margin: "0.5rem",
              }}
            >
              开始时间：
            </span>
            <span>
              {moment(value.begin * 1000).format("YYYY-MM-DD HH:mm:ss")}
            </span>
            &nbsp;&nbsp;&nbsp;
            <span
              style={{
                fontWeight: "bold",
                margin: "0.5rem",
              }}
            >
              结束时间：
            </span>
            <span>
              {moment(value.end * 1000).format("YYYY-MM-DD HH:mm:ss")}
            </span>
          </div>
        );
      });
      setAssoIterList(newAssoIterList);
    });

    Promise.all([
      getSRServiceInfo(dispatcher, props.project),
      updateServiceInfo(dispatcher, props.project),
    ]).then((data: any) => {
      const assoServiceData = SR2Service(
        props.id,
        JSON.stringify(data[0]),
        JSON.stringify(data[1])
      );
      const newAssoService: any = [];
      assoServiceData.forEach((value: any) => {
        newAssoService.push(
          <ProjectServiceCard
            key={value.id}
            data={JSON.stringify(value)}
            modal={(raw) => {
              setCached(raw);
              setModal(true);
            }}
          />
        );
      });
      setAssoService(newAssoService);
    });

    // update IR SR Association
    Promise.all([
      getIRSRInfo(dispatcher, props.project), // 该项目所有 IR SR
      getIRListInfo(dispatcher, props.project), // 该项目所有 IR
    ]).then((data) => {
      // data 为即时得到的 store 信息，不等异步了
      const assoIRListData = oneSR2AllIR(
        props.id,
        JSON.stringify(data[0]),
        JSON.stringify(data[1])
      );
      const newAssoIRCardList: any = [];
      assoIRListData.forEach((value: IRCardProps) => {
        newAssoIRCardList.push(
          <IRCard
            id={value.id}
            key={value.id}
            project={value.project}
            title={value.title}
            description={value.description}
            rank={value.rank}
            createdAt={value.createdAt}
            progress={value.progress}
            iter={value.iter}
          />
        );
      });
      setAssoIRCardList(newAssoIRCardList);
    });
  };

  useEffect(() => {
    updateProjectInfo(dispatcher, props.project).then((data) => {
      // console.log(data);
      const userInfo = data.data.users.filter(
        (user: any) => user.id === props.createdBy
      )[0];
      const avatar =
        userInfo.avatar.length < 5
          ? `https://www.gravatar.com/avatar/${CryptoJS.MD5(userInfo.email)}`
          : userInfo.avatar;
      setUserAvatar(avatar);
    });
  }, []);

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
    setDescEditing(false);
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

  // if (userInfo === "" || projectStore === "") return <Loading />;

  return (
    <>
      <div
        className="SRCard-small"
        onClick={() => {
          // document.getElementsByTagName("input")[0].checked = true;
          setModalVisible(true);
          updateAssociation(); // 更新 store
          // addClickListener(); // 添加点击事件监听
        }}
      >
        <div className="SRCard-small-header">
          <div className="SRCard-small-header-left">{title}</div>
          <div className="SRCard-small-header-right">
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
        <div className="SRCard-small-description">
          <Typography>
            <Text ellipsis={true}>{description}</Text>
          </Typography>
        </div>
        <div className="SRCard-small-down">
          <Avatar.Group>
            <Avatar
              className="SRCard-small-avatar"
              size="small"
              src={userAvatar}
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
        width={"90%"}
      >
        <div className="SRModal-header">
          <div
            className="SRModal-header-left"
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
          <div className="SRModal-header-right"></div>
        </div>
        <Divider />
        <div className="SRModal-content">
          <div className="SRModal-content-left">
            <div className="SRModal-content-left-up">
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "1.5rem",
                  marginBottom: "1rem",
                }}
              >
                功能需求描述
              </div>
              <Typography id="description-container">
                <Paragraph
                  className="SRModal-content-desc"
                  id="description-inner"
                  editable={{
                    onChange: setDescription,
                    maxLength: 512,
                    editing: descEditing,
                    icon: null,
                    onEnd: () => setDescEditing(false),
                    onCancel: () => setDescEditing(false),
                  }}
                  ellipsis={{
                    rows: 6,
                  }}
                  onClick={() => setDescEditing(true)}
                >
                  {description}
                </Paragraph>
              </Typography>
            </div>
            <div className="SRModal-content-left-middle">
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <span style={{ fontWeight: "bold", marginRight: "1rem" }}>
                  负责人：
                </span>
                <UIUserCardPreview
                  userId={Number(props.createdBy)}
                  projectStore={projectStore}
                  // yourSelf={false}
                />
              </div>
              <div>
                <b>创建时间:</b>
                {"   " +
                  (props.createdAt
                    ? moment(props.createdAt * 1000).format(
                        "YYYY-MM-DD HH:mm:ss"
                      )
                    : "无创建时间记录")}
              </div>
            </div>
            <Divider />
            <div
              style={{
                fontWeight: "bold",
                fontSize: "1.5rem",
                marginBottom: "1rem",
              }}
            >
              提交记录
            </div>
            <UICommitList
              commitListData={JSON.stringify(assoCommitList)}
              userInfo={userInfo}
            />
            <div
              style={{
                fontWeight: "bold",
                fontSize: "1.5rem",
                marginBottom: "1rem",
              }}
            >
              更改记录
            </div>
            <UISRChangeLogList
              SRChangeLogListInfo={SRChangeLogStore}
              projectStore={projectStore}
            />
          </div>
          <Divider type="vertical" style={{ width: "5px", height: "auto" }} />
          <div className="SRModal-content-right">
            <div className="SRWrap SR-IR-related">
              <div className="SR-title-related">关联原始需求</div>
              {assoIRCardList.length === 0 ? (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  style={{
                    width: "100%",
                  }}
                />
              ) : (
                <QueueAnim
                  className="SR-content-related"
                  duration={2000}
                  interval={100}
                >
                  {assoIRCardList}
                </QueueAnim>
              )}
            </div>
            <div className="SRWrap SR-MR-related">
              <div className="SR-title-related">关联合并</div>
              {assoMRCardList.length === 0 ? (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  style={{
                    width: "100%",
                  }}
                />
              ) : (
                <QueueAnim
                  className="SR-content-related"
                  type="right"
                  ease="[.42,0,.58,1, .42,0,.58,1]"
                >
                  {assoMRCardList}
                </QueueAnim>
              )}
            </div>
            <div className="SRWrap SR-issue-related">
              <div className="SR-title-related">关联缺陷</div>
              {assoIssueCardList.length === 0 ? (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  style={{
                    width: "100%",
                  }}
                />
              ) : (
                <QueueAnim
                  className="SR-content-related"
                  type="right"
                  ease="[.42,0,.58,1, .42,0,.58,1]"
                >
                  {assoIssueCardList}
                </QueueAnim>
              )}
            </div>
            <div className="SRWrap SR-iteration-related">
              <div className="SR-title-related">关联迭代</div>
              {assoIterList.length === 0 ? (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  style={{
                    width: "100%",
                  }}
                />
              ) : (
                <>{assoIterList}</>
              )}
            </div>
            <div className="SRWrap SR-service-related">
              <div className="SR-title-related">关联服务</div>
              {assoService.length === 0 ? (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  style={{
                    width: "100%",
                  }}
                />
              ) : (
                <>
                  <div className="SR-service-content-related">
                    {assoService}
                  </div>
                  <Modal
                    title={"服务查看"}
                    footer={null}
                    visible={modal}
                    width={"70vw"}
                    onCancel={() => setModal(false)}
                    destroyOnClose={true}
                  >
                    <ServiceReadonlyModal
                      data={cached}
                      close={() => setModal(false)}
                    />
                  </Modal>
                </>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SRCard;
