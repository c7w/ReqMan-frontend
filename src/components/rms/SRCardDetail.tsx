import React from "react";
import { Modal, Button } from "antd";
import "./SRCardDetail.css";

interface SRCardDetailState {
  readonly visible: boolean;
}

class SRCardDetail extends React.Component<any, SRCardDetailState> {
  constructor(props: any) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  setVisible(isVisible: boolean): void {
    this.setState({
      ...this.state,
      visible: isVisible,
    });
  }

  render() {
    return (
      <div className="SRCard-detail">
        <Button type="primary" onClick={() => this.setVisible(true)}>
          Open Modal of 1000px width
        </Button>
        <Modal
          title={<div>test</div>}
          centered
          visible={this.state.visible}
          onOk={() => this.setVisible(false)}
          onCancel={() => this.setVisible(false)}
          width={1000}
        >
          <div className="SRCard-detail-content">content</div>
        </Modal>
      </div>
    );
  }
}

export default SRCardDetail;
