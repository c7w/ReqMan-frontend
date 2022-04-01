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
} from "../store/functions/RMS";
import {
  IRCard,
  IRSRAssociation,
  Iteration,
  SRCard,
  SRIteration,
  UserIteration,
} from "../store/ConfigureStore";
import {
  oneIR2AllSR,
  oneSR2AllIR,
  SR2Iteration,
  userId2Name,
} from "../utils/Association";
import { getProjectStore } from "../store/slices/ProjectSlice";
import { updateProjectInfo } from "../store/functions/UMS";
import Loading from "../layout/components/Loading";
import { getIRSRStore } from "../store/slices/IRSRSlice";
import { getSRIterationStore } from "../store/slices/IterationSlice";

const Test = () => {
  const dispatcher = useDispatch();
  const projectInfo = useSelector(getProjectStore);
  const IRSRAsso = useSelector(getIRSRStore);
  const SRIterationAsso = useSelector(getSRIterationStore);
  const IR: IRCard = {
    id: 27,
    project: 2,
    title: "邪门了",
    description: "我就不信了",
    rank: 1,
    createdBy: "17",
    createdAt: Date.now(),
    disabled: false,
  };
  const SR: SRCard = {
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
    IRId: 19,
    SRId: 5,
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
    // console.log(userId2Name(17, projectInfo));
    // console.log(oneIR2AllSR(26, IRSRAsso));
    // console.log(oneSR2AllIR(10, IRSRAsso));
    console.log(SR2Iteration(24, SRIterationAsso));
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
  if (projectInfo === "" || IRSRAsso === "" || SRIterationAsso === "") {
    updateProjectInfo(dispatcher, 2);
    getIRSRInfo(dispatcher, 2);
    getSRIterationInfo(dispatcher, 2);
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
