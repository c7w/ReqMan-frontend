import request_json from "./Network";
import API from "./APIList";
import { updateSRListStore } from "../store/slices/IRSRSlice";

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

// const classifyAllSR = async (
//   dispatcher: any,
//   projectIdList: number[]
// ): Promise<void> => {
//   projectIdList.forEach((id: number) => {
//     const myParams = {
//       project: id,
//       type: "sr",
//     };
//     const SRList_data = await request_json(API.GET_RMS, {
//       getParams: myParams,
//     });
//     // console.log("SRList: " + JSON.stringify(SRList_data));
//     dispatcher(updateSRListStore(JSON.stringify(SRList_data)));
//   });
//   return SRList_data;
// };

export { todoSR, wipSR, reviewSR, doneSR };
