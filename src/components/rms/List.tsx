import React from "react";
import "./List.css";
import SRCard from "./SRCard";
import { Divider } from "antd";

interface ListProps {
  readonly name: string;
}

interface ListState {
  readonly cards: Array<number>; // an array for SRCards
}

class List extends React.Component<ListProps, ListState> {
  constructor(props: ListProps) {
    super(props);
    this.state = {
      cards: new Array<number>(),
    };
  }

  render() {
    return (
      <div className="list">
        <div className="list-header">{this.props.name}</div>
        <Divider />
        <div className="list-content">
          <SRCard />
          <SRCard />
          <SRCard />
          <SRCard />
          <SRCard />
        </div>
      </div>
    );
  }
}

export default List;
