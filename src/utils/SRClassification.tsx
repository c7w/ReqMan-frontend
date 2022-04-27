const todoSR = (SRListInfo: string, userId: string) => {
  const SRListData = JSON.parse(SRListInfo).data;
  return SRListData.filter(
    (obj: any) => obj.state === "TODO" && obj.createdBy === userId
  );
};

const wipSR = (SRListInfo: string, userId: string) => {
  const SRListData = JSON.parse(SRListInfo).data;
  return SRListData.filter(
    (obj: any) => obj.state === "WIP" && obj.createdBy === userId
  );
};

const reviewSR = (SRListInfo: string, userId: string) => {
  const SRListData = JSON.parse(SRListInfo).data;
  return SRListData.filter(
    (obj: any) => obj.state === "Reviewing" && obj.createdBy === userId
  );
};

const doneSR = (SRListInfo: string, userId: string) => {
  const SRListData = JSON.parse(SRListInfo).data;
  return SRListData.filter((obj: any) => obj.state === "Done");
};

export { todoSR, wipSR, reviewSR, doneSR };
