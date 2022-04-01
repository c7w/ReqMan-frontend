import { useDispatch, useSelector } from "react-redux";
import { getUserStore } from "../../store/slices/UserSlice";
import { getProjectStore } from "../../store/slices/ProjectSlice";
import {
  getIRIterationStore,
  getIterationStore,
  getSRIterationStore,
} from "../../store/slices/IterationSlice";
import { useParams } from "react-router-dom";
import "./UIIteration.css";
import { Button, DatePicker, Empty, Input, Modal, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { createIteration } from "../../store/functions/RMS";
import {
  IRCard,
  Iteration,
  SRCard,
  SRIteration,
} from "../../store/ConfigureStore";
import { ToastMessage } from "../../utils/Navigation";
import {
  getIRListStore,
  getIRSRStore,
  getSRListStore,
} from "../../store/slices/IRSRSlice";
import { oneIR2AllSR, SR2Iteration } from "../../utils/Association";

interface ManagerModelProps {
  visible: boolean;
  close: () => void;
}

const UIIterationManagerModel = (props: ManagerModelProps) => {
  // Select stores
  const userStore = useSelector(getUserStore);
  const projectStore = useSelector(getProjectStore);
  const iterationStore = useSelector(getIterationStore);
  console.debug(iterationStore);

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
              begin: date[0].unix() + 0.01,
              end: date[1].unix() + 0.01,
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
  const iterationStore = useSelector(getIterationStore);
  const IRStore = useSelector(getIRListStore);
  const SRStore = useSelector(getSRListStore);
  const SRIterStore = useSelector(getSRIterationStore);
  const IRSRAssociation = useSelector(getIRSRStore);

  // Dispatcher && get project ID
  const dispatcher = useDispatch();
  const params = useParams<"id">();
  const project_id = Number(params.id);

  // State
  const [manager, setManager] = useState(false);

  const iteration_show_length = JSON.parse(iterationStore).data.length + 1;

  const getBlockClassName = (
    sr_id: number,
    iter_id: number | undefined
  ): string => {
    const exists =
      JSON.parse(SRIterStore).data.filter(
        (asso: any) => asso.iteration === iter_id && asso.SR === sr_id
      ).length > 0;
    if (exists) {
      const sr = JSON.parse(SRStore).data.filter(
        (sr: SRCard) => sr.id === sr_id
      );
      if (sr.length === 0) {
        return "iteration-table-unit-exception";
      } else {
        const status = sr[0].state;
        console.debug(status);
        if (status === "TODO") {
          return "iteration-table-unit-todo";
        } else if (status === "WIP") {
          return "iteration-table-unit-wip";
        } else if (status === "Reviewing") {
          return "iteration-table-unit-reviewing";
        } else {
          return "iteration-table-unit-done";
        }
      }
    } else {
      return "iteration-table-unit-blank";
    }
  };

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
        {iteration_show_length === 1 ? (
          <Empty description={"请创建项目迭代"} />
        ) : (
          <div
            className={"iteration-table"}
            style={{ width: iteration_show_length * window.innerWidth * 0.1 }}
          >
            <div style={{ display: "flex" }}>
              {/* IR List */}
              <div className={"iteration-table-side"}>
                <div className={"iteration-table-iter-cell"}>&nbsp;</div>
                {JSON.parse(IRStore).data.map((ir: IRCard) => {
                  return (
                    <div key={ir.id}>
                      <div className={"iteration-table-ir-cell"}>
                        {ir.title}
                      </div>
                      {oneIR2AllSR(ir.id, IRSRAssociation, SRStore).map(
                        (sr: SRCard) => (
                          <div className={"iteration-table-sr-cell"}>
                            {sr.title}
                          </div>
                        )
                      )}
                    </div>
                  );
                })}
              </div>
              {/*Head*/}
              <div className={"iteration-table-header"}>
                <div className={"iteration-table-iters"}>
                  {JSON.parse(iterationStore)
                    .data.sort((a: Iteration, b: Iteration) => a.sid - b.sid)
                    .map((data: Iteration) => (
                      <div className={"iteration-table-iter-cell"}>
                        {data.title}
                      </div>
                    ))}
                </div>
                <div className={"iteration-table-units"}>
                  {JSON.parse(iterationStore)
                    .data.sort((a: Iteration, b: Iteration) => a.sid - b.sid)
                    .map((data: Iteration) => (
                      <div key={data.id}>
                        {JSON.parse(IRStore).data.map((ir: IRCard) => {
                          return (
                            <div key={ir.id}>
                              <div className={"iteration-table-ir-cell-unit"}>
                                {ir.title}
                              </div>
                              {oneIR2AllSR(ir.id, IRSRAssociation, SRStore).map(
                                (sr: SRCard) => (
                                  <div
                                    className={
                                      "iteration-table-sr-cell-unit " +
                                      getBlockClassName(sr.id, data.id)
                                    }
                                  >
                                    &nbsp;
                                  </div>
                                )
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UIIteration;
