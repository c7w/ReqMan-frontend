import { createSlice } from "@reduxjs/toolkit";
import { IRCard, SRCard } from "../ConfigureStore";

export const IRSRSlice = createSlice({
  name: "ir_sr_slice",
  initialState: {
    IRList: Array<IRCard>(), // add IRCard Components
    SRList: Array<SRCard>(),
  },
  reducers: {
    // 增删性能待调整，是否允许换位显示？
    // 增加 IR 需求 ( payload 为 IR 详细信息)
    addIRStore: (state, action) => {
      state.IRList = action.payload;
    },
    updateIRStore: (state, action) => {
      state.IRList = action.payload;
    },
    // 删除 IR 需求
    deleteIRStore: (state, action) => {
      state.IRList.filter((item) => item.id !== action.payload);
    },
    // 增加 SR 需求 ( payload 为 SR 详细信息 )
    addSRStore: (state, action) => {
      state.SRList.push(action.payload);
    },
    // 修改 SR 需求 ( payload 为 SR 信息)
    updateSRStore: (state, action) => {
      console.log(
        " ======================= updating ============================" +
          action.payload
      );
    },
    // 删除 SR 需求 ( payload 为待删除 SR 的 id )
    deleteSRStore: (state, action) => {
      state.SRList.filter((item) => item.id !== action.payload);
    },
    // 初始化 IRList
    initIRListStore: (state, action) => {
      console.log(" ================== init IR ing ===================");
      console.log(action.payload);
    },
    // 初始化 SRList
    initSRListStore: (state, action) => {
      console.log(action.payload);
    },
  },
});

export const {
  addIRStore,
  updateIRStore,
  deleteIRStore,
  addSRStore,
  updateSRStore,
  deleteSRStore,
  initIRListStore,
  initSRListStore,
} = IRSRSlice.actions;

export const getIRListStore = (state: {
  ir_sr_slice: { IRList: Array<IRCard> };
}) => {
  return state.ir_sr_slice.IRList;
};

export const getSRListStore = (state: {
  ir_sr_slice: { SRList: Array<SRCard> };
}) => {
  return state.ir_sr_slice.SRList;
};

// test SR
export const getSR =
  (id: number) => (state: { rms: { SRList: Array<SRCard> } }) => {
    // test
    return {
      id: 0, // id
      project: "test", // the project belongs to
      title: "SR.002.103", // title
      description:
        " hbx is working hard ! hbx is working hard ! hbx is working hard ! hbx is working hard ! hbx is working hard ! hbx is working hard ! hbx is working hard ! hbx is working hard ! hbx is working hard ! hbx is working hard ! hbx is working hard ! hbx is working hard ! hbx is working hard ! hbx is working hard ! hbx is working hard ! hbx is working hard ! hbx is working hard ! hbx is working hard !", // description
      priority: 0, // the priority which indicates the importance of the SR
      currState: "TODO", // "TODO", "WIP", "Reviewing", "Done"
      createdBy: "hbx", // somebody
      createdAt: new Date().getDate(), // sometime
      disabled: false,
    };
    // return state.rms.SRList[id];
  };

export default IRSRSlice.reducer;
