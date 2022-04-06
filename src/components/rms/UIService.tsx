import { Button, Empty, Input, Modal, Progress, Typography } from "antd";
import "./UIService.css";
import { ReactElement, useEffect, useMemo, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import request_json from "../../utils/Network";
import { faAtom } from "@fortawesome/free-solid-svg-icons";
import API from "../../utils/APIList";
import { useParams } from "react-router-dom";
import { ToastMessage } from "../../utils/Navigation";
import {
  getServiceStore,
  getSRServiceStore,
} from "../../store/slices/ServiceSlice";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import moment from "moment";
import {
  deleteServiceInfo,
  doUpdateServiceInfo,
  updateServiceInfo,
} from "../../store/functions/RMS";
import { Iteration2SR, Service2SR } from "../../utils/Association";
import { getSRIterationStore } from "../../store/slices/IterationSlice";
import { getSRListStore } from "../../store/slices/IRSRSlice";
import { SRCardProps } from "../../store/ConfigureStore";

interface ProjectServiceCardProps {
  data: string;
  modal: (raw: string) => void;
}

export const ProjectServiceCard = (props: ProjectServiceCardProps) => {
  const data = JSON.parse(props.data);

  // TODO: Buggy selected association!!!!!!
  const serviceSRStore = useSelector(getSRServiceStore);
  const SRListStore = useSelector(getSRListStore);

  const getPercentage = (service_id: number) => {
    let now = 0;
    let all = 0;
    Service2SR(service_id, serviceSRStore, SRListStore).forEach((sr: any) => {
      all += sr.priority;
      if (sr.state === "Reviewing" || sr.state === "Done") {
        now += sr.priority;
      }
    });
    return all === 0 ? 0 : Number(((now / all) * 100).toFixed(1));
  };

  const getSuccessPercentage = (service_id: number) => {
    let now = 0;
    let all = 0;
    Service2SR(service_id, serviceSRStore, SRListStore).forEach((sr: any) => {
      all += sr.priority;
      if (sr.state === "Done") {
        now += sr.priority;
      }
    });
    return all === 0 ? 0 : Number(((now / all) * 100).toFixed(1));
  };

  return (
    <div className={"service-card"} onClick={() => props.modal(props.data)}>
      <div
        style={{
          fontSize: "1.5rem",
          userSelect: "none",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <FontAwesomeIcon
          icon={faAtom}
          style={{ display: "inline", color: "green" }}
        />{" "}
        &nbsp;&nbsp;
        <span>{data.title} &nbsp;</span>
        <span style={{ fontSize: "0.8rem" }}>(#{data.id})</span>
      </div>
      <div style={{ margin: "0.5rem 0" }}>
        <span className={"service-label"}>创建时间</span>&nbsp;&nbsp;
        <span>{moment(data.createdAt * 1000).format("lll")}</span>
      </div>
      <div className={"service-row"}>
        <span className={"service-label"}>开发进度</span>&nbsp;&nbsp;
        <Progress
          percent={getPercentage(data.id)}
          success={{ percent: getSuccessPercentage(data.id) }}
          style={{ width: "70%" }}
        />
      </div>
    </div>
  );
};

const ServiceModal = (props: { data: string; close: () => void }) => {
  const data = JSON.parse(props.data);

  const SRIterationAssociationStore = useSelector(getSRIterationStore);
  const SRListStore = useSelector(getSRListStore);

  const getPercentage = (iteration_id: number) => {
    let now = 0;
    let all = 0;
    Iteration2SR(
      iteration_id,
      SRIterationAssociationStore,
      SRListStore
    ).forEach((sr: any) => {
      all += sr.priority;
      if (sr.state === "Reviewing" || sr.state === "Done") {
        now += sr.priority;
      }
    });
    return all === 0 ? 0 : Number(((now / all) * 100).toFixed(1));
  };

  const getSuccessPercentage = (iteration_id: number) => {
    let now = 0;
    let all = 0;
    Iteration2SR(
      iteration_id,
      SRIterationAssociationStore,
      SRListStore
    ).forEach((sr: any) => {
      all += sr.priority;
      if (sr.state === "Done") {
        now += sr.priority;
      }
    });
    return all === 0 ? 0 : Number(((now / all) * 100).toFixed(1));
  };

  const [title, setTitle] = useState(data.title);
  const [desp, setDesp] = useState(data.description);

  const dispatcher = useDispatch();
  const params = useParams<"id">();
  const project_id = params.id;

  const [deleteModal, setDeleteModal] = useState(false);

  return (
    <div className={"service-modal"}>
      <div
        style={{
          fontSize: "1.5rem",
          userSelect: "none",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <FontAwesomeIcon
          icon={faAtom}
          style={{ display: "inline", color: "green" }}
        />{" "}
        &nbsp;&nbsp;
        <span>{data.title} &nbsp;</span>
        <span style={{ fontSize: "0.8rem" }}>(#{data.id})</span>
      </div>
      <div style={{ margin: "0.5rem 0" }}>
        <span className={"service-label"}>创建时间</span>&nbsp;&nbsp;
        <span>{moment(data.createdAt * 1000).format("lll")}</span>
      </div>
      <div style={{ margin: "0.5rem 0" }}>
        <span className={"service-label"}>开发进度</span>&nbsp;&nbsp;
        <Progress
          percent={getPercentage(data.id)}
          success={{ percent: getSuccessPercentage(data.id) }}
          style={{ width: "40%" }}
        />
      </div>
      <div className={"service-row"}>
        <span className={"service-label"}>服务简介</span>&nbsp;&nbsp;
      </div>
      <div
        style={{
          // border: "1px black solid",
          // borderRadius: "1rem",
          padding: "1rem",
          width: "60%",
          marginLeft: "2rem",
        }}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
          {data.description}
        </ReactMarkdown>
      </div>

      <hr />
      <div>
        <p style={{ marginTop: "1rem", marginBottom: "0.2rem" }}>服务名称：</p>
        <Input value={title} onChange={(evt) => setTitle(evt.target.value)} />

        <p style={{ marginTop: "1rem", marginBottom: "0.2rem" }}>服务描述：</p>
        <MDEditor
          value={desp}
          onChange={(val) => {
            setDesp(val);
          }}
        />
        <Button
          type={"primary"}
          disabled={!(title.trim() !== "" && desp?.trim() !== "")}
          onClick={() =>
            doUpdateServiceInfo(dispatcher, Number(project_id), {
              id: data.id,
              title,
              description: desp,
            }).then((data) => {
              if (data.code === 0) {
                ToastMessage("success", "更新成功", "服务信息更新成功");
                props.close();
              }
            })
          }
          style={{ marginTop: "1rem" }}
        >
          确认提交
        </Button>
        <Button danger={true} onClick={() => setDeleteModal(true)}>
          删除服务
        </Button>
        <Modal
          closable={false}
          title={"删除服务"}
          visible={deleteModal}
          onCancel={() => setDeleteModal(false)}
          footer={
            <Button
              danger={true}
              onClick={() => {
                deleteServiceInfo(dispatcher, Number(project_id), {
                  id: data.id,
                }).then((data) => {
                  if (data.code === 0) {
                    ToastMessage("success", "删除成功", "服务信息删除成功");
                    props.close();
                  }
                });
              }}
            >
              确认
            </Button>
          }
        >
          <Typography.Text>确定要删除该服务吗？</Typography.Text>
          <br />
          <Typography.Text>
            删除该服务后，所有与该服务关联的 SR 将会失去服务关联！
          </Typography.Text>
        </Modal>
      </div>
    </div>
  );
};

const UIService = () => {
  const dispatcher = useDispatch();
  const params = useParams<"id">();
  const project_id = params.id;

  const serviceStore = useSelector(getServiceStore);

  const [createService, setCreateService] = useState(false);
  const [leftService, setLeftService] = useState<ReactElement[]>([]);
  const [rightService, setRightService] = useState<ReactElement[]>([]);

  const [title, setTitle] = useState("");
  const [desp, setDesp] = useState<string | undefined>(
    "**在这里填写服务描述**"
  );

  const [cached, setCached] = useState("");
  const [modal, setModal] = useState(false);

  useEffect(() => {
    // Construct Service Cards
    const newLeft: ReactElement[] = [];
    const newRight: ReactElement[] = [];
    if (serviceStore === "" || JSON.parse(serviceStore).code !== 0) {
      return;
    }
    const serviceData = JSON.parse(serviceStore);
    serviceData.data
      .map((rawData: any) => (
        <ProjectServiceCard
          data={JSON.stringify(rawData)}
          modal={(raw) => {
            setCached(raw);
            setModal(true);
          }}
          key={rawData.id}
        />
      ))
      .forEach((val: any, ind: number) => {
        ind % 2 === 0 ? newLeft.push(val) : newRight.push(val);
      });
    setLeftService(newLeft);
    setRightService(newRight);
  }, [serviceStore]);

  const submitNewService = () => {
    request_json(API.POST_RMS, {
      body: {
        data: {
          updateData: {
            title,
            description: desp,
            rank: 1,
          },
        },
        project: project_id,
        operation: "create",
        type: "service",
      },
    }).then((data) => {
      if (data.code === 0) {
        setCreateService(false);
        ToastMessage("success", "提交成功", "您的服务创建成功");
        setTitle("");
        setDesp("");
        updateServiceInfo(dispatcher, Number(project_id));
      }
    });
  };

  return (
    <div className={"personal-setting-container"}>
      <div className={"ServiceHeader"}>
        <Button type={"primary"} onClick={() => setCreateService(true)}>
          创建新服务
        </Button>
        <Modal
          visible={createService}
          onCancel={() => setCreateService(false)}
          title={"创建新服务"}
          width={"60vw"}
          footer={
            <Button
              type={"primary"}
              disabled={!(title.trim() !== "" && desp?.trim() !== "")}
              onClick={submitNewService}
            >
              确认提交
            </Button>
          }
        >
          <div>
            <p style={{ marginTop: "1rem", marginBottom: "0.2rem" }}>
              服务名称：
            </p>
            <Input
              value={title}
              onChange={(evt) => setTitle(evt.target.value)}
            />

            <p style={{ marginTop: "1rem", marginBottom: "0.2rem" }}>
              服务描述：
            </p>
            <MDEditor
              value={desp}
              onChange={(val) => {
                setDesp(val);
              }}
            />
          </div>
        </Modal>
      </div>
      <hr style={{ width: "90%", margin: "1rem auto" }} />
      <div className={"ServiceShowcase"}>
        <div className={"ServiceShowcaseLeft"}>{leftService}</div>
        <div className={"ServiceShowcaseRight"}>{rightService}</div>
      </div>
      <div
        style={{
          visibility:
            leftService.length === 0 && rightService.length === 0
              ? "visible"
              : "hidden",
        }}
      >
        <Empty description={"请创建项目服务"} />
      </div>
      <Modal
        title={"服务修改"}
        footer={null}
        visible={modal}
        width={"70vw"}
        onCancel={() => setModal(false)}
        destroyOnClose={true}
      >
        <ServiceModal data={cached} close={() => setModal(false)} />
      </Modal>
    </div>
  );
};

export default UIService;
