import request_json from "../../utils/Network";
import API from "../../utils/APIList";
import {
  getServiceStore,
  updateServiceStore,
  updateSRServiceStore,
} from "../slices/ServiceSlice";
import {
  updateIRListStore,
  updateSRListStore,
  updateIRSRStore,
} from "../slices/IRSRSlice";
import {
  IRCard,
  Iteration,
  SRCardProps,
  IRSRAssociation,
  SRIteration,
  UserIteration,
  IRIteration,
  SRService,
} from "../ConfigureStore";
import {
  updateIRIterationStore,
  updateIterationStore,
  updateSRIterationStore,
  updateUserIterationStore,
} from "../slices/IterationSlice";

const getIRListInfo = async (
  dispatcher: any,
  project_id: number
): Promise<void> => {
  const myParams = {
    project: project_id,
    type: "ir",
  };
  console.log(JSON.stringify(myParams));
  const IRList_data = await request_json(API.GET_RMS, { getParams: myParams });
  console.log("IRList: " + JSON.stringify(IRList_data));
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
  return request_json(API.POST_RMS, { body: myBody }).then((data) => {
    console.log(data.code);
    if (data.code === 0) {
      getIRListInfo(dispatcher, project_id);
    }
    return data;
  });
};

const updateIRInfo = async (
  dispatcher: any,
  project_id: number,
  ir: IRCard
): Promise<void> => {
  console.log(ir);
  const myBody = {
    project: ir.project,
    type: "ir",
    operation: "update",
    data: {
      id: ir.id,
      updateData: {
        title: ir.title,
        description: ir.description,
        rank: ir.rank,
      },
    },
  };
  // request_json(API.POST_RMS, { body: myBody });
  // getIRListInfo(dispatcher, project_id);
  // console.log("test: " + JSON.stringify(myBody));
  return request_json(API.POST_RMS, { body: myBody }).then((data) => {
    console.log(data.code);
    if (data.code === 0) {
      getIRListInfo(dispatcher, project_id);
    }
    return data;
  });
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
  return request_json(API.POST_RMS, { body: myBody }).then((data) => {
    console.log(data.code);
    if (data.code === 0) {
      getIRListInfo(dispatcher, project_id);
    }
    return data;
  });
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
    updateServiceInfo(dispatcher, project_id);
    return data;
  });
};

const deleteServiceInfo = async (
  dispatcher: any,
  project_id: number,
  info: any
) => {
  return request_json(API.POST_RMS, {
    body: {
      project: project_id,
      type: "service",
      operation: "delete",
      data: {
        id: info.id,
      },
    },
  }).then((data) => {
    updateServiceInfo(dispatcher, project_id);
    return data;
  });
};

const getSRListInfo = async (
  dispatcher: any,
  project_id: number
): Promise<void> => {
  const myParams = {
    project: project_id,
    type: "sr",
  };
  // const SRList_data = await request_json(API.GET_RMS, { getParams: myParams });
  // // console.log("SRList: " + JSON.stringify(SRList_data));
  // dispatcher(updateSRListStore(JSON.stringify(SRList_data)));
  // return SRList_data;
  return request_json(API.GET_RMS, { getParams: myParams }).then(
    (SRList_data) => {
      console.log(SRList_data.code);
      if (SRList_data.code === 0) {
        dispatcher(updateSRListStore(JSON.stringify(SRList_data)));
      }
      return SRList_data;
    }
  );
};

const createSRInfo = async (
  dispatcher: any,
  project_id: number,
  sr: SRCardProps
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
  return request_json(API.POST_RMS, { body: myBody }).then((data) => {
    console.log(data.code);
    if (data.code === 0) {
      getSRListInfo(dispatcher, project_id);
    }
    return data;
  });
};

const updateSRInfo = async (
  dispatcher: any,
  project_id: number,
  sr: SRCardProps
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
  return request_json(API.POST_RMS, { body: myBody }).then((data) => {
    console.log(data.code);
    if (data.code === 0) {
      getSRListInfo(dispatcher, project_id);
    }
    return data;
  });
};

const deleteSRInfo = async (
  dispatcher: any,
  project_id: number,
  sr: SRCardProps
): Promise<void> => {
  const myBody = {
    project: sr.project,
    type: "sr",
    operation: "delete",
    data: {
      id: sr.id,
    },
  };
  return request_json(API.POST_RMS, { body: myBody }).then((data) => {
    console.log(data.code);
    if (data.code === 0) {
      getSRListInfo(dispatcher, project_id);
    }
    return data;
  });
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
): Promise<any> => {
  console.log(iteration);
  const myBody = {
    project: project_id,
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
  return request_json(API.POST_RMS, { body: myBody }).then((data) => {
    if (data.code === 0) {
      getIterationInfo(dispatcher, project_id);
    }
    return data;
  });
};

const updateIterationInfo = async (
  dispatcher: any,
  project_id: number,
  iteration: Iteration
): Promise<any> => {
  const myBody = {
    project: project_id,
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
  return request_json(API.POST_RMS, { body: myBody }).then((data) => {
    if (data.code === 0) {
      getIterationInfo(dispatcher, project_id);
    }
    return data;
  });
};

const deleteIterationInfo = async (
  dispatcher: any,
  project_id: number,
  iteration: Iteration
): Promise<any> => {
  const myBody = {
    project: project_id,
    type: "iteration",
    operation: "delete",
    data: {
      id: iteration.id,
    },
  };
  return request_json(API.POST_RMS, { body: myBody }).then((data) => {
    if (data.code === 0) {
      getIterationInfo(dispatcher, project_id);
    }
    return data;
  });
};

const getIRSRInfo = async (
  dispatcher: any,
  project_id: number
): Promise<void> => {
  const myParams = {
    project: project_id,
    type: "ir-sr",
  };
  const IRSRAssociation_data = await request_json(API.GET_RMS, {
    getParams: myParams,
  });
  dispatcher(updateIRSRStore(JSON.stringify(IRSRAssociation_data)));
};

const createIRSR = async (
  dispatcher: any,
  project_id: number,
  IRSRAssociation: IRSRAssociation
): Promise<void> => {
  console.log(IRSRAssociation);
  const myBody = {
    project: project_id,
    type: "ir-sr",
    operation: "create",
    data: {
      updateData: {
        IRId: IRSRAssociation.IR,
        SRId: IRSRAssociation.SR,
      },
    },
  };
  return request_json(API.POST_RMS, { body: myBody }).then((data) => {
    console.log(data.code);
    if (data.code === 0) {
      getIRSRInfo(dispatcher, project_id);
    }
    return data;
  });
};

const deleteIRSR = async (
  dispatcher: any,
  project_id: number,
  IRSRAssociation: IRSRAssociation
): Promise<void> => {
  const myBody = {
    project: project_id,
    type: "ir-sr",
    operation: "delete",
    data: {
      IRId: IRSRAssociation.IR,
      SRId: IRSRAssociation.SR,
    },
  };
  return request_json(API.POST_RMS, { body: myBody }).then((data) => {
    console.log(data.code);
    if (data.code === 0) {
      getIRSRInfo(dispatcher, project_id);
    }
    return data;
  });
};

const getIRIterationInfo = async (
  dispatcher: any,
  project_id: number
): Promise<void> => {
  const myParams = {
    project: project_id,
    type: "ir-iteration",
  };
  const IRIteration_data = await request_json(API.GET_RMS, {
    getParams: myParams,
  });
  dispatcher(updateIRIterationStore(JSON.stringify(IRIteration_data)));
};

const createIRIteration = async (
  dispatcher: any,
  project_id: number,
  IRIteration: IRIteration
): Promise<void> => {
  console.log(IRIteration);
  const myBody = {
    project: project_id,
    type: "ir-iteration",
    operation: "create",
    data: {
      updateData: {
        iterationId: IRIteration.iterationId,
        IRId: IRIteration.IRId,
      },
    },
  };
  request_json(API.POST_RMS, { body: myBody });
  // 更新 Iteration 的 store
  getIRIterationInfo(dispatcher, project_id);
};

const deleteIRIteration = async (
  dispatcher: any,
  project_id: number,
  IRIteration: IRIteration
): Promise<void> => {
  const myBody = {
    project: project_id,
    type: "ir-iteration",
    operation: "delete",
    data: {
      iterationId: IRIteration.iterationId,
      IRId: IRIteration.IRId,
    },
  };
  request_json(API.POST_RMS, { body: myBody });
  getIRIterationInfo(dispatcher, project_id);
};

const getSRIterationInfo = async (
  dispatcher: any,
  project_id: number
): Promise<void> => {
  const myParams = {
    project: project_id,
    type: "sr-iteration",
  };
  const SRIteration_data = await request_json(API.GET_RMS, {
    getParams: myParams,
  });
  dispatcher(updateSRIterationStore(JSON.stringify(SRIteration_data)));
};

const createSRIteration = async (
  dispatcher: any,
  project_id: number,
  SRIteration: SRIteration
): Promise<void> => {
  console.log(SRIteration);
  const myBody = {
    project: project_id,
    type: "sr-iteration",
    operation: "create",
    data: {
      updateData: {
        iterationId: SRIteration.iterationId,
        SRId: SRIteration.SRId,
      },
    },
  };
  request_json(API.POST_RMS, { body: myBody });
  // 更新 Iteration 的 store
  getSRIterationInfo(dispatcher, project_id);
};

const deleteSRIteration = async (
  dispatcher: any,
  project_id: number,
  SRIteration: SRIteration
): Promise<void> => {
  const myBody = {
    project: project_id,
    type: "sr-iteration",
    operation: "delete",
    data: {
      iterationId: SRIteration.iterationId,
      SRId: SRIteration.SRId,
    },
  };
  request_json(API.POST_RMS, { body: myBody });
  getSRIterationInfo(dispatcher, project_id);
};

const getUserIterationInfo = async (
  dispatcher: any,
  project_id: number
): Promise<void> => {
  const myParams = {
    project: project_id,
    type: "user-iteration",
  };
  const UserIteration_data = await request_json(API.GET_RMS, {
    getParams: myParams,
  });
  dispatcher(updateUserIterationStore(JSON.stringify(UserIteration_data)));
};

const createUserIteration = async (
  dispatcher: any,
  project_id: number,
  UserIteration: UserIteration
): Promise<void> => {
  console.log(UserIteration);
  const myBody = {
    project: project_id,
    type: "user-iteration",
    operation: "create",
    data: {
      updateData: {
        iterationId: UserIteration.iterationId,
        userId: UserIteration.userId,
      },
    },
  };
  request_json(API.POST_RMS, { body: myBody });
  // 更新 Iteration 的 store
  getUserIterationInfo(dispatcher, project_id);
};

const deleteUserIteration = async (
  dispatcher: any,
  project_id: number,
  UserIteration: UserIteration
): Promise<void> => {
  const myBody = {
    project: project_id,
    type: "user-iteration",
    operation: "delete",
    data: {
      iterationId: UserIteration.iterationId,
      userId: UserIteration.userId,
    },
  };
  request_json(API.POST_RMS, { body: myBody });
  getUserIterationInfo(dispatcher, project_id);
};

const getSRServiceInfo = async (
  dispatcher: any,
  project_id: number
): Promise<void> => {
  const myParams = {
    project: project_id,
    type: "service-sr",
  };
  const SRService_data = await request_json(API.GET_RMS, {
    getParams: myParams,
  });
  dispatcher(updateSRServiceStore(JSON.stringify(SRService_data)));
};

const createSRService = async (
  dispatcher: any,
  project_id: number,
  SRService: SRService
): Promise<void> => {
  console.log(SRService);
  const myBody = {
    project: project_id,
    type: "service-sr",
    operation: "create",
    data: {
      updateData: {
        serviceId: SRService.serviceId,
        SRId: SRService.SRId,
      },
    },
  };
  request_json(API.POST_RMS, { body: myBody });
  // 更新 Iteration 的 store
  getSRServiceInfo(dispatcher, project_id);
};

const deleteSRService = async (
  dispatcher: any,
  project_id: number,
  SRService: SRService
): Promise<void> => {
  const myBody = {
    project: project_id,
    type: "service-sr",
    operation: "delete",
    data: {
      serviceId: SRService.serviceId,
      SRId: SRService.SRId,
    },
  };
  request_json(API.POST_RMS, { body: myBody });
  getSRServiceInfo(dispatcher, project_id);
};

export {
  getIRListInfo,
  createIRInfo,
  updateIRInfo,
  deleteIRInfo,
  updateServiceInfo,
  doUpdateServiceInfo,
  deleteServiceInfo,
  getSRListInfo,
  createSRInfo,
  updateSRInfo,
  deleteSRInfo,
  getIRSRInfo,
  createIRSR,
  deleteIRSR,
  getIterationInfo,
  createIteration,
  updateIterationInfo,
  deleteIterationInfo,
  getUserIterationInfo,
  createUserIteration,
  deleteUserIteration,
  getIRIterationInfo,
  createIRIteration,
  deleteIRIteration,
  getSRIterationInfo,
  createSRIteration,
  deleteSRIteration,
  getSRServiceInfo,
  createSRService,
  deleteSRService,
};
