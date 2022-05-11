const state2Color = new Map();
const state2ChineseState = new Map();

state2Color.set("TODO", "red");
state2Color.set("WIP", "blue");
state2Color.set("Reviewing", "yellow");
state2Color.set("Done", "orange");
state2ChineseState.set("TODO", "未开始");
state2ChineseState.set("WIP", "开发中");
state2ChineseState.set("Reviewing", "测试中");
state2ChineseState.set("Done", "已交付");

export { state2Color, state2ChineseState };
