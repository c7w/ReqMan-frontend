import { useDispatch, useSelector } from "react-redux";
import { getUserStore } from "../../store/slices/UserSlice";
import { getProjectStore } from "../../store/slices/ProjectSlice";
import {
  getIRIterationStore,
  getIterationStore,
  getSRIterationStore,
  getUserIterationStore,
} from "../../store/slices/IterationSlice";
import { Link, useParams } from "react-router-dom";
import "./UIIteration.css";
import {
  Button,
  DatePicker,
  Empty,
  Input,
  Modal,
  Popconfirm,
  Select,
  Tabs,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  createIteration,
  deleteIterationInfo,
  updateIterationInfo,
} from "../../store/functions/RMS";
import {
  IRCardProps,
  Iteration,
  SRCardProps,
  SRIteration,
} from "../../store/ConfigureStore";
import { ToastMessage } from "../../utils/Navigation";
import {
  getIRListStore,
  getIRSRStore,
  getSRListStore,
} from "../../store/slices/IRSRSlice";
import {
  Iteration2SR,
  oneIR2AllSR,
  SR2ChargedUser,
  SR2Service,
  userId2UserInfo,
} from "../../utils/Association";
import moment, { Moment } from "moment";
import { without } from "underscore";
import { UIUserCardPreview } from "../ums/UIUserCard";
import Calendar from "./Calendar";
import SRCard from "./SRCard";
import {
  getServiceStore,
  getSRServiceStore,
} from "../../store/slices/ServiceSlice";
import { getUserSRStore } from "../../store/slices/UserSRSlice";

interface EditorModelProps {
  visible: boolean;
  close: () => void;
  title: string;
  sid: number;
  date: any;
  id: number;
}

interface ManagerModelProps {
  visible: boolean;
  close: () => void;
}

const UIIterationEditorModel = (props: EditorModelProps) => {
  const [id, setId] = useState(props.id);
  const [title, setTitle] = useState(props.title);
  const [sid, setSid] = useState(props.sid);
  const [date, setDate] = useState(props.date);

  const dispatcher = useDispatch();
  const params = useParams<"id">();
  const project_id = Number(params.id);

  useEffect(() => {
    setId(props.id);
    setTitle(props.title);
    setSid(props.sid);
    setDate(props.date);
  }, [JSON.stringify(props)]);

  // console.debug(date);
  return (
    <Modal
      visible={props.visible}
      onCancel={props.close}
      footer={
        <div>
          <Popconfirm
            title="确认要删除该迭代周期的相关配置吗？"
            onConfirm={() => {
              deleteIterationInfo(dispatcher, project_id, {
                begin: 0,
                end: 0,
                sid: 0,
                title: "",
                id,
              }).then((data) => {
                if (data.code === 0) {
                  ToastMessage("success", "删除成功", "您的迭代周期删除成功");
                  props.close();
                } else {
                  ToastMessage("error", "删除失败", "您的迭代周期删除失败");
                }
              });
            }}
            okText="删除"
            okButtonProps={{ danger: true }}
            cancelText="取消"
          >
            <Button danger={true}>删除迭代</Button>
          </Popconfirm>

          <Button
            type={"primary"}
            onClick={() => {
              updateIterationInfo(dispatcher, project_id, {
                begin: date[0].unix() + 0.01,
                end: date[1].unix() + 0.01,
                sid: sid,
                title: title,
                id,
              }).then((data) => {
                if (data.code === 0) {
                  ToastMessage("success", "修改成功", "您的迭代周期修改成功");
                  props.close();
                } else {
                  ToastMessage("error", "修改失败", "您的迭代周期修改失败");
                }
              });
            }}
          >
            确认修改
          </Button>
        </div>
      }
      title={"迭代周期编辑"}
      width={"45vw"}
    >
      <p style={{ marginTop: "1rem", marginBottom: "0.2rem" }}>
        <span style={{ color: "red" }}>* </span>周期名称：
      </p>
      <Input
        value={title}
        onChange={(evt) => setTitle(evt.target.value)}
        style={{ width: "50%" }}
      />{" "}
      <p style={{ marginTop: "1rem", marginBottom: "0.2rem" }}>
        <span style={{ color: "red" }}>* </span>
        周期展示编号（编号会从小到大展示）：
      </p>
      <Input
        type={"number"}
        value={sid}
        onChange={(evt) => setSid(Number(evt.target.value))}
        style={{ width: "50%" }}
      />
      <p style={{ marginTop: "1rem", marginBottom: "0.2rem" }}>
        <span style={{ color: "red" }}>* </span>周期时间区间：
      </p>
      <DatePicker.RangePicker value={date} onChange={(date) => setDate(date)} />{" "}
      <br />
    </Modal>
  );
};

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
    let currMaxSid = 0;
    JSON.parse(iterationStore).data.forEach((d: Iteration) => {
      currMaxSid = d.sid > currMaxSid ? d.sid : currMaxSid;
    });
    setSid(currMaxSid + 1);
  }, [iterationStore]);

  const [editor, setEditor] = useState(false);
  const [cachedId, setCachedId] = useState(0);
  const [cachedTitle, setCachedTitle] = useState("");
  const [cachedSid, setCachedSid] = useState(0);
  const [cachedDate, setCachedDate] = useState<any>();

  return (
    <Modal
      visible={props.visible}
      onCancel={props.close}
      footer={null}
      title={"迭代周期管理"}
      width={"60vw"}
    >
      <UIIterationEditorModel
        visible={editor}
        close={() => setEditor(false)}
        title={cachedTitle}
        sid={cachedSid}
        date={cachedDate}
        id={cachedId}
      />
      {/*// List of current all iterations*/}
      <table
        width={"98%"}
        style={{
          margin: "0 auto 1rem",
          textAlign: "center",
        }}
      >
        <thead>
          <tr
            style={{
              borderWidth: "1px",
              padding: "8px",
              borderStyle: "solid",
              borderColor: "#666666",
              backgroundColor: "#dedede",
            }}
          >
            <td>迭代周期编号</td>
            <td>周期名</td>
            <td>起始时间</td>
            <td>结束时间</td>
            <td>操作</td>
          </tr>
        </thead>
        <tbody>
          {JSON.parse(iterationStore).data.map((iter: Iteration) => (
            <tr
              key={iter.id}
              style={{
                borderWidth: "1px",
                padding: "8px",
                borderStyle: "solid",
                borderColor: "#666666",
                backgroundColor: "#ffffff",
              }}
            >
              <td className={"iter-manager-column"}>{iter.sid}</td>
              <td
                className={"iter-manager-column"}
                style={{ maxWidth: "15rem", overflow: "hidden" }}
              >
                {iter.title}
              </td>
              <td className={"iter-manager-column"}>
                {moment(iter.begin * 1000).format("LL")}
              </td>
              <td className={"iter-manager-column"}>
                {moment(iter.end * 1000).format("LL")}
              </td>
              <td className={"iter-manager-column"}>
                <Typography.Link
                  onClick={() => {
                    // console.debug("==============================");
                    setCachedId(iter.id as number);
                    setCachedSid(iter.sid);
                    setCachedTitle(iter.title);
                    setCachedDate([
                      moment(iter.begin * 1000),
                      moment(iter.end * 1000),
                    ]);
                    setEditor(true);
                    // console.debug("==============================");
                  }}
                >
                  编辑
                </Typography.Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
  const userStore = useSelector(getUserStore);
  const projectStore = useSelector(getProjectStore);
  const iterationStore = useSelector(getIterationStore);
  const useriterStore = useSelector(getUserIterationStore);

  const SRServiceStore = useSelector(getSRServiceStore);
  const serviceStore = useSelector(getServiceStore);

  const IRStore = useSelector(getIRListStore);
  const SRStore = useSelector(getSRListStore);
  const SRIterStore = useSelector(getSRIterationStore);
  const IRSRAssociation = useSelector(getIRSRStore);
  const userSRStore = useSelector(getUserSRStore);

  // Dispatcher && get project ID
  const dispatcher = useDispatch();
  const params = useParams<"id">();
  const project_id = Number(params.id);

  // State
  const [manager, setManager] = useState(false);
  const [detail, setDetail] = useState("[]");

  const iteration_show_length = JSON.parse(iterationStore).data.length + 1;

  const [currIteration, setCurrIteration] = useState(0);
  const curr_iter = JSON.parse(iterationStore).data.find(
    (iter: Iteration) => iter.id === currIteration
  );
  const curr_iter_id = curr_iter ? curr_iter.id : -1;

  const [currSR, setCurrSR] = useState({
    TODO: [],
    WIP: [],
    Reviewing: [],
    Done: [],
  });

  useEffect(() => {
    // Judge if currIteration in iterationStore
    if (iterationStore) {
      const iteration = JSON.parse(iterationStore).data;
      const _currIteration = iteration.findIndex(
        (iter: Iteration) => iter.id === currIteration
      );
      if (_currIteration !== -1) {
        // Find!
        return;
      }

      const iterInfo = JSON.parse(iterationStore).data;
      // Find the iteration with max sid
      let maxSid = -2,
        maxIter = -1;

      for (let i = 0; i < iterInfo.length; i++) {
        if (iterInfo[i].sid > maxSid) {
          maxSid = iterInfo[i].sid;
          maxIter = i;
        }
      }

      setCurrIteration(JSON.parse(iterationStore).data[maxIter].id as number);
    }
  }, [iterationStore]);

  const reload_SR = async () => {
    // Prepare SRs
    const currSR: any = {
      TODO: [],
      WIP: [],
      Reviewing: [],
      Done: [],
    };
    // Read all SRs
    const SRs = await Iteration2SR(
      currIteration,
      SRIterStore,
      SRStore,
      Number(project_id)
    );
    console.debug(SRs);
    for (let i = 0; i < SRs.length; i++) {
      const sr = SRs[i];
      // Switch status
      switch (sr.state) {
        case "TODO":
          currSR.TODO.push(sr);
          break;
        case "WIP":
          currSR.WIP.push(sr);
          break;
        case "Reviewing":
          currSR.Reviewing.push(sr);
          break;
        case "Done":
          currSR.Done.push(sr);
          break;
      }
    }
    setCurrSR(currSR);
    console.debug(currSR);
  };

  useEffect(() => {
    reload_SR();
  }, [currIteration]);

  // const getBlockClassName = (
  //   sr_id: number,
  //   iter_id: number | undefined
  // ): string => {
  //   const exists =
  //     JSON.parse(SRIterStore).data.filter(
  //       (asso: any) => asso.iteration === iter_id && asso.SR === sr_id
  //     ).length > 0;
  //   if (exists) {
  //     const sr = JSON.parse(SRStore).data.filter(
  //       (sr: SRCardProps) => sr.id === sr_id
  //     );
  //     if (sr.length === 0) {
  //       return "iteration-table-unit-exception";
  //     } else {
  //       const status = sr[0].state;
  //       if (status === "TODO") {
  //         return "iteration-table-unit-todo";
  //       } else if (status === "WIP") {
  //         return "iteration-table-unit-wip";
  //       } else if (status === "Reviewing") {
  //         return "iteration-table-unit-reviewing";
  //       } else {
  //         return "iteration-table-unit-done";
  //       }
  //     }
  //   } else {
  //     return "iteration-table-unit-blank";
  //   }
  // };
  //
  // const getIRBlockClassName = (ir_id: number, data_id: number) => {
  //   const key = { TODO: 0, WIP: 1, Reviewing: 2, Done: 3 };
  //   let now = 4;
  //   oneIR2AllSR(ir_id, IRSRAssociation, SRStore).forEach((sr: any) => {
  //     const exists =
  //       JSON.parse(SRIterStore).data.filter(
  //         (asso: any) => asso.iteration === data_id && asso.SR === sr.id
  //       ).length > 0;
  //     if (exists) {
  //       const curr = key[sr.state as "TODO" | "WIP" | "Reviewing" | "Done"];
  //       now = curr < now ? curr : now;
  //     }
  //   });
  //   const ans = [
  //     "iteration-table-unit-todo",
  //     "iteration-table-unit-wip",
  //     "iteration-table-unit-reviewing",
  //     "iteration-table-unit-done",
  //     "iteration-table-unit-blank",
  //   ];
  //   return ans[now];
  // };
  //
  // const getIRIterPercentage = (ir_id: number, data_id: number) => {
  //   let now = 0;
  //   let all = 0;
  //
  //   oneIR2AllSR(ir_id, IRSRAssociation, SRStore).forEach((sr: any) => {
  //     const exists =
  //       JSON.parse(SRIterStore).data.filter(
  //         (asso: any) => asso.iteration === data_id && asso.SR === sr.id
  //       ).length > 0;
  //
  //     if (exists) {
  //       all += sr.priority;
  //       const curr = sr.state === "Reviewing" || sr.state === "Done";
  //       if (curr) {
  //         now += sr.priority;
  //       }
  //     }
  //   });
  //   if (all != 0) return ((now / all) * 100).toFixed(2) + "%";
  //   else return "";
  // };
  //
  // const getSRState = (sr: any, iter_id: number | undefined) => {
  //   const exists =
  //     JSON.parse(SRIterStore).data.filter(
  //       (asso: any) => asso.iteration === iter_id && asso.SR === sr.id
  //     ).length > 0;
  //   if (exists) {
  //     const ans = {
  //       TODO: "未开始",
  //       WIP: "开发中",
  //       Reviewing: "测试中",
  //       Done: "已交付",
  //     };
  //     return ans[sr.state as "TODO" | "WIP" | "Reviewing" | "Done"];
  //   }
  //   return "";
  // };

  // console.debug(useriterStore);
  const users_charging = JSON.parse(useriterStore)
    .data.filter((user: any) => user.iteration === curr_iter_id)
    .map((user: any) => userId2UserInfo(user.user, projectStore));
  // console.debug(users_charging);

  return (
    <div className={"project-iteration-container"}>
      <div
        style={{
          fontSize: "2rem",
          marginLeft: "1rem",
          userSelect: "none",
          alignSelf: "flex-start",
          display: "flex",
          flexDirection: "row",
          width: "100%",
        }}
      >
        <p style={{ marginBottom: "0px" }}>项目迭代管理</p>
        <div style={{ flexGrow: "1" }} />
        <Select
          value={currIteration}
          onChange={(value: number) => {
            setCurrIteration(value);
          }}
          style={{ alignSelf: "end", marginRight: "2rem", width: "8rem" }}
        >
          {JSON.parse(iterationStore)
            .data.sort((a: any, b: any) => b.sid - a.sid)
            .map((iter: any) => (
              <Select.Option value={iter.id} key={iter.id}>
                {iter.title}
              </Select.Option>
            ))}
        </Select>
        {["supermaster", "sys"].indexOf(
          JSON.parse(userStore).data.projects.filter(
            (project: any) => project.id === Number(project_id)
          )[0].role
        ) < 0 ? null : (
          <Button
            type={"primary"}
            onClick={() => setManager(true)}
            style={{ marginRight: "2rem", alignSelf: "end" }}
          >
            迭代周期管理
          </Button>
        )}

        <UIIterationManagerModel
          visible={manager}
          close={() => {
            setManager(false);
          }}
        />
      </div>
      <hr style={{ width: "98%", margin: "1rem auto" }} />

      {JSON.parse(iterationStore).data.findIndex(
        (iter: any) => iter.id === currIteration
      ) < 0 ? (
        <Empty description={"请创建项目迭代"} />
      ) : (
        <div
          className={"iteration-meta-data"}
          style={{
            display: "flex",
            flexDirection: "column",
            width: "90%",
          }}
        >
          <div
            style={{
              marginLeft: "1rem",
            }}
          >
            <div style={{ margin: "0.5rem 0" }}>
              <span className={"service-label"}>项目迭代名称</span>&nbsp;&nbsp;
              <span>{curr_iter.title}</span>
            </div>
            <div style={{ margin: "0.5rem 0" }}>
              <span className={"service-label"}>项目迭代编号</span>&nbsp;&nbsp;
              <span>{curr_iter.sid}</span>
            </div>
            {/*<div style={{ margin: "0.5rem 0" }}>*/}
            {/*  <span className={"service-label"}>项目迭代状态</span>&nbsp;&nbsp;*/}
            {/*  <span>{curr_iter.state}</span>*/}
            {/*</div>*/}
            <div style={{ margin: "0.5rem 0" }}>
              <span className={"service-label"}>项目迭代开始日期</span>
              &nbsp;&nbsp;
              <span>{moment(curr_iter.begin * 1000).format("YYYY-MM-DD")}</span>
            </div>
            <div style={{ margin: "0.5rem 0" }}>
              <span className={"service-label"}>项目迭代结束日期</span>
              &nbsp;&nbsp;
              <span>{moment(curr_iter.end * 1000).format("YYYY-MM-DD")}</span>
            </div>
            <div style={{ margin: "0.5rem 0" }}>
              <span className={"service-label"}>项目迭代负责人</span>
              &nbsp;&nbsp;
              <div
                style={{
                  display: "inline",
                }}
              >
                {users_charging.length > 0
                  ? users_charging.map((user: any) => (
                      <UIUserCardPreview
                        key={user.id}
                        projectStore={projectStore}
                        userId={user.id}
                        previewSize={24}
                      />
                      // <span key={user.id}>{user.name}&nbsp;&nbsp;</span>
                    ))
                  : "未指定负责人"}
              </div>
            </div>
          </div>

          <div
            className={"SR-related"}
            style={{
              width: "100%",
              margin: "1rem auto",
            }}
          >
            <Tabs defaultActiveKey="4" centered>
              <Tabs.TabPane tab="未开始" key="1">
                <div
                  style={{
                    display: "flex",
                    margin: "1rem auto",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-evenly",
                    width: "95%",
                  }}
                >
                  {currSR.TODO.length <= 0 ? (
                    <Empty description={"暂无未开始的需求"} />
                  ) : (
                    currSR.TODO.map((sr: any) => (
                      <SRCard
                        id={sr.id}
                        project={sr.project}
                        title={sr.title}
                        description={sr.description}
                        priority={sr.priority}
                        currState={sr.state}
                        createdAt={sr.createdAt}
                        createdBy={sr.createdBy}
                        iter={[curr_iter]}
                        chargedBy={
                          SR2ChargedUser(sr.id, userSRStore, projectStore)[0]
                            ?.id
                        }
                        service={SR2Service(
                          sr.id,
                          SRServiceStore,
                          serviceStore
                        )}
                      />
                    ))
                  )}
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane tab="开发中" key="2">
                <div
                  style={{
                    display: "flex",
                    margin: "1rem auto",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-evenly",
                    width: "95%",
                  }}
                >
                  {currSR.WIP.length <= 0 ? (
                    <Empty description={"暂无开发中的需求"} />
                  ) : (
                    currSR.WIP.map((sr: any) => (
                      <SRCard
                        id={sr.id}
                        project={sr.project}
                        title={sr.title}
                        description={sr.description}
                        priority={sr.priority}
                        currState={sr.state}
                        createdAt={sr.createdAt}
                        createdBy={sr.createdBy}
                        iter={[curr_iter]}
                        chargedBy={
                          SR2ChargedUser(sr.id, userSRStore, projectStore)[0]
                            ?.id
                        }
                        service={SR2Service(
                          sr.id,
                          SRServiceStore,
                          serviceStore
                        )}
                      />
                    ))
                  )}
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane tab="测试中" key="3">
                <div
                  style={{
                    display: "flex",
                    margin: "1rem auto",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-evenly",
                    width: "95%",
                  }}
                >
                  {currSR.Reviewing.length <= 0 ? (
                    <Empty description={"暂无测试中的需求"} />
                  ) : (
                    currSR.Reviewing.map((sr: any) => (
                      <SRCard
                        id={sr.id}
                        project={sr.project}
                        title={sr.title}
                        description={sr.description}
                        priority={sr.priority}
                        currState={sr.state}
                        createdAt={sr.createdAt}
                        createdBy={sr.createdBy}
                        iter={[curr_iter]}
                        chargedBy={
                          SR2ChargedUser(sr.id, userSRStore, projectStore)[0]
                            ?.id
                        }
                        service={SR2Service(
                          sr.id,
                          SRServiceStore,
                          serviceStore
                        )}
                      />
                    ))
                  )}
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane tab="已交付" key="4">
                <div
                  style={{
                    display: "flex",
                    margin: "1rem auto",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-evenly",
                    width: "95%",
                  }}
                >
                  {currSR.Done.length <= 0 ? (
                    <Empty description={"暂无已交付的需求"} />
                  ) : (
                    currSR.Done.map((sr: any) => (
                      <SRCard
                        id={sr.id}
                        project={sr.project}
                        title={sr.title}
                        description={sr.description}
                        priority={sr.priority}
                        currState={sr.state}
                        createdAt={sr.createdAt}
                        createdBy={sr.createdBy}
                        iter={[curr_iter]}
                        chargedBy={
                          SR2ChargedUser(sr.id, userSRStore, projectStore)[0]
                            ?.id
                        }
                        service={SR2Service(
                          sr.id,
                          SRServiceStore,
                          serviceStore
                        )}
                      />
                    ))
                  )}
                </div>
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
      )}

      {/*<div className={"project-iteration-map-container"}>*/}
      {/*  {iteration_show_length === 1 ? (*/}
      {/*    <Empty description={"请创建项目迭代"} />*/}
      {/*  ) : (*/}
      {/*    <div*/}
      {/*      className={"iteration-table"}*/}
      {/*      style={{*/}
      {/*        width:*/}
      {/*          iteration_show_length * window.innerWidth * 0.05 <*/}
      {/*          window.innerWidth * 0.7*/}
      {/*            ? window.innerWidth * 0.7*/}
      {/*            : iteration_show_length * window.innerWidth * 0.05,*/}
      {/*      }}*/}
      {/*    >*/}
      {/*      <div style={{ display: "flex" }}>*/}
      {/*        /!* IR List *!/*/}
      {/*        <div className={"iteration-table-side"}>*/}
      {/*          <div*/}
      {/*            className={"iteration-table-iter-cell"}*/}
      {/*            style={{ backgroundColor: "#66cfcf" }}*/}
      {/*          >*/}
      {/*            &nbsp;*/}
      {/*          </div>*/}
      {/*          {JSON.parse(IRStore).data.map((ir: IRCardProps) => {*/}
      {/*            return (*/}
      {/*              <div key={ir.id}>*/}
      {/*                <div*/}
      {/*                  className={"iteration-table-ir-cell"}*/}
      {/*                  onClick={() => {*/}
      {/*                    const det = JSON.parse(detail);*/}
      {/*                    if (det.includes(ir.id)) {*/}
      {/*                      setDetail(JSON.stringify(without(det, ir.id)));*/}
      {/*                    } else {*/}
      {/*                      det.push(ir.id);*/}
      {/*                      setDetail(JSON.stringify(det));*/}
      {/*                    }*/}
      {/*                  }}*/}
      {/*                  style={{*/}
      {/*                    cursor: "pointer",*/}
      {/*                    fontWeight: "bold",*/}
      {/*                    display: "flex",*/}
      {/*                    flexDirection: "row",*/}
      {/*                    justifyContent: "start",*/}
      {/*                  }}*/}
      {/*                  key={ir.id}*/}
      {/*                >*/}
      {/*                  <span*/}
      {/*                    id={`iteration-table-ir-control-${ir.id}`}*/}
      {/*                    style={{ display: "inline-block" }}*/}
      {/*                  >*/}
      {/*                    　　{JSON.parse(detail).includes(ir.id) ? "-" : "+"}*/}
      {/*                  </span>*/}
      {/*                  <span*/}
      {/*                    style={{*/}
      {/*                      whiteSpace: "nowrap",*/}
      {/*                      overflow: "hidden",*/}
      {/*                      textOverflow: "ellipsis",*/}
      {/*                      display: "inline-block",*/}
      {/*                    }}*/}
      {/*                  >*/}
      {/*                    　{ir.title}*/}
      {/*                  </span>*/}
      {/*                </div>*/}
      {/*                {oneIR2AllSR(ir.id, IRSRAssociation, SRStore).map(*/}
      {/*                  (sr: SRCardProps) => (*/}
      {/*                    <div*/}
      {/*                      key={sr.id}*/}
      {/*                      className={`iteration-table-sr-cell iteration-table-ir-${ir.id}`}*/}
      {/*                      style={{*/}
      {/*                        height: JSON.parse(detail).includes(ir.id)*/}
      {/*                          ? "2.0rem"*/}
      {/*                          : "0",*/}
      {/*                        padding: JSON.parse(detail).includes(ir.id)*/}
      {/*                          ? "0.4rem"*/}
      {/*                          : "0",*/}
      {/*                      }}*/}
      {/*                    >*/}
      {/*                      {sr.title}*/}
      {/*                    </div>*/}
      {/*                  )*/}
      {/*                )}*/}
      {/*              </div>*/}
      {/*            );*/}
      {/*          })}*/}
      {/*        </div>*/}
      {/*        /!*Head*!/*/}
      {/*        <div className={"iteration-table-header"}>*/}
      {/*          <div className={"iteration-table-iters"}>*/}
      {/*            {JSON.parse(iterationStore)*/}
      {/*              .data.sort((a: Iteration, b: Iteration) => a.sid - b.sid)*/}
      {/*              .map((data: Iteration) => (*/}
      {/*                <div*/}
      {/*                  key={data.id}*/}
      {/*                  className={"iteration-table-iter-cell"}*/}
      {/*                  style={{*/}
      {/*                    backgroundColor: "#66cfcf",*/}
      {/*                    fontWeight: "bold",*/}
      {/*                  }}*/}
      {/*                >*/}
      {/*                  {data.title}*/}
      {/*                </div>*/}
      {/*              ))}*/}
      {/*          </div>*/}
      {/*          <div className={"iteration-table-units"}>*/}
      {/*            {JSON.parse(iterationStore)*/}
      {/*              .data.sort((a: Iteration, b: Iteration) => a.sid - b.sid)*/}
      {/*              .map((data: Iteration) => (*/}
      {/*                <div key={data.id}>*/}
      {/*                  {JSON.parse(IRStore).data.map((ir: IRCardProps) => {*/}
      {/*                    return (*/}
      {/*                      <div key={ir.id}>*/}
      {/*                        <div*/}
      {/*                          className={*/}
      {/*                            "iteration-table-ir-cell-unit " +*/}
      {/*                            getIRBlockClassName(ir.id, data.id as number)*/}
      {/*                          }*/}
      {/*                          style={{ fontWeight: "bold" }}*/}
      {/*                        >*/}
      {/*                          {getIRIterPercentage(ir.id, data.id as number)}*/}
      {/*                          &nbsp;*/}
      {/*                        </div>*/}
      {/*                        {oneIR2AllSR(ir.id, IRSRAssociation, SRStore).map(*/}
      {/*                          (sr: SRCardProps) => (*/}
      {/*                            <div*/}
      {/*                              key={sr.id}*/}
      {/*                              style={{*/}
      {/*                                height: JSON.parse(detail).includes(ir.id)*/}
      {/*                                  ? "2.0rem"*/}
      {/*                                  : "0",*/}
      {/*                                padding: JSON.parse(detail).includes(*/}
      {/*                                  ir.id*/}
      {/*                                )*/}
      {/*                                  ? "0.4rem"*/}
      {/*                                  : "0",*/}
      {/*                              }}*/}
      {/*                              className={*/}
      {/*                                "iteration-table-sr-cell-unit " +*/}
      {/*                                getBlockClassName(sr.id, data.id)*/}
      {/*                              }*/}
      {/*                            >*/}
      {/*                              {getSRState(sr, data.id)}*/}
      {/*                            </div>*/}
      {/*                          )*/}
      {/*                        )}*/}
      {/*                      </div>*/}
      {/*                    );*/}
      {/*                  })}*/}
      {/*                </div>*/}
      {/*              ))}*/}
      {/*          </div>*/}
      {/*        </div>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  )}*/}
      {/*</div>*/}
    </div>
  );
};

export default UIIteration;
