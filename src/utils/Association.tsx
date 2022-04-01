// 传入需要查询的 userId 以及所有的 projectInfo (getProjectStore 而来) 字符串（未解析）
const userId2Name = (userId: number, projectInfo: string) => {
  console.log("===================== userId to name ======================= ");
  const userData = JSON.parse(projectInfo).data.users;
  console.log(userData);
  const name = userData.filter((obj: any) => obj.id === userId);
  return name.length > 0 ? name[0] : "not found";
};
// 传入需要查询的 IR 的 Id，返回其所对应的所有 SR，同时需要传入该项目的 IRSRAssociation (getIRSRStore 而来)（未解析）
// 未排序
const oneIR2AllSR = (IRId: number, IRSRAssociation: string) => {
  console.log("===================== Get SR By IR ======================= ");
  const IRSRData = JSON.parse(IRSRAssociation).data;
  console.log(IRSRData);
  return IRSRData.map((obj: any) => {
    if (obj.IR === IRId) {
      return obj.SR;
    }
  }).filter((obj: any) => obj);
};
// 传入需要查询的 SR 的 Id，返回其所对应的所有 IR，同时需要传入该项目的 IRSRAssociation (getIRSRStore 而来)（未解析）
// 未排序
const oneSR2AllIR = (SRId: number, IRSRAssociation: string) => {
  console.log("===================== Get SR By IR ======================= ");
  const IRSRData = JSON.parse(IRSRAssociation).data;
  console.log(IRSRData);
  return IRSRData.map((obj: any) => {
    if (obj.SR === SRId) {
      return obj.IR;
    }
  }).filter((obj: any) => obj);
};

// 传入需要查询的 IRId，返回其对应的所有迭代，还需传入 IRIteration (getIRIterationStore 而来) 未解析
const IR2Iteration = (IRId: number, IRIterationAsso: string) => {
  console.log("================ Get Iteration By IR ===============");
  const IRItData = JSON.parse(IRIterationAsso).data;
  console.log(IRItData);
  return IRItData.map((obj: any) => {
    if (obj.IR === IRId) {
      return obj.iteration;
    }
  }).filter((obj: any) => obj);
};
// 传入需要查询的 IterationId，返回其对应的所有 IR，还需传入 IRIteration (getIRIterationStore 而来) 未解析
const Iteration2IR = (iterationId: number, IRIterationAsso: string) => {
  console.log("================ Get IR By Iteration ===============");
  const IRItData = JSON.parse(IRIterationAsso).data;
  console.log(IRItData);
  return IRItData.map((obj: any) => {
    if (obj.iteration === iterationId) {
      return obj.IR;
    }
  }).filter((obj: any) => obj);
};

// 传入需要查询的 SRId，返回其对应的所有迭代，还需传入 SRIteration (getSRIterationStore 而来) 未解析
const SR2Iteration = (SRId: number, SRIterationAsso: string) => {
  console.log("================ Get Iteration By SR ===============");
  const SRItData = JSON.parse(SRIterationAsso).data;
  console.log(SRItData);
  return SRItData.map((obj: any) => {
    if (obj.SR === SRId) {
      return obj.iteration;
    }
  }).filter((obj: any) => obj);
};

// 传入需要查询的 IterationId，返回其对应的所有 SR，还需传入 SRIteration (getSRIterationStore 而来) 未解析
const Iteration2SR = (iterationId: number, SRIterationAsso: string) => {
  console.log("================ Get SR By Iteration ===============");
  const SRItData = JSON.parse(SRIterationAsso).data;
  console.log(SRItData);
  return SRItData.map((obj: any) => {
    if (obj.iteration === iterationId) {
      return obj.SR;
    }
  }).filter((obj: any) => obj);
};

export {
  userId2Name,
  oneIR2AllSR,
  oneSR2AllIR,
  IR2Iteration,
  Iteration2IR,
  SR2Iteration,
  Iteration2SR,
};
