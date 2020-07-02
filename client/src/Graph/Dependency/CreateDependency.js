import React from 'react';
import {Form, Modal, Button} from 'react-bootstrap'

function stringifyFormData(fd) {
    const data = {};
      for (let key of fd.keys()) {
        data[key] = fd.get(key);
    }
    return JSON.stringify(data, null, 2);
}

class CreateDependency extends React.Component{
    constructor(props) {
        super(props);
        this.state = {  Show:false,
                        pid: this.props.project.id,
                        source: this.props.source,
                        target: this.props.target,
        };
        this.ShowModal = this.ShowModal.bind(this);
        this.HideModal = this.HideModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    ShowModal(){
        this.setState({ Show:true });
    }

    HideModal(){
        this.setState({ Show:false });
    }

    async handleSubmit(event) {
        event.preventDefault();
        let data = new FormData(event.target);
        data = await stringifyFormData(data)
        console.log(data);
        
        const response = await fetch('/dependency/add', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
            body: data,
        });
        const body = await response.json();
        console.log(body);
        this.setState({ Show:false })
    }

    render(){
        return (
            <React.Fragment>
                <Button size="sm" variant="secondary" block onClick={this.ShowModal}>
                    Create Dependency between {this.state.source.name}→{this.state.target.name}
                </Button>
                <Modal show={this.state.Show} onHide={this.HideModal}>
                    <Form onSubmit={this.handleSubmit}>
                        <Modal.Header closeButton>
                            <Modal.Title>Create Dependency</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <input hidden type='number' name='cd_pid' value={this.state.pid} onChange={()=>{}}/>
                            <input hidden type='number' name='cd_fid' value={this.state.source.id} onChange={()=>{}}/>
                            <input hidden type='number' name='cd_sid' value={this.state.target.id} onChange={()=>{}}/>
                            <Form.Group>
                                <Form.Label>Relationship Type</Form.Label>
                                <Form.Control as="select"  name='cd_relationshipType'>
                                    <option value='ss'>Start-Start</option>
                                    <option value='fs'>Finish-Start</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Dependency Duration</Form.Label>
                                <Form.Control type='number' name='cd_duration' required/>
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.HideModal}>
                            Cancel
                            </Button>
                            <Button  type="submit" variant="dark">
                            Create Dependency
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </React.Fragment>
        );
    }
}

export default CreateDependency;