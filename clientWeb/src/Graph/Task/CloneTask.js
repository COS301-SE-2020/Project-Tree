import React from "react";
import {
  Modal,
  Button,
  Spinner,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";

class CloneTask extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      isloading: false,
    };
    this.ShowModal = this.ShowModal.bind(this);
    this.HideModal = this.HideModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  ShowModal() {
    this.setState({ show: true });
  }

  HideModal() {
    this.setState({ show: false });
  }

  async handleSubmit() {
    this.setState({ isloading: true });
    await fetch("/task/createClone", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: this.props.task.id }),
    });

    const response = await fetch("/getProjectViews", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: this.props.project.id }),
    });

    const body = await response.json();

    await this.props.setTaskInfo(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      body.views
    );

    this.setState({ show: false, isloading: false });
  }

  render() {
    return (
      <React.Fragment>
        <Button
          variant="outline-dark"
          style={{ width: "170px" }}
          onClick={this.ShowModal}
        >
          <i className="fa fa-clone"> </i> Clone{" "}
        </Button>
        <Modal show={this.state.show} onHide={this.HideModal}>
          <Modal.Header
            closeButton
            style={{ backgroundColor: "#96BB7C", color: "white" }}
          >
            <Modal.Title>
              Clone Task{" "}
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip className="helpTooltip">
                    A view is a copy of a task that may be used to stop the
                    crossing of dependency lines. Editing a view will also edit
                    the original task.
                  </Tooltip>
                }
              >
                <i
                  className="fa fa-info-circle"
                  style={{ color: "black", fontSize: "20px" }}
                ></i>
              </OverlayTrigger>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Do you want to create a view of {this.props.task.name}?
          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: "#96BB7C", color: "white" }}>
            <Button variant="dark" onClick={this.HideModal}>
              Close
            </Button>
            <Button
              type="submit"
              variant="dark"
              style={{ width: "100px" }}
              disabled={this.state.isloading}
              onClick={this.handleSubmit}
            >
              {this.state.isloading ? (
                <Spinner
                  animation="border"
                  variant="success"
                  size="sm"
                ></Spinner>
              ) : (
                "Create"
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}

export default CloneTask;
