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
  console.log(SRListData);
  return SRListData.map((value: any) => {
    return {
      id: value.id,
      project: value.project,
      title: value.title,
      description: value.description,
      priority: value.priority,
      currState: value.state,
      createdBy: value.createdBy,
      createdAt: value.createdAt * 1000,
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

const wipSR = (SRListInfo: string, userId: string) => {
  const SRListData = JSON.parse(SRListInfo);
  return SRListData.filter((obj: any) => obj.state === "WIP");
};

const reviewSR = (SRListInfo: string, userId: string) => {
  const SRListData = JSON.parse(SRListInfo);
  return SRListData.filter((obj: any) => obj.state === "Reviewing");
};

const doneSR = (SRListInfo: string, userId: string) => {
  const SRListData = JSON.parse(SRListInfo).data;
  return SRListData.filter((obj: any) => obj.state === "Done");
};

export { todoSR, wipSR, reviewSR, doneSR };
