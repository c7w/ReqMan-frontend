import { Button } from "antd";
import { useDispatch, useSelector, useStore } from "react-redux";
import {
  createIRInfo,
  updateIRInfo,
  createIRSR,
  createIteration,
  createSRInfo,
  createSRIteration,
  createUserIteration,
  updateSRInfo,
  updateIterationInfo,
  getIRSRInfo,
  getSRIterationInfo,
  getIRIterationInfo,
  getSRServiceInfo,
  getIRListInfo,
  getSRListInfo,
  updateServiceInfo,
  getIterationInfo,
} from "../store/functions/RMS";
import {
  IRCardProps,
  IRSRAssociation,
  Iteration,
  SRCardProps,
  SRIteration,
  UserIteration,
} from "../store/ConfigureStore";
import {
  IR2Iteration,
  Iteration2IR,
  Iteration2SR,
  oneIR2AllSR,
  oneSR2AllIR,
  Service2SR,
  SR2Iteration,
  SR2Service,
  userId2UserInfo,
} from "../utils/Association";
import { getProjectStore } from "../store/slices/ProjectSlice";
import { updateProjectInfo } from "../store/functions/UMS";
import Loading from "../layout/components/Loading";
import {
  getIRListStore,
  getIRSRStore,
  getSRListStore,
} from "../store/slices/IRSRSlice";
import {
  getIRIterationStore,
  getIterationStore,
  getSRIterationStore,
} from "../store/slices/IterationSlice";
import {
  getServiceStore,
  getSRServiceStore,
} from "../store/slices/ServiceSlice";
import {
  getCommitInfo,
  getIssueInfo,
  getMergeInfo,
  getRDTSInfo,
  getRepoInfo,
} from "../store/functions/RDTS";
import { useEffect, useState } from "react";
import { getRepoStore } from "../store/slices/RepoSlice";
import {
  getCommitStore,
  getIssueStore,
  getMergeStore,
} from "../store/slices/IssueSlice";

const Test = () => {
  const dispatcher = useDispatch();

  const repoStore = useSelector(getRepoStore);
  const issueStore = useSelector(getIssueStore);
  const mergeStore = useSelector(getMergeStore);
  const commitStore = useSelector(getCommitStore);

  const projectInfo = useSelector(getProjectStore);
  const IRSRAsso = useSelector(getIRSRStore);
  const SRIterationAsso = useSelector(getSRIterationStore);
  const IRIterationAsso = useSelector(getIRIterationStore);
  const SRServiceAsso = useSelector(getSRServiceStore);
  const SRListInfo = useSelector(getSRListStore);
  const IRListInfo = useSelector(getIRListStore);
  const iterationInfo = useSelector(getIterationStore);
  const serviceInfo = useSelector(getServiceStore);

  useEffect(() => {
    updateProjectInfo(dispatcher, 2);
    getIRSRInfo(dispatcher, 2);
    getSRIterationInfo(dispatcher, 2);
    getIRIterationInfo(dispatcher, 2);
    getSRServiceInfo(dispatcher, 2);
    getIRListInfo(dispatcher, 2);
    getSRListInfo(dispatcher, 2);
    updateServiceInfo(dispatcher, 2);
    getIterationInfo(dispatcher, 2);
    getRDTSInfo(dispatcher, 2);
  }, []);

  const handleOnClick = () => {
    getRDTSInfo(dispatcher, 2);
  };
  if (
    projectInfo === "" ||
    IRSRAsso === "" ||
    SRIterationAsso === "" ||
    IRIterationAsso === "" ||
    SRServiceAsso === "" ||
    SRListInfo === "" ||
    IRListInfo === "" ||
    serviceInfo === "" ||
    iterationInfo === "" ||
    repoStore === "" ||
    issueStore === "" ||
    mergeStore === "" ||
    commitStore === ""
  ) {
  } else {
    return (
      <>
        <p>I am test page</p>
        <Button type="primary" onClick={() => handleOnClick()}>
          Primary Button
        </Button>
      </>
    );
  }
  return (
    <>
      <Loading />
    </>
  );
};

export default Test;
