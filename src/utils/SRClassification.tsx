import { SR2ChargedUser, SR2Iteration, SR2Service } from "./Association";

const todoSR = (
  SRListInfo: string,
  iterSRAssoStore: string,
  iterationStore: string,
  userSRStore: string,
  projectInfo: string,
  SRServiceStore: string,
  serviceStore: string
) => {
  const SRListData = JSON.parse(SRListInfo).filter(
    (obj: any) => obj.state === "TODO"
  );
  return expandSRList(
    JSON.stringify(SRListData),
    iterSRAssoStore,
    iterationStore,
    userSRStore,
    projectInfo,
    SRServiceStore,
    serviceStore
  );
};

const wipSR = (
  SRListInfo: string,
  iterSRAssoStore: string,
  iterationStore: string,
  userSRStore: string,
  projectInfo: string,
  SRServiceStore: string,
  serviceStore: string
) => {
  const SRListData = JSON.parse(SRListInfo).filter(
    (obj: any) => obj.state === "WIP"
  );
  return expandSRList(
    JSON.stringify(SRListData),
    iterSRAssoStore,
    iterationStore,
    userSRStore,
    projectInfo,
    SRServiceStore,
    serviceStore
  );
};

const reviewSR = (
  SRListInfo: string,
  iterSRAssoStore: string,
  iterationStore: string,
  userSRStore: string,
  projectInfo: string,
  SRServiceStore: string,
  serviceStore: string
) => {
  const SRListData = JSON.parse(SRListInfo).filter(
    (obj: any) => obj.state === "Reviewing"
  );
  return expandSRList(
    JSON.stringify(SRListData),
    iterSRAssoStore,
    iterationStore,
    userSRStore,
    projectInfo,
    SRServiceStore,
    serviceStore
  );
};

const doneSR = (
  SRListInfo: string,
  iterSRAssoStore: string,
  iterationStore: string,
  userSRStore: string,
  projectInfo: string,
  SRServiceStore: string,
  serviceStore: string
) => {
  const SRListData = JSON.parse(SRListInfo).filter(
    (obj: any) => obj.state === "Done"
  );
  return expandSRList(
    JSON.stringify(SRListData),
    iterSRAssoStore,
    iterationStore,
    userSRStore,
    projectInfo,
    SRServiceStore,
    serviceStore
  );
};
// 将后端得到的 sr 扩展为前端展示的 SRCardProps 类型
const expandSRList = (
  SRListInfo: string,
  iterSRAssoStore: string,
  iterationStore: string,
  userSRStore: string,
  projectInfo: string,
  SRServiceStore: string,
  serviceStore: string
) => {
  return JSON.parse(SRListInfo).map((value: any) => {
    return {
      id: value.id,
      project: value.project,
      title: value.title,
      description: value.description,
      priority: value.priority,
      currState: value.state,
      createdBy: value.createdBy,
      createdAt: value.createdAt,
      iter: SR2Iteration(value.id, iterSRAssoStore, iterationStore),
      chargedBy:
        SR2ChargedUser(value.id, userSRStore, projectInfo).length > 0
          ? SR2ChargedUser(value.id, userSRStore, projectInfo)[0].id
          : -1,
      service:
        SR2Service(value.id, SRServiceStore, serviceStore).length > 0
          ? SR2Service(value.id, SRServiceStore, serviceStore)[0].id
          : -1,
    };
  });
};

export { todoSR, wipSR, reviewSR, doneSR, expandSRList };
