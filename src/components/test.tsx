import { Button } from "antd";
import { useDispatch } from "react-redux";
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
} from "../store/functions/RMS";
import {
  IRCard,
  IRSRAssociation,
  Iteration,
  SRCard,
  SRIteration,
  UserIteration,
} from "../store/ConfigureStore";

const Test = () => {
  const dispatcher = useDispatch();
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
  return (
    <>
      <p>I am test page</p>
      <Button type="primary" onClick={() => handleOnClick()}>
        Primary Button
      </Button>
    </>
  );
};

export default Test;
