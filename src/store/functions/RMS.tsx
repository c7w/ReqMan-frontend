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
  IRCardProps,
  Iteration,
  SRCardProps,
  IRSRAssociation,
  SRIteration,
  UserIteration,
  IRIteration,
  SRService,
  UserSRAssociationProps,
  SRChangelog,
} from "../ConfigureStore";
import {
  updateIRIterationStore,
  updateIterationStore,
  updateSRIterationStore,
  updateUserIterationStore,
} from "../slices/IterationSlice";
import { updateUserSRStore } from "../slices/UserSRSlice";
import { updateSRChangeLogStore } from "../slices/SRChangeLogSlice";

const getIRListInfo = async (
  dispatcher: any,
  project_id: number
): Promise<void> => {
  const myParams = {
    project: project_id,
    type: "ir",
  };
  return request_json(API.GET_RMS, { getParams: myParams }).then(
    (IRList_data) => {
      if (IRList_data.code === 0) {
        dispatcher(updateIRListStore(JSON.stringify(IRList_data)));
      }
      return IRList_data;
    }
  );
};

const createIRInfo = async (
  dispatcher: any,
  project_id: number,
  ir: IRCardProps
): Promise<void> => {
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
    if (data.code === 0) {
      getIRListInfo(dispatcher, project_id);
    }
    return data;
  });
};

const updateIRInfo = async (
  dispatcher: any,
  project_id: number,
  ir: IRCardProps
): Promise<void> => {
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
  return request_json(API.POST_RMS, { body: myBody }).then((data) => {
    if (data.code === 0) {
      getIRListInfo(dispatcher, project_id);
    }
    return data;
  });
};

const deleteIRInfo = async (
  dispatcher: any,
  project_id: number,
  ir: IRCardProps
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
    if (data.code === 0) {
      getIRListInfo(dispatcher, project_id);
    }
    return data;
  });
};

const updateServiceInfo = async (dispatcher: any, project_id: number) => {
  return request_json(API.GET_RMS, {
    getParams: { project: project_id, type: "service" },
  }).then((data) => {
    if (data.code === 0) {
      dispatcher(updateServiceStore(JSON.stringify(data)));
    }
    return data;
  });
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
): Promise<any> => {
  const myParams = {
    project: project_id,
    type: "sr",
  };
  // return request_json(API.GET_RMS, { getParams: myParams }).then(
  //   (SRList_data) => {
  //     if (SRList_data.code === 0) {
  //       dispatcher(updateSRListStore(JSON.stringify(SRList_data)));
  //     }
  //     return SRList_data;
  //   }
  // );
  return new Promise((resolve, reject) => {
    resolve({ code: 0, data: [] });
  });
};

const createSRInfo = async (
  dispatcher: any,
  project_id: number,
  sr: SRCardProps
): Promise<void> => {
  // console.log(sr);
  const myBody = {
    project: sr.project,
    type: "sr",
    operation: "create",
    data: {
      updateData: {
        title: sr.title,
        description: sr.description,
        priority: sr.priority,
        rank: 1,
        state: sr.currState,
      },
    },
  };
  return request_json(API.POST_RMS, { body: myBody }).then((data) => {
    // console.log(data.code);
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
        rank: 1,
        state: sr.currState,
      },
    },
  };
  return request_json(API.POST_RMS, { body: myBody }).then((data) => {
    // console.log(data.code);
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
    // console.log(data.code);
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
  return request_json(API.GET_RMS, { getParams: myParams }).then(
    (Iteration_data) => {
      // console.log(SRList_data.code);
      if (Iteration_data.code === 0) {
        dispatcher(updateIterationStore(JSON.stringify(Iteration_data)));
      }
      return Iteration_data;
    }
  );
};

const createIteration = async (
  dispatcher: any,
  project_id: number,
  iteration: Iteration
): Promise<any> => {
  // console.log(iteration);
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

  return request_json(API.GET_RMS, { getParams: myParams }).then(
    (IRSRAssociation_data) => {
      if (IRSRAssociation_data.code === 0) {
        dispatcher(updateIRSRStore(JSON.stringify(IRSRAssociation_data)));
      }
      return IRSRAssociation_data;
    }
  );
};

const createIRSR = async (
  dispatcher: any,
  project_id: number,
  IRSRAssociation: IRSRAssociation
): Promise<void> => {
  // console.log(IRSRAssociation);
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
    // console.log(data.code);
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
    // console.log(data.code);
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
  return request_json(API.GET_RMS, { getParams: myParams }).then(
    (IRIteration_data) => {
      // console.log(SRList_data.code);
      if (IRIteration_data.code === 0) {
        dispatcher(updateIRIterationStore(JSON.stringify(IRIteration_data)));
      }
      return IRIteration_data;
    }
  );
};

const createIRIteration = async (
  dispatcher: any,
  project_id: number,
  IRIteration: IRIteration
): Promise<void> => {
  // console.log(IRIteration);
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
  return request_json(API.GET_RMS, { getParams: myParams }).then(
    (SRIteration_data) => {
      // console.log(SRList_data.code);
      if (SRIteration_data.code === 0) {
        dispatcher(updateSRIterationStore(JSON.stringify(SRIteration_data)));
      }
      return SRIteration_data;
    }
  );
};

const createSRIteration = async (
  dispatcher: any,
  project_id: number,
  SRIteration: SRIteration
): Promise<void> => {
  // console.log(SRIteration);
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
  request_json(API.POST_RMS, { body: myBody }).then((data) => {
    if (data.code === 0) {
      getSRIterationInfo(dispatcher, project_id);
    }
  });
  // 更新 Iteration 的 store
  // getSRIterationInfo(dispatcher, project_id);
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
  request_json(API.POST_RMS, { body: myBody }).then((data) => {
    if (data.code === 0) {
      getSRIterationInfo(dispatcher, project_id);
    }
  });
  // getSRIterationInfo(dispatcher, project_id);
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
): Promise<any> => {
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
  return request_json(API.POST_RMS, { body: myBody }).then((data) => {
    if (data.code === 0) {
      getUserIterationInfo(dispatcher, project_id);
    }
    return data;
  });
  // 更新 Iteration 的 store
};

const deleteUserIteration = async (
  dispatcher: any,
  project_id: number,
  UserIteration: UserIteration
): Promise<any> => {
  const myBody = {
    project: project_id,
    type: "user-iteration",
    operation: "delete",
    data: {
      iterationId: UserIteration.iterationId,
      userId: UserIteration.userId,
    },
  };
  return request_json(API.POST_RMS, { body: myBody }).then((data) => {
    if (data.code === 0) {
      getUserIterationInfo(dispatcher, project_id);
    }
    return data;
  });
};

const getSRServiceInfo = async (
  dispatcher: any,
  project_id: number
): Promise<void> => {
  const myParams = {
    project: project_id,
    type: "service-sr",
  };
  return request_json(API.GET_RMS, { getParams: myParams }).then(
    (SRService_data) => {
      // console.log(SRList_data.code);
      if (SRService_data.code === 0) {
        dispatcher(updateSRServiceStore(JSON.stringify(SRService_data)));
      }
      return SRService_data;
    }
  );
};

const createSRService = async (
  dispatcher: any,
  project_id: number,
  SRService: SRService
): Promise<void> => {
  // console.log(SRService);
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
  return request_json(API.POST_RMS, { body: myBody }).then((data) => {
    if (data.code === 0) {
      getSRServiceInfo(dispatcher, project_id);
    }
    return data;
  });
};

const deleteSRService = async (
  dispatcher: any,
  project_id: number,
  SRService: SRService
): Promise<any> => {
  const myBody = {
    project: project_id,
    type: "service-sr",
    operation: "delete",
    data: {
      serviceId: SRService.serviceId,
      SRId: SRService.SRId,
    },
  };
  return request_json(API.POST_RMS, { body: myBody }).then((data) => {
    if (data.code === 0) {
      getSRServiceInfo(dispatcher, project_id);
    }
    return data;
  });
};

const getUserSRInfo = async (
  dispatcher: any,
  project_id: number
): Promise<void> => {
  const myParams = {
    project: project_id,
    type: "user-sr",
  };
  return request_json(API.GET_RMS, { getParams: myParams }).then(
    (userSRData) => {
      // console.log(SRList_data.code);
      if (userSRData.code === 0) {
        dispatcher(updateUserSRStore(JSON.stringify(userSRData)));
      }
      return userSRData;
    }
  );
};

const createUserSRInfo = async (
  dispatcher: any,
  project_id: number,
  UserSR: UserSRAssociationProps
): Promise<void> => {
  // console.log(SRService);
  const myBody = {
    project: project_id,
    type: "user-sr",
    operation: "create",
    data: {
      updateData: {
        userId: UserSR.user,
        SRId: UserSR.sr,
      },
    },
  };
  return request_json(API.POST_RMS, { body: myBody }).then((data) => {
    if (data.code === 0) {
      getUserSRInfo(dispatcher, project_id);
    }
    return data;
  });
};

const deleteUserSRInfo = async (
  dispatcher: any,
  project_id: number,
  UserSR: UserSRAssociationProps
): Promise<void> => {
  // console.log(SRService);
  const myBody = {
    project: project_id,
    type: "user-sr",
    operation: "delete",
    data: {
      userId: UserSR.user,
      SRId: UserSR.sr,
    },
  };
  return request_json(API.POST_RMS, { body: myBody }).then((data) => {
    if (data.code === 0) {
      getUserSRInfo(dispatcher, project_id);
    }
    return data;
  });
};

const getSRChangeLogInfo = async (
  dispatcher: any,
  project_id: number,
  SRId: number
): Promise<void> => {
  const myParams = {
    project: project_id,
    SRId: SRId,
    type: "SR_changeLog",
  };
  return request_json(API.GET_RMS, { getParams: myParams }).then(
    (SRChangeLog_data) => {
      // console.log(SRList_data.code);
      if (SRChangeLog_data.code === 0) {
        dispatcher(updateSRChangeLogStore(JSON.stringify(SRChangeLog_data)));
      }
      return SRChangeLog_data;
    }
  );
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
  createUserSRInfo,
  deleteUserSRInfo,
  getUserSRInfo,
  getSRChangeLogInfo,
};
