import React from "react";
import "./List.css";

interface ListProps {
  readonly name: string;
}

class List extends React.Component<ListProps> {
  render() {
    return <div className="list">{this.props.name}</div>;
  }
}

export default List;
