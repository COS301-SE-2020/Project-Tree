import React from 'react';
import {Form, Modal, Button, ButtonGroup} from 'react-bootstrap'

function stringifyFormData(fd) {
    const data = {};
      for (let key of fd.keys()) {
        data[key] = fd.get(key);
    }
    return JSON.stringify(data, null, 2);
}

class UpdateProgress extends React.Component{
    constructor(props) {
        super(props);
        this.state = { Show:false,                        
                        id: this.props.task.id,
                        progress: this.props.task.progress
                    };
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setProgress = this.setProgress.bind(this);
    }

    showModal(){
        this.setState({ Show:true});
    }

    hideModal(){
        this.setState({ Show:false});
    }

    setProgress(prog){
        this.setState({progress:prog})
    }

    refreshState(){
        this.setState(
            {
                id: this.props.task.id,
                progress: this.props.task.progress
            }
        )
    }

    async handleSubmit(event) {
        event.preventDefault();
        let data = {
            id: this.state.id,
            progress: this.state.progress
        }

        await fetch('/task/progress', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        this.props.toggleSidebar(null, null)
        this.props.setTaskInfo();
        //this.setState({ Show:false })
    }

    render(){
        if(this.state.id !== this.props.task.id)
            this.refreshState();

        return (
            <React.Fragment>
                <Button className="btn-light" onClick={this.showModal}><i className="fa fa-edit"> </i> Update Progress </Button>
                <Modal show={this.state.Show} onHide={this.hideModal}>
                    <Form onSubmit={this.handleSubmit}>
                        <Modal.Header closeButton>
                            <Modal.Title>Update Progress</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <ButtonGroup aria-label="Basic example">
                                <Button variant="secondary" onClick={() => this.setProgress("Complete")}>Complete</Button>
                                <Button variant="secondary" onClick={() => this.setProgress("Issue")}>Issue</Button>
                                <Button variant="secondary" onClick={() => this.setProgress("Incomplete")}>Incomplete</Button>
                            </ButtonGroup>
                            <br />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.hideModal}>
                            Cancel
                            </Button>
                            <Button  type="submit" variant="dark">
                            Update Task
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </React.Fragment>
        );
    }
}

export default UpdateProgress;