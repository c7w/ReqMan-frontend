import request_json from "../../utils/Network";
import API from "../../utils/APIList";
import { initIRListStore } from "../slices/IRSRSlice";

const updateIRListInfo = async (dispatcher: any): Promise<void> => {
  const myParams = {
    project: 0,
    type: "ir",
  };
  const IRList_data = await request_json(API.GET_RMS, { getParams: myParams });
  dispatcher(initIRListStore(JSON.stringify(IRList_data)));
};

export { updateIRListInfo };
