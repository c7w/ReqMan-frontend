import { useDispatch, useSelector } from "react-redux";
import { getUserStore } from "../../store/slices/UserSlice";
import { getProjectStore } from "../../store/slices/ProjectSlice";
import { getIterationStore } from "../../store/slices/IterationSlice";
import { useParams } from "react-router-dom";
import "./UIIteration.css";
import { Button, DatePicker, Input, Modal, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { createIteration } from "../../store/functions/RMS";
import { Iteration } from "../../store/ConfigureStore";
import { ToastMessage } from "../../utils/Navigation";

interface ManagerModelProps {
  visible: boolean;
  close: () => void;
}

const UIIterationManagerModel = (props: ManagerModelProps) => {
  // Select stores
  const userStore = useSelector(getUserStore);
  const projectStore = useSelector(getProjectStore);
  const iterationStore = useSelector(getIterationStore);

  // Dispatcher && get project ID
  const dispatcher = useDispatch();
  const params = useParams<"id">();
  const project_id = Number(params.id);

  // States
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<any>();

  const [sid, setSid] = useState(0);

  useEffect(() => {
    let currMaxSid = -1;
    JSON.parse(iterationStore).data.forEach((d: Iteration) => {
      currMaxSid = d.sid > currMaxSid ? d.sid : currMaxSid;
    });
    setSid(currMaxSid + 1);
  }, [iterationStore]);

  return (
    <Modal
      visible={props.visible}
      onCancel={props.close}
      footer={null}
      title={"迭代周期管理"}
      width={"60vw"}
    >
      {/*// List of current all iterations*/}
      {iterationStore}
      <hr style={{ width: "100%", margin: "0rem auto 1rem" }} />
      {/*// Create new iterations*/}
      <div>
        <p style={{ marginTop: "1rem", marginBottom: "0.2rem" }}>
          <span style={{ color: "red" }}>* </span>新建周期名称：
        </p>
        <Input
          value={title}
          onChange={(evt) => setTitle(evt.target.value)}
          style={{ width: "25%" }}
        />{" "}
        <p style={{ marginTop: "1rem", marginBottom: "0.2rem" }}>
          <span style={{ color: "red" }}>* </span>
          新建周期展示编号（编号会从小到大展示）：
        </p>
        <Input
          type={"number"}
          value={sid}
          onChange={(evt) => setSid(Number(evt.target.value))}
          style={{ width: "25%" }}
        />
        <p style={{ marginTop: "1rem", marginBottom: "0.2rem" }}>
          <span style={{ color: "red" }}>* </span>新建周期时间区间：
        </p>
        <DatePicker.RangePicker onChange={(date) => setDate(date)} /> <br />
        <Button
          type={"primary"}
          disabled={!(title.trim() !== "" && date)}
          onClick={() => {
            createIteration(dispatcher, project_id, {
              title,
              begin: date[0].unix() + 0.001,
              end: date[1].unix() + 0.001,
              sid: sid,
            }).then((data) => {
              if (data.code === 0) {
                ToastMessage("success", "创建成功", "您的迭代周期创建成功");
                setTitle("");
              } else {
                ToastMessage("error", "创建失败", "您的迭代周期创建失败");
              }
            });
          }}
          style={{ marginTop: "1rem" }}
        >
          确认提交
        </Button>
      </div>
    </Modal>
  );
};

const UIIteration = () => {
  // Select stores
  const userStore = useSelector(getUserStore);
  const projectStore = useSelector(getProjectStore);
  const iterationStore = useSelector(getIterationStore);

  // Dispatcher && get project ID
  const dispatcher = useDispatch();
  const params = useParams<"id">();
  const project_id = Number(params.id);

  // State
  const [manager, setManager] = useState(false);

  const iteration_show_length =
    JSON.parse(iterationStore).length > 1
      ? JSON.parse(iterationStore).length
      : 1;

  return (
    <div className={"project-iteration-container"}>
      <div className={"project-iteration-header"}>
        <Button type={"primary"} onClick={() => setManager(true)}>
          迭代周期管理
        </Button>
        <UIIterationManagerModel
          visible={manager}
          close={() => {
            setManager(false);
          }}
        />
      </div>
      <hr style={{ width: "90%", margin: "0rem auto 1rem" }} />
      <div className={"project-iteration-map-container"}>
        <table
          className={"iteration-table"}
          width={iteration_show_length * window.innerWidth * 0.8}
        >
          <thead>
            <tr>
              <td colSpan={iteration_show_length}>迭代-需求查看</td>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  );
};

export default UIIteration;
