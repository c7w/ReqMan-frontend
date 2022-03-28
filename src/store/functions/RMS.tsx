import request_json from "../../utils/Network";
import API from "../../utils/APIList";
import { updateIRListStore } from "../slices/rmsSlice";

const updateIRListInfo = async (
  dispatcher: any,
  project_id: number
): Promise<void> => {
  const myParams = {
    project: project_id,
    type: "ir",
  };
  const IRList_data = await request_json(API.GET_RMS, { getParams: myParams });
  dispatcher(updateIRListStore(JSON.stringify(IRList_data)));
};

export { updateIRListInfo };
