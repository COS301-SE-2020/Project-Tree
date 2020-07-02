import React from 'react';
import {Form, Modal, Button} from 'react-bootstrap'

function stringifyFormData(fd) {
    const data = {};
      for (let key of fd.keys()) {
        data[key] = fd.get(key);
    }
    return JSON.stringify(data, null, 2);
}

class UpdateTask extends React.Component{
    constructor(props) {
        super(props);
        this.state = { Show:false,                        
                        id: this.props.task.id,
                        name: '',
                        startDate: '', 
                        duration: '',
                        endDate: '', 
                    };
        this.ShowModal = this.ShowModal.bind(this);
        this.HideModal = this.HideModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.refreshState = this.refreshState.bind(this);
        this.setDuration = this.setDuration.bind(this);
    }

    refreshState(){
        this.setState(
            {
                id: this.props.task.id,
                name: this.props.task.name,
                startDate: this.props.task.startDate, 
                duration: this.props.task.duration,
                endDate: this.props.task.endDate, 
                description: this.props.task.description
            }
        )
    }

    ShowModal(){
        this.setState({ Show:true});
    }

    HideModal(){
        this.setState({ Show:false});
    }

    setDuration(e)
    {
        var duration
        var startDate
        console.log("TARGET:    ",e.target.value) 
        console.log(e.target)
        if(e.target.id == "ut_startDate")
        {
            startDate = e.target.value;
            duration = this.state.duration;
        }         
        else if(e.target.id == "ut_duration")
        {
            startDate = this.state.startDate;
            duration = e.target.value;
        }
        console.log("DURATION:  ",duration)

        var initialDate
        initialDate = new Date(startDate);
        var endDate = new Date(initialDate.getTime()+1000*60*60*24*duration);
        var dateWithDuration = [endDate.getFullYear(), endDate.getMonth()+1, endDate.getDate()]
        var edate = dateWithDuration;
        var formatMonth = edate[1];
        if(edate[1]<10){
            formatMonth = "0"+edate[1]
        }
        var formatDay = edate[2];
        if(edate[2]<10){
            formatDay = "0"+edate[2]
        }
    
        var formatDate = edate[0]+"-"+formatMonth+"-"+formatDay;
        console.log(formatDate)
       // this.setState({ endDate: formatDate })
        return formatDate
        //.state.endDate= formatDate;
    }

    async handleSubmit(event) {
        event.preventDefault();
        let data = new FormData(event.target);
        data = await stringifyFormData(data)
        console.log(data)

        const response = await fetch('/task/update', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
            body: data,
        });
        const body = await response.json();
        this.setState({ Show:false })
        //this.props.setProjectInfo(body.nodes.id)
    }

    render(){
        if(this.state.id !== this.props.task.id)
            this.refreshState();

        return (
            <React.Fragment>
                <Button className="btn-light" onClick={this.ShowModal}><i className="fa fa-edit"> </i> Edit </Button>
                <Modal show={this.state.Show} onHide={this.HideModal}>
                    <Form onSubmit={this.handleSubmit}>
                        <Modal.Header closeButton>
                            <Modal.Title>Update Task</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <Form.Group>
                            <input hidden type="number" id="ut_id" name="ut_id" value={this.state.id} onChange={()=>{}}/>
                        </Form.Group>
                        <Form.Group>  
                            <Form.Label>Name of task</Form.Label>
                            <Form.Control type='text' id="ut_name" name="ut_name" value={this.state.name} onChange={e => {  this.setState({ name: e.target.value }); this.value = this.state.name;}}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Start date</Form.Label>
                            <Form.Control type='date' id="ut_startDate" name="ut_startDate"onChange= {e=> {this.setState({ startDate: e.target.value })
                                    this.value = this.state.startDate 
                                    this.setState({ endDate: this.setDuration(e)})}} value={this.state.startDate} required/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label> Duration</Form.Label>
                            <Form.Control type='number' id="ut_duration" name="ut_duration" value={this.state.duration}  onChange= {e=> {this.setState({ duration: e.target.value })
                                this.value = this.state.duration 
                                this.setState({ endDate: this.setDuration(e)})}} value={this.state.duration} min='0' required/>
                        </Form.Group>
                        <Form.Group>
                             <Form.Label>End Date</Form.Label>
                            <Form.Control type='date' id="ut_endDate" name="ut_endDate" value={this.state.endDate} readOnly required/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description of task</Form.Label>
                            <Form.Control as="textarea" id="ut_description" name="ut_description" rows='3' value={this.state.description}
                            onChange={e => {
                                this.setState({ description: e.target.value });
                                this.value = this.state.description;
                            }}/>
                        </Form.Group>
                            <br />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.HideModal}>
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

export default UpdateTask;