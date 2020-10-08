import React from "react";
import {
  Form,
  Modal,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Spinner,
  OverlayTrigger,
  Tooltip
} from "react-bootstrap";
import $ from "jquery";

function returnFormData(fd) {
  const data = {};
  for (let key of fd.keys()) {
    data[key] = fd.get(key);
  }
  return data;
}

class SendTaskNotification extends React.Component {
  constructor() {
    super();
    this.state = {
      show: false,
      mode: 2,
      notificationRec: [],
      isloading: false,
    };
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
      type: "task", //personal, task, project, auto
      profileId: this.props.user.id,
      fromName: this.props.user.name + " " + this.props.user.sname,
      recipients: JSON.stringify(this.state.notificationRec),
      timestamp: timestamp,
      message: notification.sn_Message,
      taskName: this.props.task.name,
      projName: this.props.project.name,
      projID: this.props.project.id,
      mode: this.state.mode,
    };

    $.post("/sendNotification", data, (response) => {
      this.setState({ show: false, isloading: false });
    }).fail(() => {
      alert("Unable to send notification");
    });
  }

  notifyUsers() {
    let userNotifications = [];
    for (let x = 0; x < this.props.taskPacMans.length; x++) {
      let user = {
        id: this.props.taskPacMans[x].id,
        email: this.props.taskPacMans[x].email,
      };
      userNotifications.push(user);
    }

    for (let x = 0; x < this.props.taskResPersons.length; x++) {
      let user = {
        id: this.props.taskResPersons[x].id,
        email: this.props.taskResPersons[x].email,
      };
      userNotifications.push(user);
    }

    for (let x = 0; x < this.props.taskResources.length; x++) {
      let user = {
        id: this.props.taskResources[x].id,
        email: this.props.taskResources[x].email,
      };
      userNotifications.push(user);
    }

    let addMyself = true;
    for (let x = 0; x < userNotifications.length; x++) {
      if (userNotifications[x].id === this.props.user.id) addMyself = false;
    }
    if (addMyself === true)
      userNotifications.push({
        id: this.props.user.id,
        email: this.props.user.email,
      });

    this.setState({ notificationRec: userNotifications });
  }

  render() {
    return (
      <React.Fragment>
        <Button
          variant="outline-dark"
          style={{ width: "170px" }}
          onClick={() => {
            this.showModal();
            this.notifyUsers();
          }}
        >
          <i className="fa fa-bullhorn"> </i> Notify
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
                <Form.Label>Notification Message {" "}
              <OverlayTrigger
                placement='right'
                overlay={
                <Tooltip className="helpTooltip">
                  This message will be sent to every member assigned to this task
                </Tooltip>
                } >
                <i className="fa fa-info-circle"  style={{ color: "black", fontSize: "20px" }}></i>
                </OverlayTrigger></Form.Label>
                <Form.Control
                  as="textarea"
                  rows="3"
                  type="text"
                  name="sn_Message"
                  required
                />
              </Form.Group>
              <ToggleButtonGroup horizontal name="notify">
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

export default SendTaskNotification;
