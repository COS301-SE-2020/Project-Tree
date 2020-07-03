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
        this.state = {  Show:true,
                        pid: this.props.project.id,
                        fid: this.props.source.id,
                        sid: this.props.target.id
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async handleSubmit(event) {
        event.preventDefault();
        let data = new FormData(event.target);
        data = await stringifyFormData(data)
        
        await fetch('/dependency/add', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
            body: data,
        });
        this.props.setTaskInfo()
        this.props.closeModal()
    }

    render(){
        if(this.props.source == null || this.props.target == null)
        {
            this.props.closeModal();
        }

        return (
            <React.Fragment>
                {/*<Button size="sm" variant="secondary" block onClick={this.ShowModal}>Create Dependency</Button>*/}
                <Modal show={true} onHide={this.props.closeModal}>
                    <Form onSubmit={this.handleSubmit}>
                        <Modal.Header closeButton>
                            <Modal.Title>Create Dependency</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <input hidden type="number" name="cd_pid" value={this.state.pid} onChange={()=>{}}/>
                            <input hidden type="number" name="cd_fid" value={this.state.fid} onChange={()=>{}}/>
                            <input hidden type="number" name="cd_sid" value={this.state.sid} onChange={()=>{}}/>
                            <Form.Group>
                                <Form.Label>Relationship Type</Form.Label>
                                <Form.Control as="select"  name='cd_relationshipType'>
                                    <option value='ss'>Start-Start</option>
                                    <option value='fs'>Finish-Start</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Dependency Duration</Form.Label>
                                <Form.Control required type='number' name='cd_duration'/>
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.props.closeModal}>
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