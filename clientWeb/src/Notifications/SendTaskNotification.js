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

class SendTaskNotification extends React.Component {
  constructor() {
    super();
    this.state={show: false, mode: 2, notificationRec: []}
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
      type: 'task',     //personal, task, project, auto
      fromName: this.props.user.name + " " + this.props.user.sname,
      recipients: this.state.notificationRec,
      timestamp: timestamp,
      message: notification.sn_Message,
      taskName: this.props.task.name,
      projName: this.props.project.name,
      projID: this.props.project.id,
      mode: this.state.mode
    }

    console.log(data);
  
    $.post("/sendNotification",  data, (response) => {
      console.log(response.response);
      this.setState({ show: false });
    })
    .fail(() => {
      alert("Unable to send notification");
    })
  }

  notifyUsers(){
    let userNotifications =[];
    for(let x = 0; x < this.props.taskPacMans.length; x++){
      let user={
        id:this.props.taskPacMans[x].id,
        email:this.props.taskPacMans[x].email
      }
      userNotifications.push(user)
    }
  
    for(let x = 0; x < this.props.taskResPersons.length; x++){
      let user={
        id:this.props.taskResPersons[x].id,
        email:this.props.taskResPersons[x].email
      }
      userNotifications.push(user)
    }
  
    for(let x = 0; x < this.props.taskResources.length; x++){
      let user={
        id:this.props.taskResources[x].id,
        email:this.props.taskResources[x].email
      }
      userNotifications.push(user)
    }
    this.setState({notificationRec: userNotifications})
  }

  render() {
    return ( 
      <React.Fragment>
       <Button className="ml-3" variant="outline-dark" onClick={() => {this.showModal();this.notifyUsers()}}>
          <i className="fa fa-bell-o"> </i> 
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

export default SendTaskNotification;
