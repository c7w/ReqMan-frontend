import { Service } from "./UIServiceReadonly";
import { Button, Input, Modal } from "antd";
import "./UIService.css";
import { ReactElement, useMemo, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import request_json from "../../utils/Network";
import API from "../../utils/APIList";
import { useParams } from "react-router-dom";

const ProjectServiceCard = (props: Service) => {
  return <div></div>;
};

const UIService = () => {
  const params = useParams<"id">();
  const project_id = params.id;

  const [createService, setCreateService] = useState(false);
  const leftService: Array<ReactElement> = [];
  const rightService: Array<ReactElement> = [];

  const [title, setTitle] = useState("");
  const [desp, setDesp] = useState<string | undefined>(
    "**在这里填写服务描述**"
  );

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
    </div>
  );
};

export default UIService;
