import request_json from "../../utils/Network";
import API from "../../utils/APIList";
import { updateIRListStore } from "../slices/IRSRSlice";
import { IRCard } from "../ConfigureStore";
import { updateServiceStore } from "../slices/ServiceSlice";

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

const updateServiceInfo = async (dispatcher: any, project_id: number) => {
  request_json(API.GET_RMS, {
    getParams: { project: project_id, type: "service" },
  }).then((data) => dispatcher(updateServiceStore(JSON.stringify(data))));
};

const doUpdateServiceInfo = async (
  dispatcher: any,
  project_id: number,
  info: any
) => {
  return request_json(API.POST_RMS, {
    body: {
      project: project_id,
      type: "service",
      operation: "update",
      data: {
        id: info.id,
        updateData: {
          title: info.title,
          description: info.description,
        },
      },
    },
  }).then((data) => {
    dispatcher(updateServiceStore(JSON.stringify(data)));
  });
};

export {
  getIRListInfo,
  createIRInfo,
  updateIRInfo,
  deleteIRInfo,
  updateServiceInfo,
};
