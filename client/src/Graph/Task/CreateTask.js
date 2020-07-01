import React from 'react';
import {Form, Table, Modal, Button} from 'react-bootstrap'

function stringifyFormData(fd) {
    const data = {};
      for (let key of fd.keys()) {
        data[key] = fd.get(key);
    }
    return JSON.stringify(data, null, 2);
}

class CreateTask extends React.Component{
    constructor() {
        super();
        this.state = { Show:false };
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
        
        const response = await fetch('/project/add', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
            body: data,
        });
        const body = await response.json();
        this.setState({ Show:false })
        this.props.setProjectInfo(body.nodes.id);
    }

    render(){
        return (
            <React.Fragment>
                <Button className="my-2" variant="outline-dark" onClick={this.ShowModal} block>Create Project</Button>
                <Modal show={this.state.Show} onHide={this.HideModal}>
                    <Form onSubmit={this.handleSubmit}>
                        <Modal.Header closeButton>
                            <Modal.Title>Create Project</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group>
                                <Form.Label>Name of project</Form.Label>
                                <Form.Control type='text' id="cp_Name" name="cp_Name" required/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Description of project</Form.Label>
                                <Form.Control as="textarea" rows="3"type='text' id="cp_Description" name="cp_Description" required/>
                            </Form.Group>
                            <Table bordered hover>
                                <thead>
                                    <tr>
                                        <td className="text-center" colSpan="4">Project Permisions</td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td className="text-center">Create</td>
                                        <td className="text-center">Delete</td>
                                        <td className="text-center">Update</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Package Manager</td>
                                        <td className="text-center"><input type="checkbox" id='cp_pm_Create' name="cp_pm_Create"/></td>
                                        <td className="text-center"><input type="checkbox"  id='cp_pm_Delete' name="cp_pm_Delete"/></td>
                                        <td className="text-center"><input type="checkbox" id='cp_pm_Update' name="cp_pm_Update"/></td>
                                    </tr>
                                    <tr>
                                        <td>Responsible Person</td>
                                        <td className="text-center"><input type="checkbox" id='cp_rp_Create' name="cp_rp_Create"/></td>
                                        <td className="text-center"><input type="checkbox" id='cp_rp_Delete' name="cp_rp_Delete"/></td>
                                        <td className="text-center"><input type="checkbox" id='cp_rp_Update' name="cp_rp_Update"/></td>
                                    </tr>
                                    <tr>
                                        <td>Resource</td>
                                        <td className="text-center"><input type="checkbox" id='cp_r_Create' name="cp_r_Create"/></td>
                                        <td className="text-center"><input type="checkbox" id='cp_r_Delete' name="cp_r_Delete"/></td>
                                        <td className="text-center"><input type="checkbox" id='cp_r_Update' name="cp_r_Update"/></td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.HideModal}>
                            Cancel
                            </Button>
                            <Button  type="submit" variant="dark">
                            Create Project
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </React.Fragment>
        );
    }
}

export default CreateTask;