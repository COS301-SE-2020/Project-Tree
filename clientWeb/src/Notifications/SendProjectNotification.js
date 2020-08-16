import React from "react";
import { Form, Modal, Button } from "react-bootstrap";
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
    this.state={show: false, mode: 2}
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

    let notification = returnFormData(new FormData(event.target));
    let timestamp = (new Date().toISOString());

    let data = {
      type: 'project',     //personal, task, project, auto
      fromName: this.props.user.name + " " + this.props.user.sname,
      recipients: [],
      timestamp: timestamp,
      message: notification.sn_Message,
      taskName: undefined,
      projName: this.props.project.name,
      projID: this.props.project.id,
      mode: this.state.mode
    }
  
    $.post("/sendNotification",  data, (response) => {
      this.setState({ show: false });
    })
    .fail(() => {
      alert("Unable to send notification");
    })

    this.props.updateNoticeBoardRefreshKey();
  }

  render() {
    return ( 
      <React.Fragment>
        <Button
          className="my-2"
          style={{backgroundColor:"#184D47", color:"white", borderColor:"#184D47"}}
          onClick={() => {this.showModal()}}

        >
            <i className="fa fa-bell-o">  </i> Send Notification {" "}
        </Button>
        <Modal show={this.state.show} onHide={() => {this.hideModal()}}>
          <Form onSubmit={event => {this.handleSubmit(event)}}>
            <Modal.Header closeButton style={{backgroundColor:"#184D47", color:"white"}}>
              <Modal.Title>Send Notification</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group>
                <Form.Label>Notification Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="3"
                  type="text"
                  name="sn_Message"
                  required
                />
              </Form.Group>
              <Button className="m-2"
                  variant="secondary"
                  onClick={()=>{this.setState({mode:0})}}
                >
                  Email
                </Button>
                <Button className="m-2"
                  variant="secondary"
                  onClick={()=>{this.setState({mode:1})}}
                >
                  Notice Board
                </Button>
                <Button className="m-2"
                  variant="secondary"
                  onClick={()=>{this.setState({mode:2})}}
                >
                  Both
                </Button>
            </Modal.Body>
            <Modal.Footer style={{backgroundColor:"#184D47"}}>
              <Button variant="secondary" onClick={() => {this.hideModal()}}>
                Cancel
              </Button>
              <Button type="submit" variant="dark">Send Notification
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}

export default SendProjectNotification;
