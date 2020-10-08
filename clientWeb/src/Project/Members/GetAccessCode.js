import React from "react";
import {
  Form,
  Modal,
  Button,
  InputGroup,
  OverlayTrigger,
  Tooltip
} from "react-bootstrap";
import copy from "copy-to-clipboard";

class GetAccessCode extends React.Component {
    constructor() {
        super();
        this.state = { show: false };
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }
    
    showModal() {
        this.setState({ show: true });
    }

    hideModal() {
        this.setState({ show: false });
    }

    copyToBoard(){
        copy(this.props.project.accessCode);
    }

  render() {
    return (
      <React.Fragment>
        <Button
          className="btn-warning mt-4"
          style={{
            width: "205px",
            color: "black",
          }}
          onClick={() => {
            this.showModal();
          }}
        >
          <i className="fa fa-link"></i> Get Access Code{" "}
        </Button>
        <Modal
          show={this.state.show}
          onHide={() => {
            this.hideModal();
          }}
        >
          <Form
            onSubmit={(event) => {
              this.handleSubmit(event);
            }}
          >
            <Modal.Header closeButton style={{ backgroundColor: "#96BB7C" }}>
              <Modal.Title>Get Access Code {" "}
              <OverlayTrigger
                placement='right'
                overlay={
                <Tooltip className="helpTooltip">
                  Send this code to people you would like to join this project. They will need to be accepted by project managers before they are added to the project.
                </Tooltip>
                } >
                <i className="fa fa-info-circle"  style={{ color: "black", fontSize: "20px" }}></i>
                </OverlayTrigger></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                    <InputGroup>
                        <Form.Control
                            disabled
                            type="text"
                            value={this.props.project.accessCode}
                        />
                        <Button className="btn-warning" onClick={()=>this.copyToBoard()}>
                            <i className="fa fa-clipboard"> </i>
                        </Button>
                    </InputGroup>
                </Form.Group>
            </Modal.Body>

            <Modal.Footer style={{ backgroundColor: "#96BB7C" }}>
              <Button
                variant="secondary"
                onClick={() => {
                  this.hideModal();
                }}
              >
                Cancel
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}

export default GetAccessCode;