import React from 'react';
import {Form, Modal, Button} from 'react-bootstrap'

function stringifyFormData(fd) {
    const data = {};
      for (let key of fd.keys()) {
        data[key] = fd.get(key);
    }
    return JSON.stringify(data, null, 2);
}

class DeleteTask extends React.Component{
    constructor(props) {
        super(props);
        this.state = 
        { Show:false, 
            id: this.props.task.id
        };
        this.ShowModal = this.ShowModal.bind(this);
        this.HideModal = this.HideModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    ShowModal(){
        console.log("hello")
        this.setState({ Show:true});
    }

    HideModal(){
        this.setState({ Show:false});
    }

    async handleSubmit(event) {
        event.preventDefault();
        let data = new FormData(event.target);
        data = await stringifyFormData(data)
        console.log(data)

        const response = await fetch('/task/delete', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
            body: data,
        });
        this.setState({ Show:false })
        console.log(response.body)
    }

    render(){
        return (
            <React.Fragment>
                <Button className="btn-danger" onClick={this.ShowModal}><i className="fa fa-trash"></i></Button>
                <Modal show={this.state.Show} onHide={this.HideModal}>
                    <Form onSubmit={this.handleSubmit}>
                        <Modal.Header closeButton>
                            <Modal.Title>Delete Task</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group>        
                                <input hidden type="number" name="id" value={this.state.id} onChange={()=> {}}/>
                                <p> Are you Sure </p>
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.HideModal}>
                            Cancel
                            </Button>
                            <Button  type="submit" variant="dark">
                            Delete Task
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </React.Fragment>
        );
    }
}

export default DeleteTask;