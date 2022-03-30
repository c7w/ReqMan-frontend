import { Button } from "antd";
import { useDispatch } from "react-redux";
import {
  createIRInfo,
  createIRSR,
  createIteration,
  createSRInfo,
  createSRIteration,
} from "../store/functions/RMS";
import {
  IRCard,
  IRSRAssociation,
  Iteration,
  SRCard,
  SRIteration,
} from "../store/ConfigureStore";

const Test = () => {
  const dispatcher = useDispatch();
  const IR: IRCard = {
    id: 1,
    project: 2,
    title: "test_ir",
    description: "test_ir",
    rank: 1,
    createdBy: "17",
    createdAt: Date.now(),
    disabled: false,
  };
  const SR: SRCard = {
    id: 1,
    project: 2,
    title: "test_ir",
    description: "test_ir",
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
    IRId: 7,
    SRId: 2,
  };
  const SRIteration: SRIteration = {
    id: 1,
    SRId: 2,
    iteration: 1,
  };
  const handleOnClick = () => {
    console.log("click");
    createIRInfo(dispatcher, 2, IR);
    createSRInfo(dispatcher, 2, SR);
    createIRSR(dispatcher, 2, IRSRAssociation);
    createIteration(dispatcher, 2, Iteration);
    createSRIteration(dispatcher, 2, SRIteration);
  };
  return <Button onClick={() => handleOnClick()} />;
};

export default Test;
