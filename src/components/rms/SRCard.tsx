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
  readonly state: string; // "TODO", "WIP", "Reviewing", "Done"
  readonly createdBy: string; // somebody
  readonly createdAt: number; // sometime
  readonly disabled: boolean;
}

class SRCard extends React.Component<SRCardProps> {
  // default props for SRCard
  static defaultProps = {
    id: 0, // id
    project: "test", // the project belongs to
    title: "SR.002.103", // title
    description: "hbx is working hard !", // description
    priority: 0, // the priority which indicates the importance of the SR
    state: "TODO", // "TODO", "WIP", "Reviewing", "Done"
    createdBy: "hbx", // somebody
    createdAt: new Date().getDate(), // sometime
    disabled: false,
  };
  render() {
    return (
      <div className="card-small">
        <div className="card-small-up">{this.props.title}</div>
        <div className="card-small-description">
          <Typography>
            <Text>{this.props.description}</Text>
          </Typography>
        </div>
        <div className="card-small-down"></div>
      </div>
    );
  }
}

export default SRCard;
