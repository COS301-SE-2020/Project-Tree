import React from "react";
import { Form, Modal, Button } from "react-bootstrap";
import $ from "jquery";


function stringifyFormData(fd) {
  const data = {};
  for (let key of fd.keys()) {
    data[key] = fd.get(key);
  }
  return JSON.stringify(data, null, 2);
}

class SendProjectNotification extends React.Component {
  constructor() {
    super();
    this.state={show: false}
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
    let data = stringifyFormData(new FormData(event.target));
    $.post("/sendNotification",  JSON.parse(data), (response) => {
      this.setState({ show: false });
      this.props.setProject(response);
    })
    .fail(() => {
      alert("Unable to send notification");
    })
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
