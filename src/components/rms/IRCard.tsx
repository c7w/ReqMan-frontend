import { IRCardProps, SRCardProps } from "../../store/ConfigureStore";
import React, { useEffect, useState } from "react";
import {
  getIRIterationInfo,
  getIRListInfo,
  getIRSRInfo,
  getIterationInfo,
  getSRListInfo,
  getUserSRInfo,
  updateIRInfo,
} from "../../store/functions/RMS";
import { ToastMessage } from "../../utils/Navigation";
import { updateCounter } from "../../store/slices/CalendarSlice";
import { useDispatch, useSelector } from "react-redux";
import { getUserStore } from "../../store/slices/UserSlice";
import { getProjectStore } from "../../store/slices/ProjectSlice";
import CryptoJS from "crypto-js";
import "./IRCard.css";
import {
  Avatar,
  Breadcrumb,
  Divider,
  Empty,
  Modal,
  Select,
  Space,
  Tag,
  Typography,
} from "antd";
import moment from "moment";
import Paragraph from "antd/es/typography/Paragraph";
import Text from "antd/es/typography/Text";
import {
  getIRListStore,
  getIRSRStore,
  getSRListStore,
} from "../../store/slices/IRSRSlice";
import { IR2Iteration, oneIR2AllSR } from "../../utils/Association";
import {
  getIRIterationStore,
  getIterationStore,
} from "../../store/slices/IterationSlice";
import SRCard from "./SRCard";
import { getUserAvatar, userId2Avatar } from "../../utils/UserAvatar";
import { UIUserCardPreview } from "../ums/UIUserCard";
import { ClockCircleTwoTone } from "@ant-design/icons";
import QueueAnim from "rc-queue-anim";
import { updateProjectInfo } from "../../store/functions/UMS";
import { expandSRList } from "../../utils/SRClassification";
import { getUserSRStore } from "../../store/slices/UserSRSlice";
import { useParams } from "react-router-dom";

const IRCard = (props: IRCardProps) => {
  const dispatcher = useDispatch();
  // get project ID
  const params = useParams<"id">();
  const project_id = Number(params.id);

  const userInfo = useSelector(getUserStore);
  const projectInfo = useSelector(getProjectStore);
  const IRSRAssoStore = useSelector(getIRSRStore);
  const IRIterAssoStore = useSelector(getIRIterationStore);
  const iterationStore = useSelector(getIterationStore);
  const SRListStore = useSelector(getSRListStore);
  const SRUserStore = useSelector(getUserSRStore);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(props.title);
  const [progress, setProgress] = useState<number>(props.progress);
  const [description, setDescription] = useState<string>(props.description);
  const [assoSRCardList, setAssoSRCardList] = useState([
    <SRCard
      id={-1}
      key={-1}
      project={project_id}
      title={"加载中..."}
      description={""}
      priority={1}
      rank={1}
      currState={"TODO"}
      stateColor={"#f5222d"}
      createdBy={""}
      createdAt={moment().unix()}
      disabled={true}
      iter={[]}
      chargedBy={-1}
      service={-1}
    />,
  ]);
  const [assoIterList, setAssoIterList] = useState([]);

  const [createdByAvatar, setCreatedByAvatar] = useState<string>("");

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

  useEffect(() => {
    updateProjectInfo(dispatcher, props.project).then((data) => {
      const userInfo = data.data.users.filter(
        (user: any) => user.id === props.createdBy
      )[0];
      const createdByAvatar =
        userInfo.avatar.length < 5
          ? `https://s1.ax1x.com/2022/05/08/O3S6sI.jpg`
          : userInfo.avatar;
      setCreatedByAvatar(createdByAvatar);
    });
  }, []);

  // 更新打开的 modal 对应的 SR 的所有关系
  const updateAssociation = async () => {
    Promise.all([
      getIRSRInfo(dispatcher, props.project),
      getSRListInfo(dispatcher, props.project),
      getIRIterationInfo(dispatcher, props.project),
      getIterationInfo(dispatcher, props.project),
      updateProjectInfo(dispatcher, props.project),
      getUserSRInfo(dispatcher, props.project),
    ]).then(async (data: any) => {
      const assoSRListData = await oneIR2AllSR(
        props.id,
        JSON.stringify(data[0]),
        JSON.stringify(data[1]),
        props.project
      );
      // to do: iteration card
      const assoIterData = IR2Iteration(
        props.id,
        JSON.stringify(data[2]),
        JSON.stringify(data[3])
      );
      const newAssoIterList: any = [];
      assoIterData.forEach((value: any) => {
        if (value !== "not found") {
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
        }
      });
      setAssoIterList(newAssoIterList);
      const newAssoSRCardList: any = [];
      // const assoSRIdList = data[5].data
      //   .map((asso: any) => {
      //     if (asso.user === userInfo.user.id) return asso.sr;
      //   })
      //   .filter((asso: any) => asso);
      // const assoSRList = assoSRIdList.map((sr_id: string) =>
      //   SRId2SRInfo(Number(sr_id), JSON.stringify(data[0]))
      // );
      assoSRListData.forEach((value: any) => {
        const chargedBy = data[5].data
          .map((asso: any) => {
            if (asso.sr === value.id) return asso.user;
          })
          .filter((asso: any) => asso)[0];
        newAssoSRCardList.push(
          <SRCard
            id={value.id}
            key={value.id}
            project={value.project}
            title={value.title}
            description={value.description}
            priority={value.priority}
            rank={value.rank}
            currState={value.state}
            stateColor={value.stateColor}
            createdBy={value.createdBy}
            createdAt={value.createdAt}
            disabled={value.disabled}
            iter={value.iter}
            chargedBy={chargedBy}
            service={value.service}
          />
        );
      });
      setAssoSRCardList(newAssoSRCardList);
    });
  };

  const handleCancel = () => {
    setTitle(props.title);
    setDescription(props.description);
    setProgress(props.progress);
    setModalVisible(false);
  };

  // get user role
  const user_role = JSON.parse(userInfo).data.projects.filter(
    (project: any) => project.id === Number(project_id)
  )[0]?.role;

  return (
    <>
      <div
        className="IRCard-small"
        onClick={() => {
          // document.getElementsByTagName("input")[0].checked = true;
          setModalVisible(true);
          updateAssociation();
        }}
      >
        <div className="IRCard-small-header">
          <div className="IRCard-small-header-left">
            {!title || title === "" ? "[暂无标题]" : title}
          </div>
          <div className="IRCard-small-header-right"></div>
        </div>
        <div className="IRCard-small-description">
          <Typography>
            <Text ellipsis={true}>{description}</Text>
          </Typography>
        </div>
        <div className="IRCard-small-down">
          <Avatar
            className="SRCard-small-avatar"
            size="small"
            src={createdByAvatar}
          />
          <Text ellipsis={true}>
            {props.createdAt
              ? moment(props.createdAt * 1000).format("YYYY-MM-DD HH:mm:ss")
              : "无创建时间记录"}
          </Text>
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
        <div className="IRModal-header">
          <div
            className="IRModal-header-left"
            style={{ fontWeight: "bold", fontSize: "1.5rem" }}
          >
            <Breadcrumb
              style={{
                margin: "1rem 0",
                fontSize: "1.5rem",
                paddingRight: "1rem",
              }}
            >
              <Breadcrumb.Item>
                {!title || title === "" ? "[暂无标题]" : title}
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className="IRModal-header-right"></div>
        </div>
        <Divider />
        <div className="IRModal-content">
          <div className="IRModal-content-up">
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
                editable={
                  user_role === "supermaster" || user_role === "sys"
                    ? {
                        onChange: setDescription,
                        autoSize: { maxRows: 5 },
                      }
                    : false
                }
              >
                {description}
              </Paragraph>
            </Typography>
          </div>
          <Divider />
          <div className="IRModal-content-middle">
            <div style={{ display: "flex", flexDirection: "row" }}>
              <p>负责人：</p>
              <UIUserCardPreview
                userId={Number(props.createdBy)}
                projectStore={projectInfo}
                previewSize={30}
              />
            </div>
            <div>
              <b>创建时间:</b>
              <Text ellipsis={true}>
                &nbsp;&nbsp;
                {props.createdAt
                  ? moment(props.createdAt * 1000).format("YYYY-MM-DD HH:mm:ss")
                  : "无创建时间记录"}
              </Text>
            </div>
          </div>
          <div className="IRModal-content-bottom">
            <div className="IRWrap IR-SR-related">
              <div className="IR-title-related">关联功能需求</div>
              {assoSRCardList.length > 0 ? (
                <div className="IR-content-related">{assoSRCardList}</div>
              ) : (
                <Empty description="暂无关联需求" />
              )}
            </div>
            {/*<div className="IR-iteration-related IRWrap">*/}
            {/*  <div className="IR-title-related">关联迭代</div>*/}
            {/*  {assoIterList.length === 0 ? (*/}
            {/*    <Empty*/}
            {/*      image={Empty.PRESENTED_IMAGE_SIMPLE}*/}
            {/*      style={{*/}
            {/*        width: "100%",*/}
            {/*      }}*/}
            {/*    />*/}
            {/*  ) : (*/}
            {/*    <>{assoIterList}</>*/}
            {/*  )}*/}
            {/*</div>*/}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default IRCard;
