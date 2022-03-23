import { createSlice } from "@reduxjs/toolkit";
import { SRCard } from "../ConfigureStore";

export const rmsSlice = createSlice({
  name: "rms",
  initialState: {
    // IRList: Array<IRCard>(), // add IRCard Components
    SRList: Array<SRCard>(),
  },
  reducers: {
    // 增删性能待调整，是否允许换位显示？
    // 增加 IR 需求 ( payload 为 IR 详细信息)
    // addIR: (state, action) => {
    //   state.IRList.push(action.payload);
    // },
    // 删除 IR 需求
    // deleteIR: (state, action) => {
    //   state.IRList.filter(item => item.props.)
    // },
    // 增加 SR 需求 ( payload 为 SR 详细信息)
    addSR: (state, action) => {
      state.SRList.push(action.payload);
    },
    // 删除 SR 需求 ( payload 为待删除 SR 的 id)
    deleteSR: (state, action) => {
      state.SRList.filter((item) => item.id !== action.payload);
    },
  },
});

export const { addSR, deleteSR } = rmsSlice.actions;

export const getSRList = (state: any) => {
  return state.rms.SRList;
};

export const getSR = (id: number) => (state: any) => {
  return state.rms.SRList[id];
};

// export const getIRList = (state: any) => {
//   return state.IRList;
// };

export default rmsSlice.reducer;
