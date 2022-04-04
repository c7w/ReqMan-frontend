import { Button, Empty, Input, Modal, Progress, Typography } from "antd";
import MDEditor from "@uiw/react-md-editor";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getServiceStore } from "../../store/slices/ServiceSlice";
import { ReactElement, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAtom } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

import { ProjectServiceCard as ProjectServiceReadonlyCard } from "./UIService";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import {
  deleteServiceInfo,
  doUpdateServiceInfo,
} from "../../store/functions/RMS";
import { ToastMessage } from "../../utils/Navigation";
import { getSRIterationStore } from "../../store/slices/IterationSlice";
import { getSRListStore } from "../../store/slices/IRSRSlice";
import { Iteration2SR } from "../../utils/Association";

export interface Service {
  id: number;
  project: number;
  title: string;
  description: string;
  rank: number;
  createdBy: number;
  createdAt: number;
}

const ServiceReadonlyModal = (props: { data: string; close: () => void }) => {
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
    </div>
  );
};

const UIServiceReadonly = () => {
  const serviceStore = useSelector(getServiceStore);

  const [leftService, setLeftService] = useState<ReactElement[]>([]);
  const [rightService, setRightService] = useState<ReactElement[]>([]);

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
    const cards = serviceData.data
      .map((rawData: any) => (
        <ProjectServiceReadonlyCard
          data={JSON.stringify(rawData)}
          modal={(raw) => {
            setCached(raw);
            setModal(true);
          }}
          key={rawData.id}
        />
      ))
      .forEach((val: any, ind: number) => {
        ind % 2 == 0 ? newLeft.push(val) : newRight.push(val);
      });
    setLeftService(newLeft);
    setRightService(newRight);
  }, [serviceStore]);
  return (
    <div className={"personal-setting-container"}>
      <Typography.Title level={2}>项目服务</Typography.Title>
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
        <Empty description={"无项目服务"} />
      </div>
      <Modal
        title={"服务查看"}
        footer={null}
        visible={modal}
        width={"70vw"}
        onCancel={() => setModal(false)}
        destroyOnClose={true}
      >
        <ServiceReadonlyModal data={cached} close={() => setModal(false)} />
      </Modal>
    </div>
  );
};

export default UIServiceReadonly;
