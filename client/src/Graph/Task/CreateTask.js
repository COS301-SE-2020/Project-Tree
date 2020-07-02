import React from 'react';
import {Form, Table, Modal, Button} from 'react-bootstrap';


function stringifyFormData(fd) {
    const data = {};
      for (let key of fd.keys()) {
        data[key] = fd.get(key);
    }
    return JSON.stringify(data, null, 2);
}



class CreateTask extends React.Component{
    constructor(props) {
        super(props);
        this.state = { Show:false ,
            id: this.props.project.id,
            startDate: 0,
            duration: 0,
            endDate: 0
        };
        this.ShowModal = this.ShowModal.bind(this);
        this.HideModal = this.HideModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setDuration = this.setDuration.bind(this);
    }

    ShowModal(){
        this.setState({ Show:true });
    }

    HideModal(){
        this.setState({ Show:false });
    }

    
    setDuration(e)
    {
        var duration
        var startDate
        console.log("TARGET:    ",e.target.value) 
        console.log(e.target)
        if(e.target.id == "ct_startDate")
        {
            startDate = e.target.value;
            duration = this.state.duration;
        }         
        else if(e.target.id == "ct_duration")
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
        console.log(data);
        
        const response = await fetch('/task/add', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
            body: data,
        }); 
        const body = await response.json();
        this.setState({ Show:false })
       // this.props.setProjectInfo(body.nodes.id);
    }

    
/* <form method='post' action='/task/add'>
                <label for='ct_taskName'> Name of task</label><br/>
                <input type='text' name='ct_taskName'/> <br/><br/>
                <label for='ct_startDate'> Start Date</label><br/>
                <input type='date' name='ct_startDate' id='ct_startDate' onchange='setDuration()'/>  <br/><br/>
                <label for='ct_duration'> Duration (Days) </label><br/>
                <input type='number' name='ct_duration' id='ct_duration' min='0' required/> <br/><br/>
                <label for='ct_endDate'> End date </label><br/>
                <input type='date' name='ct_endDate' id='ct_endDate' readonly/> <br/><br/>
                <label for='ct_description'> Description </label><br/>
                <textarea name="ct_description" cols='30' rows='10'></textarea><br/>
                <label for='ct_resPersonId'> Responsible Person </label><br/>
                    <input type='number' min='0' name="ct_resPersonId"/><br/><br/>
                    <label for='ct_pacManId'> Package Manager </label><br/>
                    <input type='number' min='0' name="ct_pacManId"/><br/><br/>
                    <label for='ct_resourceId'> Resources </label><br/>
                    <input type='text' min='0' name="ct_resourceId"/><br/><br/>
                <input type='submit' value='Submit'/>
            </form>
 */

    render(){
        return (
            <React.Fragment>
                <Button className="my-2" variant="outline-dark" onClick={this.ShowModal} block>Create Task</Button>
                <Modal show={this.state.Show} onHide={this.HideModal}>
                    <Form onSubmit={this.handleSubmit}>
                        <Modal.Header closeButton>
                            <Modal.Title>Create Task</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group>
                                <Form.Label>Name of task</Form.Label>
                                <Form.Control type='text' id="cp_Name" name="cp_Name" required/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Description of task</Form.Label>
                                <Form.Control as='textarea' name='ct_description' id='ct_description' min='0' required/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Start date of task</Form.Label>{
                                /* this.setState({ description: e.target.value });
                                this.value = this.state.description; */}
                                <Form.Control type='date' name='ct_startDate' id='ct_startDate' onChange= {e=> {this.setState({ startDate: e.target.value })
                                    this.value = this.state.startDate 
                                    this.setState({ endDate: this.setDuration(e)})}} value={this.state.startDate} required/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Duration</Form.Label>
                                <Form.Control type='number' name='ct_duration' id='ct_duration' onChange= {e=> {this.setState({ duration: e.target.value })
                                        this.value = this.state.duration 
                                        this.setState({ endDate: this.setDuration(e)})}} value={this.state.duration} min='0' required/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>End date of task</Form.Label>
                                <Form.Control type='date' name='ct_endDate' id='ct_endDate' value={this.state.endDate} readOnly required/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Responsible Person </Form.Label>
                                <Form.Control type='number' min='0' name="ct_resPersonId" required/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Package Manager</Form.Label>
                                <Form.Control type='number' min='0' name="ct_pacManId" required/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Resources </Form.Label>
                                <Form.Control type='number' min='0' name="ct_resourceId" required/>
                            </Form.Group>
                            <Form.Group>
                                <input hidden type="number" id="ct_pid" name="ct_pid" value={this.state.id} onChange={()=> {}}/>
                            </Form.Group>
                           {/*  <Table bordered hover>
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
                            </Table> */}
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