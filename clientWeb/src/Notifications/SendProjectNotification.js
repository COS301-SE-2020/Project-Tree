import React from "react";
import {
  Form,
  Modal,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Spinner,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import $ from "jquery";

function returnFormData(fd) {
  const data = {};
  for (let key of fd.keys()) {
    data[key] = fd.get(key);
  }
  return data;
}

class SendProjectNotification extends React.Component {
  constructor() {
    super();
    this.state = { show: false, mode: 2, isloading: false };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  showModal() {
    this.setState({ show: true });
  }

  hideModal() {
    this.setState({ show: false });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ isloading: true });
    let notification = returnFormData(new FormData(event.target));
    let timestamp = new Date();
    timestamp.setHours(timestamp.getHours() + 2);
    timestamp = timestamp.toISOString();
    let data = {
      type: "project", //personal, task, project, auto
      fromName: this.props.user.name + " " + this.props.user.sname,
      profileId: this.props.user.id,
      recipients: [],
      timestamp: timestamp,
      message: notification.sn_Message,
      taskName: undefined,
      projName: this.props.project.name,
      projID: this.props.project.id,
      mode: this.state.mode,
    };

    $.post("/sendNotification", data, (response) => {
      this.setState({ show: false, isloading: false });
    }).fail(() => {
      alert("Unable to send notification");
    });

    this.props.updateNoticeBoardRefreshKey();
  }

  render() {
    return (
      <React.Fragment>
        <Button
          className="btn-warning"
          style={{ width: "100px" }}
          onClick={() => {
            this.showModal();
          }}
        >
          <i className="fa fa-bullhorn"> </i> Notify{" "}
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
              <Modal.Title>Send Notification</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group>
                <Form.Label>
                  Notification Message{" "}
                  <OverlayTrigger
                    placement="right"
                    overlay={
                      <Tooltip className="helpTooltip">
                        This message will be sent to every member part of this
                        project
                      </Tooltip>
                    }
                  >
                    <i
                      className="fa fa-info-circle"
                      style={{ color: "black", fontSize: "20px" }}
                    ></i>
                  </OverlayTrigger>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows="3"
                  type="text"
                  name="sn_Message"
                  required
                />
              </Form.Group>
              <ToggleButtonGroup horizontal="true" name="notify">
                <ToggleButton
                  variant="outline-secondary"
                  value="email"
                  onClick={() => {
                    this.setState({ mode: 0 });
                  }}
                >
                  Email
                </ToggleButton>
                <ToggleButton
                  value="NB"
                  variant="outline-secondary"
                  onClick={() => {
                    this.setState({ mode: 1 });
                  }}
                >
                  Notice Board
                </ToggleButton>
                <ToggleButton
                  variant="outline-secondary"
                  value="both"
                  onClick={() => {
                    this.setState({ mode: 2 });
                  }}
                >
                  Both
                </ToggleButton>
              </ToggleButtonGroup>
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
                type="submit"
                variant="dark"
                style={{ width: "100px" }}
                disabled={this.state.isloading}
              >
                {this.state.isloading ? (
                  <Spinner
                    animation="border"
                    variant="success"
                    size="sm"
                  ></Spinner>
                ) : (
                  "Send"
                )}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}

export default SendProjectNotification;
