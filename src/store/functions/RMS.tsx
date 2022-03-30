import request_json from "../../utils/Network";
import API from "../../utils/APIList";
import { updateIRListStore, updateSRListStore } from "../slices/IRSRSlice";
import { IRCard, Iteration, SRCard } from "../ConfigureStore";
import { updateIterationStore } from "../slices/IterationSlice";

const getIRListInfo = async (
  dispatcher: any,
  project_id: number
): Promise<void> => {
  const myParams = {
    project: project_id,
    type: "ir",
  };
  const IRList_data = await request_json(API.GET_RMS, { getParams: myParams });
  // console.log("IRList: " + JSON.stringify(IRList_data));
  dispatcher(updateIRListStore(JSON.stringify(IRList_data)));
};

const createIRInfo = async (
  dispatcher: any,
  project_id: number,
  ir: IRCard
): Promise<void> => {
  console.log(ir);
  const myBody = {
    project: ir.project,
    type: "ir",
    operation: "create",
    data: {
      updateData: {
        title: ir.title,
        description: ir.description,
        rank: ir.rank,
      },
    },
  };
  request_json(API.POST_RMS, { body: myBody });
  getIRListInfo(dispatcher, project_id);
};

const updateIRInfo = async (
  dispatcher: any,
  project_id: number,
  ir: IRCard
): Promise<void> => {
  const myBody = {
    project: ir.project,
    type: "ir",
    operation: "update",
    data: {
      updateData: {
        title: ir.title,
        description: ir.description,
        rank: ir.rank,
      },
    },
  };
  request_json(API.POST_RMS, { body: myBody });
  getIRListInfo(dispatcher, project_id);
};

const deleteIRInfo = async (
  dispatcher: any,
  project_id: number,
  ir: IRCard
): Promise<void> => {
  const myBody = {
    project: ir.project,
    type: "ir",
    operation: "delete",
    data: {
      id: ir.id,
    },
  };
  request_json(API.POST_RMS, { body: myBody });
  getIRListInfo(dispatcher, project_id);
};

const getSRListInfo = async (
  dispatcher: any,
  project_id: number
): Promise<void> => {
  const myParams = {
    project: project_id,
    type: "sr",
  };
  const SRList_data = await request_json(API.GET_RMS, { getParams: myParams });
  // console.log("IRList: " + JSON.stringify(IRList_data));
  dispatcher(updateSRListStore(JSON.stringify(SRList_data)));
};

const createSRInfo = async (
  dispatcher: any,
  project_id: number,
  sr: SRCard
): Promise<void> => {
  console.log(sr);
  const myBody = {
    project: sr.project,
    type: "sr",
    operation: "create",
    data: {
      updateData: {
        title: sr.title,
        description: sr.description,
        priority: sr.priority,
        rank: sr.rank,
        state: sr.currState, // "TODO" "WIP" "Reviewing" "Done" 四选一
      },
    },
  };
  request_json(API.POST_RMS, { body: myBody });
  // 更新 SR 的 store
  getSRListInfo(dispatcher, project_id);
};

const updateSRInfo = async (
  dispatcher: any,
  project_id: number,
  sr: SRCard
): Promise<void> => {
  const myBody = {
    project: sr.project,
    type: "sr",
    operation: "update",
    data: {
      id: sr.id,
      updateData: {
        title: sr.title,
        description: sr.description,
        priority: sr.priority,
        rank: sr.rank,
        state: sr.currState, // "TODO" "WIP" "Reviewing" "Done" 四选一
      },
    },
  };
  request_json(API.POST_RMS, { body: myBody });
  getSRListInfo(dispatcher, project_id);
};

const deleteSRInfo = async (
  dispatcher: any,
  project_id: number,
  sr: SRCard
): Promise<void> => {
  const myBody = {
    project: sr.project,
    type: "sr",
    operation: "delete",
    data: {
      id: sr.id,
    },
  };
  request_json(API.POST_RMS, { body: myBody });
  getSRListInfo(dispatcher, project_id);
};

const getIterationInfo = async (
  dispatcher: any,
  project_id: number
): Promise<void> => {
  const myParams = {
    project: project_id,
    type: "iteration",
  };
  const Iteration_data = await request_json(API.GET_RMS, {
    getParams: myParams,
  });
  dispatcher(updateIterationStore(JSON.stringify(Iteration_data)));
};

const createIteration = async (
  dispatcher: any,
  project_id: number,
  iteration: Iteration
): Promise<void> => {
  console.log(iteration);
  const myBody = {
    project: iteration.project,
    type: "iteration",
    operation: "create",
    data: {
      updateData: {
        title: iteration.title,
        sid: iteration.sid,
        begin: iteration.begin,
        end: iteration.end,
      },
    },
  };
  request_json(API.POST_RMS, { body: myBody });
  // 更新 Iteration 的 store
  getIterationInfo(dispatcher, project_id);
};

const updateIterationInfo = async (
  dispatcher: any,
  project_id: number,
  iteration: Iteration
): Promise<void> => {
  const myBody = {
    project: iteration.project,
    type: "iteration",
    operation: "update",
    data: {
      id: iteration.id,
      updateData: {
        title: iteration.title,
        sid: iteration.sid,
        begin: iteration.begin,
        end: iteration.end,
      },
    },
  };
  request_json(API.POST_RMS, { body: myBody });
  getIterationInfo(dispatcher, project_id);
};

const deleteIterationInfo = async (
  dispatcher: any,
  project_id: number,
  iteration: Iteration
): Promise<void> => {
  const myBody = {
    project: iteration.project,
    type: "iteration",
    operation: "delete",
    data: {
      id: iteration.id,
    },
  };
  request_json(API.POST_RMS, { body: myBody });
  getIterationInfo(dispatcher, project_id);
};

export {
  getIRListInfo,
  createIRInfo,
  updateIRInfo,
  deleteIRInfo,
  getSRListInfo,
  createSRInfo,
  updateSRInfo,
  deleteSRInfo,
  getIterationInfo,
  createIteration,
  updateIterationInfo,
  deleteIterationInfo,
};
