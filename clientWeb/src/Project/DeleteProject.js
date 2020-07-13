import React from 'react';
import {Form, Modal, Button} from 'react-bootstrap'
import $ from 'jquery';

function stringifyFormData(fd){
    const data = {};
    for (let key of fd.keys()){
        data[key] = fd.get(key);
    }
    return JSON.stringify(data, null, 2);
}

class DeleteProject extends React.Component{
    constructor(props){
        super(props);
        this.state = { 
            show:false, 
            id: this.props.project.id
        };
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    showModal(){
        this.setState({ show:true });
    }

    hideModal(){
        this.setState({ show:false });
    }

    handleSubmit(event){
        event.preventDefault();
        let data = stringifyFormData(new FormData(event.target));
        $.post( "/project/delete", JSON.parse(data) , response => {
            this.props.setProjectInfo(response);
            this.props.toggleSideBar(null);
        })
        .done(() => {
            this.setState({ show:false });
        })
        .fail(() => {
            alert( "Unable to delete project" );
        })
        .always(() => {
            //alert( "finished" );
        });
    }

    render(){
        return (
            <React.Fragment>
                <Button className="btn-danger" onClick={this.showModal}>< i className="fa fa-trash"></i></Button>
                <Modal show={this.state.show} onHide={this.hideModal}>
                    <Form onSubmit={this.handleSubmit}>
                        <Modal.Header closeButton>
                            <Modal.Title>Delete Project</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group>
                                <input hidden type="number" name="dp_id" value={this.state.id} onChange={()=> {}}/>
                                <p>Are you sure you want to delete this project</p>
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.hideModal}>
                                Cancel
                            </Button>
                            <Button  type="submit" variant="dark">
                                Delete Project
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </React.Fragment>
        );
    }
}

export default DeleteProject;