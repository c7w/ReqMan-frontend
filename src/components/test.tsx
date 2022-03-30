import { Button } from "antd";
import { useDispatch } from "react-redux";
import {
  createIRInfo,
  createIRSRAssociation,
  createSRInfo,
} from "../store/functions/RMS";
import {
  IRCard,
  IRSRAssociation,
  Iteration,
  SRCard,
  SRIterationAssociation,
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
  const IRSRAssociation: IRSRAssociation = {
    id: 1,
    IRId: 7,
    SRId: 2,
  };
  const SRIterationAssociation: SRIterationAssociation = {
    id: 1,
    SRId: 2,
    iteration: 1,
  };
  const handleOnClick = () => {
    console.log("click");
    createIRInfo(dispatcher, 2, IR);
    createSRInfo(dispatcher, 2, SR);
    createIRSRAssociation(dispatcher, 2, IRSRAssociation);
  };
  return <Button />;
};

export default Test;
