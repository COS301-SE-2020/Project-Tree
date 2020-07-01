import React from 'react';
import {Form, Modal, Button} from 'react-bootstrap'

function stringifyFormData(fd) {
    const data = {};
      for (let key of fd.keys()) {
        data[key] = fd.get(key);
    }
    return JSON.stringify(data, null, 2);
}

class UpdateDependency extends React.Component{
    constructor(props) {
        super(props);
        this.state = {  Show:false,
                        pid: this.props.project.id,
                        did: this.props.dependency.id,
                        relation: this.props.dependency.relation,
                        duration: this.props.dependency.duration
        };
        this.ShowModal = this.ShowModal.bind(this);
        this.HideModal = this.HideModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    ShowModal(){
        this.setState({ Show:true});
    }

    HideModal(){
        this.setState({ Show:false});
    }

    async handleSubmit(event) {
        event.preventDefault();
        let data = new FormData(event.target);
        data = await stringifyFormData(data)

        const response = await fetch('/dependency/update', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
            body: data,
        });
        const body = await response.json();
        this.setState({ Show:false })
    }

    render(){
        return (
            <React.Fragment>
                <Button className="btn-light" onClick={this.ShowModal}><i className="fa fa-edit"> </i> Edit </Button>
                <Modal show={this.state.Show} onHide={this.HideModal}>
                    <Form onSubmit={this.handleSubmit}>
                        <Modal.Header closeButton>
                            <Modal.Title>Update Dependencies</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <input hidden type="number" name="up_pid"  value={this.state.pid} onChange={()=> {}}/>
                            <input hidden type="number" name="up_did"  value={this.state.did} onChange={()=> {}}/>
                            {/*<Form.Group>
                            <Form.Label>Select First Task by ID:</Form.Label>
                            <Form.Control required type='text' name="ud_Fid" value={this.state.Fid}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Select Second Task by ID:</Form.Label>
                                <Form.Control required type='text' name="ud_Sid" value={this.state.Sid}/>
                            </Form.Group>*/}
                            <Form.Group>
                                <Form.Label>Relationship Type</Form.Label>
                                <Form.Control as="select"  name='ud_relationshipType' value={this.state.relation}
                                    onChange={e => {
                                        this.setState({ relation: e.target.value });
                                        this.value = this.state.relation;
                                    }}>
                                    <option value='ss'>Start-Start</option>
                                    <option value='fs'>Finish-Start</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Duration:</Form.Label>
                                <Form.Control required type='number' name="ud_duration" value={this.state.duration}
                                    onChange={e => {
                                        this.setState({ relation: e.target.value });
                                        this.value = this.state.duration;
                                    }}/>
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.HideModal}>
                            Cancel
                            </Button>
                            <Button  type="submit" variant="dark">
                            Update Dependency
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </React.Fragment>
        );
    }
}

export default UpdateDependency;