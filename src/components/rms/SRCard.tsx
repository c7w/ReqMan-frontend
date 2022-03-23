import React from "react";
import "./SRCard.css";
import { Typography } from "antd";
const { Text } = Typography;

interface SRCardProps {
  readonly id: number; // id
  readonly project: string; // the project belongs to
  readonly title: string; // title
  readonly description: string; // description
  readonly priority: number; // the priority which indicates the importance of the SR
  readonly currState: string; // "TODO", "WIP", "Reviewing", "Done"
  readonly createdBy: string; // somebody
  readonly createdAt: number; // sometime
  readonly disabled: boolean;
}

const SRCard = (props: SRCardProps) => {
  return (
    <>
      <div
        className="SRCard-small"
        onClick={() => {
          document.getElementsByTagName("input")[0].checked = true;
        }}
      >
        <div className="card-small-up">{props.title}</div>
        <div className="card-small-description">
          <Typography>
            <Text>{props.description}</Text>
          </Typography>
        </div>
        <div className="card-small-down"></div>
      </div>
      <input id="button" type="checkbox" />
      <div className="modal">
        <div className="modal-header">
          <div className="modal-header-left">{props.title}</div>
          <div className="modal-header-right">right</div>
        </div>
        <div className="modal-content">content</div>
      </div>
    </>
  );
};

// default props for SRCard
SRCard.defaultProps = {
  id: 0, // id
  project: "test", // the project belongs to
  title: "SR.002.103", // title
  description: "hbx is working hard !", // description
  priority: 0, // the priority which indicates the importance of the SR
  currState: "TODO", // "TODO", "WIP", "Reviewing", "Done"
  createdBy: "hbx", // somebody
  createdAt: new Date().getDate(), // sometime
  disabled: false,
};

export default SRCard;
