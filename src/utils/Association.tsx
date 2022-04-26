import { SRCardProps, UserSRAssociationProps } from "../store/ConfigureStore";
import { indexOf } from "underscore";

// 传入需要查询的 userId 以及所有的 projectInfo (getProjectStore 而来) 字符串（未解析）
const userId2UserInfo = (userId: number, projectInfo: string) => {
  // console.log("===================== userId to name ======================= ");
  const userData = JSON.parse(projectInfo).data.users;
  // console.log(userData);
  const user = userData.filter((obj: any) => obj.id === userId);
  return user.length > 0 ? user[0] : "not found";
};
// 传入 SR 的 Id，返回其详细信息，同时需要传入该项目的 SRList (getSRListStore 而来) （未解析）
const SRId2SRInfo = (SRId: number, SRList: string) => {
  // console.log("===================== Get SRInfo By SRId ==================== ");
  const SRListData = JSON.parse(SRList).data;
  const SR = SRListData.filter((obj: any) => obj.id === SRId);
  return SR.length > 0 ? SR[0] : "not found";
};
// 传入 IR 的 Id，返回其详细信息，同时需要传入该项目的 IRList (getIRListStore 而来) （未解析）
const IRId2IRInfo = (IRId: number, IRList: string) => {
  // console.log("===================== Get IRInfo By IRId ==================== ");
  const IRListData = JSON.parse(IRList).data;
  const IR = IRListData.filter((obj: any) => obj.id === IRId);
  return IR.length > 0 ? IR[0] : "not found";
};
// 传入 MR 的 Id，返回其详细信息，同时需要传入该项目的 MRList (getMRStore 而来) （未解析）
const MRId2MRInfo = (MRId: number, MRList: string) => {
  // console.log("==================== Get MRInfo By MRId ===================");
  const MRListData = JSON.parse(MRList).data;
  const MR = MRListData.filter((obj: any) => obj.id === MRId);
  return MR.length > 0 ? MR[0] : "not found";
};
// 传入 Issue 的 Id，返回其详细信息，同时需要传入该项目的 issueList (getIssueStore 而来) （未解析）
const issueId2IssueInfo = (issueId: number, issueList: string) => {
  // console.log("==================== Get issueInfo By IssueId ===================");
  const issueListData = JSON.parse(issueList).data;
  const issue = issueListData.filter((obj: any) => obj.id === issueId);
  return issue.length > 0 ? issue[0] : "not found";
};
// 传入 commit 的 Id，返回其详细信息，同时需要传入该项目的 commitList (getCommitStore 而来) （未解析）
const commitId2CommitInfo = (commitId: number, commitList: string) => {
  // console.log("==================== Get commitInfo By CommitId ===================");
  const commitListData = JSON.parse(commitList).data;
  const commit = commitListData.filter((obj: any) => obj.id === commitId);
  return commit.length > 0 ? commit[0] : "not found";
};
// 传入 iteration 的 Id, 返回其详细信息，同时需要传入该项目的 iterationInfo (getIterationInfo 而来) （未解析）
const itId2ItInfo = (iterationId: number, iterationInfo: string) => {
  // console.log("============ Get iterationInfo By iterationId ============== ");
  const iterationData = JSON.parse(iterationInfo).data;
  const iteration = iterationData.filter((obj: any) => obj.id === iterationId);
  return iteration.length > 0 ? iteration[0] : "not found";
};
// 传入 service 的 Id，返回其详细信息，同时需要传入该项目的 serviceInfo (getServiceStore 而来) （未解析）
const servId2ServInfo = (serviceId: number, serviceInfo: string) => {
  // console.log("============ Get serviceInfo By serviceId ============== ");
  const serviceData = JSON.parse(serviceInfo).data;
  const service = serviceData.filter((obj: any) => obj.id === serviceId);
  return service.length > 0 ? service[0] : "not found";
};
// 传入 project 的 Id，返回其详细信息，同时需传入该项目的 projectInfo (getProjectStore 而来) 字符串（未解析）
const projId2ProjInfo = (projectId: number, projectInfo: string) => {
  console.log("============ Get projectInfo By projectId ============== ");
  console.log(projectInfo);
  return JSON.parse(projectInfo).data.project;
};
// 传入 repo 的 Id，返回其详细信息，同时需传入该项目的 repoInfo (getProjectStore 而来) 字符串（未解析）
const repoId2RepoInfo = (repoId: number, repoInfo: string) => {
  // console.log("============ Get repoInfo By repoId ============== ");
  const repoData = JSON.parse(repoInfo).data;
  const repo = repoData.filter((repo: any) => repo.id === repoId);
  return repo.length > 0 ? repo[0] : "not found";
};
/*
  传入需要查询的 IR 的 Id，返回其所对应的所有 SR
  同时需要传入该项目的 IRSRAssociation (getIRSRStore 而来)（未解析）
  传入该项目的 SRList (getSRListStore 而来)（未解析）
  返回未排序
 */
const oneIR2AllSR = (IRId: number, IRSRAssociation: string, SRList: string) => {
  // console.log("===================== Get SR By IR ======================= ");
  const IRSRData = JSON.parse(IRSRAssociation).data;
  // console.log(IRSRData);
  const matchedSRId = IRSRData.map((obj: any) => {
    if (obj.IR === IRId) {
      return obj.SR;
    }
  }).filter((obj: any) => obj);
  return matchedSRId.map((id: any) => SRId2SRInfo(id, SRList));
};
/*
  传入需要查询的 SR 的 Id，返回其所对应的所有 IR
  同时需要传入该项目的 IRSRAssociation (getIRSRStore 而来)（未解析）
  传入该项目的 IRList (getIRListStore 而来)（未解析）
  返回未排序
 */
const oneSR2AllIR = (SRId: number, IRSRAssociation: string, IRList: string) => {
  // // console.log("===================== Get IR By SR ======================= ");
  const IRSRData = JSON.parse(IRSRAssociation).data;
  // // console.log(IRSRData);
  const matchedIRId = IRSRData.map((obj: any) => {
    if (obj.SR === SRId) {
      return obj.IR;
    }
  }).filter((obj: any) => obj);
  return matchedIRId.map((id: any) => IRId2IRInfo(id, IRList));
};
/*
传入需要查询的 MRId，返回其对应的 SR(unique)
还需传入 MRSRAsso (getMRSRAssociationStore 而来) 未解析
同时需要传入该项目的 SRList ( getSRListStore 而来) （未解析）
返回未排序
 */
const MR2SR = (MRId: number, MRSRAsso: string, SRList: string) => {
  console.log("================ Get SR By MR ===============");
  const MRSRData = JSON.parse(MRSRAsso).data;
  console.log(MRSRData);
  const matchedSR = MRSRData.filter((obj: any) => obj.MR === MRId);
  if (matchedSR.length > 0) return SRId2SRInfo(matchedSR[0].SR, SRList);
  return {};
};
/*
传入需要查询的 SRId，返回其对应的所有 MR
还需传入 MRSRAsso (getMRSRAssociationStore 而来) 未解析
同时需要传入该项目的 MRList ( getMergeStore 而来) （未解析）
返回未排序
 */
const oneSR2AllMR = (SRId: number, SRMRAsso: string, MRList: string) => {
  // console.log("================ Get MR By SR ===============");
  const SRMRData = JSON.parse(SRMRAsso).data;
  // console.log(SRMRData);
  const matchedMRId = SRMRData.map((obj: any) => {
    if (obj.SR === SRId) {
      return obj.MR;
    }
  }).filter((obj: any) => obj);
  return matchedMRId.map((id: any) => MRId2MRInfo(id, MRList));
};
/*
传入需要查询的 IRId，返回其对应的所有迭代
还需传入 IRIteration (getIRIterationStore 而来) 未解析
同时需要传入该项目的 iterationInfo (getIterationStore 而来) （未解析）
返回未排序
 */
const IR2Iteration = (
  IRId: number,
  IRIterationAsso: string,
  iterationInfo: string
) => {
  // console.log("================ Get Iteration By IR ===============");
  const IRItData = JSON.parse(IRIterationAsso).data;
  // console.log(IRItData);
  const matchedItId = IRItData.map((obj: any) => {
    if (obj.IR === IRId) {
      return obj.iteration;
    }
  }).filter((obj: any) => obj);
  return matchedItId.map((id: any) => itId2ItInfo(id, iterationInfo));
};
/*
  传入需要查询的 IterationId，返回其对应的所有 IR
  还需传入 IRIteration (getIRIterationStore 而来) 未解析
  以及传入该项目的 IRList (getIRListStore 而来)（未解析）
  返回未排序
 */
const Iteration2IR = (
  iterationId: number,
  IRIterationAsso: string,
  IRList: string
) => {
  // console.log("================ Get IR By Iteration ===============");
  const IRItData = JSON.parse(IRIterationAsso).data;
  // console.log(IRItData);
  const matchedIRId = IRItData.map((obj: any) => {
    if (obj.iteration === iterationId) {
      return obj.IR;
    }
  }).filter((obj: any) => obj);
  return matchedIRId.map((id: any) => IRId2IRInfo(id, IRList));
};
/*
  传入需要查询的 SRId，返回其对应的所有迭代
  还需传入 SRIteration (getSRIterationStore 而来) 未解析
  同时需要传入该项目的 iterationInfo (getIterationInfo 而来) （未解析）
  返回未排序
 */
const SR2Iteration = (
  SRId: number,
  SRIterationAsso: string,
  iterationInfo: string
) => {
  // console.log("================ Get Iteration By SR ===============");
  const SRItData = JSON.parse(SRIterationAsso).data;
  // console.log(SRItData);
  const matchedItId = SRItData.map((obj: any) => {
    if (obj.SR === SRId) {
      return obj.iteration;
    }
  }).filter((obj: any) => obj);
  return matchedItId.map((id: any) => itId2ItInfo(id, iterationInfo));
};
/*
传入需要查询的 IterationId，返回其对应的所有 SR
还需传入 SRIteration (getSRIterationStore 而来) 未解析
以及传入该项目的 SRList (getSRListStore 而来)（未解析）
返回未排序
 */
const Iteration2SR = (
  iterationId: number,
  SRIterationAsso: string,
  SRList: string
) => {
  // console.log("================ Get SR By Iteration ===============");
  const SRItData = JSON.parse(SRIterationAsso).data;
  // console.log(SRItData);
  const matchedSRId = SRItData.map((obj: any) => {
    if (obj.iteration === iterationId) {
      return obj.SR;
    }
  }).filter((obj: any) => obj);
  return matchedSRId
    .map((id: any) => SRId2SRInfo(id, SRList))
    .filter((obj: any) => obj !== "not found");
};
/*
传入需要查询的 SRId，返回其对应的缺陷 issue (unique or not exist)
还需传入 SRIssueAsso ( 对每个 repo， getIssueSRAssociationStore 而来，并拼接在一起！) 传入 string
同时需要传入该项目的 issueInfo (getIssueStore 而来) （未解析）
返回未排序
 */
const SR2Issue = (SRId: number, SRIssueAsso: string, issueInfo: string) => {
  // console.log("================ Get Issue By SR ===============");
  const SRIssueData = JSON.parse(SRIssueAsso).data;
  // console.log(SRIssueData);
  return SRIssueData.filter((obj: any) => obj.SR === SRId).map((obj: any) =>
    issueId2IssueInfo(obj.issue, issueInfo)
  );
};
/*
传入需要查询的 SRId，返回其对应的所有提交 commit
还需传入 SRCommitAsso ( 对每个 repo， getCommitSRAssociationStore 而来，并拼接在一起！) 传入 string
同时需要传入该项目的 commitInfo (getCommitStore 而来) （未解析）
返回未排序
 */
const oneSR2AllCommit = (
  SRId: number,
  SRCommitAsso: string,
  commitInfo: string
) => {
  // console.log("================ Get Commit By SR ===============");
  const SRCommitData = JSON.parse(SRCommitAsso).data;
  // console.log(SRCommitData);
  return SRCommitData.filter((obj: any) => obj.SR === SRId).map((obj: any) =>
    commitId2CommitInfo(obj.commit, commitInfo)
  );
};
/*
传入需要查询的 SRId，返回其对应的服务 service(unique)
还需传入 SRService (getServiceStore 而来) 不解析
同时需要传入该项目的 serviceInfo (getServiceStore 而来) （未解析）
返回未排序
// NOTE: 返回是个列表！最多只有一个元素，因为一个 SR 只能属于一个服务
 */
const SR2Service = (
  SRId: number,
  SRServiceAsso: string,
  serviceInfo: string
) => {
  // console.log("================ Get Service By SR ===============");
  const SRServiceData = JSON.parse(SRServiceAsso).data;
  // console.log(SRServiceData);
  const matchedService = SRServiceData.filter((obj: any) => obj.SR === SRId);
  if (matchedService.length > 0)
    return matchedService.map((obj: any) =>
      servId2ServInfo(obj.service, serviceInfo)
    );
  return [];
};
/*
传入需要查询的 serviceId，返回其对应的所有 SR
还需传入 SRService (getServiceStore 而来) 不解析
同时需要传入该项目的 SRList (getSRListStore 而来) （未解析）
返回未排序
 */
const Service2SR = (
  serviceId: number,
  SRServiceAsso: string,
  SRList: string
) => {
  // console.log("================ Get SR By Service ===============");
  const SRServiceData = JSON.parse(SRServiceAsso).data;
  // console.log(SRServiceData);
  const matchedSRId = SRServiceData.map((obj: any) => {
    if (obj.service === serviceId) {
      return obj.SR;
    }
  }).filter((obj: any) => obj);
  return matchedSRId.map((id: any) => SRId2SRInfo(id, SRList));
};

const SR2ChargedUser = (
  SRId: number,
  SRUserAssociation: string,
  projectInfo: string
) => {
  const asso_data = JSON.parse(SRUserAssociation).data.filter(
    (asso: UserSRAssociationProps) => asso.sr === SRId
  );
  return JSON.parse(projectInfo).data.users.filter(
    (user: any) =>
      asso_data.filter((asso: UserSRAssociationProps) => asso.user === user.id)
        .length > 0
  );
};

const ChargedUser2SR = (
  userId: number,
  SRUserAssociation: string,
  SRInfo: string
) => {
  const asso_data = JSON.parse(SRUserAssociation).data.filter(
    (asso: UserSRAssociationProps) => asso.user === userId
  );
  return JSON.parse(SRInfo).data.filter(
    (SR: SRCardProps) => (user: any) =>
      asso_data.filter((asso: UserSRAssociationProps) => asso.sr === SR.id)
        .length > 0
  );
};

export {
  userId2UserInfo,
  IRId2IRInfo,
  SRId2SRInfo,
  MRId2MRInfo,
  itId2ItInfo,
  issueId2IssueInfo,
  commitId2CommitInfo,
  servId2ServInfo,
  projId2ProjInfo,
  repoId2RepoInfo,
  oneIR2AllSR,
  oneSR2AllIR,
  MR2SR,
  oneSR2AllMR,
  oneSR2AllCommit,
  IR2Iteration,
  Iteration2IR,
  SR2Iteration,
  Iteration2SR,
  SR2Issue,
  SR2Service,
  Service2SR,
  SR2ChargedUser,
  ChargedUser2SR,
};
