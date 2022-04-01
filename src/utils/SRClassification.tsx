const todoSR = (SRListInfo: string) => {
  console.log(" ====================== to do SR ======================== ");
  const SRListData = JSON.parse(SRListInfo).data;
  console.log(SRListData);
  return SRListData.filter((obj: any) => obj.state === "TODO");
};

const wipSR = (SRListInfo: string) => {
  console.log(" ====================== wip SR ======================== ");
  const SRListData = JSON.parse(SRListInfo).data;
  console.log(SRListData);
  return SRListData.filter((obj: any) => obj.state === "WIP");
};

const reviewSR = (SRListInfo: string) => {
  console.log(" ====================== reviewing SR ======================== ");
  const SRListData = JSON.parse(SRListInfo).data;
  console.log(SRListData);
  return SRListData.filter((obj: any) => obj.state === "Reviewing");
};

const doneSR = (SRListInfo: string) => {
  console.log(" ====================== done SR ======================== ");
  const SRListData = JSON.parse(SRListInfo).data;
  console.log(SRListData);
  return SRListData.filter((obj: any) => obj.state === "Done");
};

export { todoSR, wipSR, reviewSR, doneSR };
