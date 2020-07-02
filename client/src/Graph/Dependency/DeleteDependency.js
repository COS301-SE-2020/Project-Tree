import React from 'react';
import {Form, Modal, Button} from 'react-bootstrap'

function stringifyFormData(fd) {
    const data = {};
      for (let key of fd.keys()) {
        data[key] = fd.get(key);
    }
    return JSON.stringify(data, null, 2);
}

class DeleteDependency extends React.Component{
    constructor(props) {
        super(props);
        this.state = {  Show:false,
                        did: this.props.dependency.id                
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
        await fetch('/dependency/delete', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
            body: data,
        });
        this.setState({ Show:false })
    }

    render(){
        return (
            <React.Fragment>
                <Button className="btn-danger" onClick={this.ShowModal}>< i className="fa fa-trash"></i></Button>
                <Modal show={this.state.Show} onHide={this.HideModal}>
                    <Form onSubmit={this.handleSubmit}>
                        <Modal.Header closeButton>
                            <Modal.Title>Delete Dependency</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group>
                                <Form.Label>Are you sure you want to delete this dependency</Form.Label>
                                <input hidden type="number" name="dd_did"  value={this.state.did} onChange={()=> {}}/>
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.HideModal}>
                            Cancel
                            </Button>
                            <Button  type="submit" variant="dark">
                            Delete Dependency
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </React.Fragment>
        );
    }
}

export default DeleteDependency;