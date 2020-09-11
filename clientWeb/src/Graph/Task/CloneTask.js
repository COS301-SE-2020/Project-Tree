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
        <Button variant="outline-dark"  onClick={this.ShowModal}>
          <i className="fa fa-clone"> Clone</i>
        </Button>
				<Modal show={this.state.show} onHide={this.HideModal}>
					<Modal.Header
							closeButton
							style={{ backgroundColor: "#184D47", color: "white" }}
						>
						<Modal.Title>Clone Task</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						Do you want to create a view of {this.props.task.name}?
					</Modal.Body>
					<Modal.Footer
						style={{ backgroundColor: "#184D47", color: "white" }}
					>
						<Button variant="outline-dark" onClick={this.handleSubmit}>
							<i className="fa fa-check"> Create</i>
						</Button>
						<Button variant="outline-dark" onClick={this.HideModal}>
							<i className="fa fa-close"> Close</i>
						</Button>
					</Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}

export default CloneTask;
