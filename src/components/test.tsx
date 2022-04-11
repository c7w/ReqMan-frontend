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
  IRCard,
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
  getIssueInfo,
  getMergeInfo,
  getRepoInfo,
} from "../store/functions/RDTS";
import { useEffect, useState } from "react";
import { getRepoStore } from "../store/slices/RepoSlice";

const Test = () => {
  const dispatcher = useDispatch();
  const repoStore = useSelector(getRepoStore);
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
    if (repoStore !== "") {
      // getMergeInfo(dispatcher, 2, repoStore);
      getIssueInfo(dispatcher, 2, repoStore);
    }
  }, [repoStore]);

  const handleOnClick = () => {
    getRepoInfo(dispatcher, 2);
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
    iterationInfo === ""
  ) {
    updateProjectInfo(dispatcher, 2);
    getIRSRInfo(dispatcher, 2);
    getSRIterationInfo(dispatcher, 2);
    getIRIterationInfo(dispatcher, 2);
    getSRServiceInfo(dispatcher, 2);
    getIRListInfo(dispatcher, 2);
    getSRListInfo(dispatcher, 2);
    updateServiceInfo(dispatcher, 2);
    getIterationInfo(dispatcher, 2);
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
