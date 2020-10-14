import React from "react";
import {
  Form,
  Modal,
  Button,
  InputGroup,
  Spinner,
  Row,
  Col,
} from "react-bootstrap";
import $ from "jquery";

class JoinProject extends React.Component {
  constructor() {
    super();
    this.state = { show: false, isLoading: false, code: "" };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  showModal() {
    this.setState({ show: true });
  }

  hideModal() {
    this.setState({ show: false });
  }

  handleChange(event) {
    this.setState({ code: event.target.value });
  }

  handleSubmit() {
    if (this.state.code === null) {
      alert("The code entered is invalid");
      return;
    }

    this.setState({ isloading: true });
    let data = JSON.stringify({
      userId: this.props.user.id,
      accessCode: this.state.code,
    });

    $.post("/project/joinproject", JSON.parse(data), (response) => {
      if (response.response !== "okay") {
        alert(response.response);
      }

      this.setState({ show: false, isloading: false });
    }).fail(() => {
      alert("Unable to add project manager");
    });
  }

  render() {
    return (
      <React.Fragment>
        <Button
          className="my-2 ml-3"
          style={{
            borderColor: "#EEBB4D",
            backgroundColor: "#EEBB4D",
            width: "170px",
            color: "black",
          }}
          onClick={() => {
            this.showModal();
          }}
        >
          <i className="fa fa-group"></i> Join Project{" "}
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
              <Modal.Title>Join Project</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group>
                <InputGroup>
                  <Row>
                    <Col>
                      <Form.Label>Enter Access Code</Form.Label>
                      <Form.Control
                        type="text"
                        onChange={(e) => this.handleChange(e)}
                      />
                    </Col>
                  </Row>
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
              <Button
                variant="dark"
                style={{ width: "100px" }}
                disabled={this.state.isloading}
                onClick={() => this.handleSubmit()}
              >
                {this.state.isloading ? (
                  <Spinner
                    animation="border"
                    variant="success"
                    size="sm"
                  ></Spinner>
                ) : (
                  "Join"
                )}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}

export default JoinProject;
