import React from "react";
import {Form, Modal, Button, Row, Col } from "react-bootstrap";

class CloneTask extends React.Component {
  constructor(props) {
		super(props);
		this.state = {
			show: false
		}
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
		await fetch("/task/createClone", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: this.props.task.id })
		});

		const response = await fetch("/getProjectViews", {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ id: this.props.project.id })
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
		
    this.setState({ show: false });
  }
	
  render() {
    return (
      <React.Fragment>
        <Button variant="outline-dark" style={{width: "170px" }}  onClick={this.ShowModal}>
          <i className="fa fa-clone"> </i> Clone {" "}
        </Button>
				<Modal show={this.state.show} onHide={this.HideModal}>
					<Modal.Header
							closeButton
							style={{ backgroundColor: "#96BB7C", color: "white" }}
						>
						<Modal.Title>Clone Task</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						Do you want to create a view of {this.props.task.name}?
					</Modal.Body>
					<Modal.Footer
						style={{ backgroundColor: "#96BB7C", color: "white" }}
					>
						<Button variant="dark" onClick={this.HideModal}>
							Close 
						</Button>
						<Button variant="secondary" onClick={this.handleSubmit}>
							Create 
						</Button>
					</Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}

export default CloneTask;
