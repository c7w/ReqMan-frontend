import { Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
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

const Test = () => {
  const dispatcher = useDispatch();
  const projectInfo = useSelector(getProjectStore);
  const IRSRAsso = useSelector(getIRSRStore);
  const SRIterationAsso = useSelector(getSRIterationStore);
  const IRIterationAsso = useSelector(getIRIterationStore);
  const SRServiceAsso = useSelector(getSRServiceStore);
  const SRListInfo = useSelector(getSRListStore);
  const IRListInfo = useSelector(getIRListStore);
  const iterationInfo = useSelector(getIterationStore);
  const serviceInfo = useSelector(getServiceStore);
  const IR: IRCard = {
    id: 27,
    project: 2,
    title: "邪门了",
    description: "我就不信了",
    rank: 1,
    createdBy: "17",
    createdAt: Date.now(),
    disabled: false,
    progress: 10,
  };
  const SR: SRCardProps = {
    id: 1,
    project: 2,
    title: "test_sfdafafar",
    description: "testfadfafafa_sr",
    priority: 1,
    rank: 1,
    currState: "TODO",
    createdBy: "17",
    createdAt: Date.now(),
    disabled: false,
    iter: [],
    chargedBy: "某某某",
    service: -1,
  };
  const Iteration: Iteration = {
    id: 1,
    project: 2,
    sid: 1,
    title: "test_iteration",
    begin: Date.now(),
    end: Date.now(),
    disabled: false,
    createdAt: Date.now(),
  };
  const IRSRAssociation: IRSRAssociation = {
    id: 1,
    IR: 19,
    SR: 5,
  };
  const SRIteration: SRIteration = {
    id: 1,
    SRId: 2,
    iterationId: 3,
  };
  const UserIteration: UserIteration = {
    id: 1,
    userId: 1,
    iterationId: 1,
  };
  const handleOnClick = () => {
    console.log("click");
    // console.log(userId2UserInfo(17, projectInfo));
    // console.log(oneIR2AllSR(26, IRSRAsso, SRListInfo));
    // console.log(oneSR2AllIR(4, IRSRAsso, IRListInfo));
    // console.log(SR2Iteration(24, SRIterationAsso, iterationInfo));
    // console.log(IR2Iteration(1, IRIterationAsso, iterationInfo));
    // console.log(Iteration2IR(5, IRIterationAsso, IRListInfo));
    // console.log(Iteration2SR(1, SRIterationAsso, SRListInfo));
    // console.log(SR2Service(24, SRServiceAsso, serviceInfo));
    console.log(Service2SR(1, SRServiceAsso, SRListInfo));
    // createIRInfo(dispatcher, 2, IR);
    // createSRInfo(dispatcher, 2, SR);
    // createIRSR(dispatcher, 2, IRSRAssociation);
    // createIteration(dispatcher, 2, Iteration); 待解决 bug
    // createSRIteration(dispatcher, 2, SRIteration);
    // createUserIteration(dispatcher, 2, UserIteration);
    // updateIRInfo(dispatcher, 2, IR);
    // updateSRInfo(dispatcher, 2, SR);
    // updateIterationInfo(dispatcher, 2, Iteration); 待解决 bug
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
