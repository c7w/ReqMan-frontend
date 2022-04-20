const todoSR = (SRListInfo: string) => {
  const SRListData = JSON.parse(SRListInfo).data;
  return SRListData.filter((obj: any) => obj.state === "TODO");
};

const wipSR = (SRListInfo: string) => {
  const SRListData = JSON.parse(SRListInfo).data;
  return SRListData.filter((obj: any) => obj.state === "WIP");
};

const reviewSR = (SRListInfo: string) => {
  const SRListData = JSON.parse(SRListInfo).data;
  return SRListData.filter((obj: any) => obj.state === "Reviewing");
};

const doneSR = (SRListInfo: string) => {
  const SRListData = JSON.parse(SRListInfo).data;
  return SRListData.filter((obj: any) => obj.state === "Done");
};

export { todoSR, wipSR, reviewSR, doneSR };
