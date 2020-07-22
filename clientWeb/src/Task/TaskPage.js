import React from 'react';
import {
	Link
} from "react-router-dom";

class TaskPage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {form1:true, form2: true, form3:true, form4:true, form5:true, form6:true};
        this.toggle2 = this.toggle.bind(this);
    }

    toggle(form){
        switch(form){
            case 1:
                this.setState({form1 : !this.state.form1});
            break;

            case 2:
                this.setState({form2 : !this.state.form2});
            break;

            case 3:
                this.setState({form3 : !this.state.form3});
            break;

            case 4:
                this.setState({form4 : !this.state.form4});
            break;

            case 5:
                this.setState({form5 : !this.state.form5});
            break;

            case 6:
                this.setState({form6 : !this.state.form6});
            break;
    
            default:
                return;
        }   
    }

    render(){
        if(this.props.projectID == null)
        {
            return null;
        }

        return(
            <React.Fragment>
                <h1><u>Project Tree</u></h1>
                <div>
                    <h3 id="form1" onClick={() => this.toggle(1)}>Create Task {this.state.form1 ? "\u25BE" : "\u25B4"}</h3>
                    {this.state.form1 ? null : <CreateTaskForm />}
                    <h3 id="form2" onClick={() => this.toggle(2)}>Create Dependency {this.state.form2 ? "\u25BE" : "\u25B4"}</h3>
                    {this.state.form2 ? null : <CreateDependencyForm />}
                    <h3 id="form3" onClick={() => this.toggle(3)}>Delete Task {this.state.form3 ? "\u25BE" : "\u25B4"}</h3>
                    {this.state.form3 ? null : <DeleteTaskForm />}
                    <h3 id="form4" onClick={() => this.toggle(4)}>Delete Dependency {this.state.form4 ? "\u25BE" : "\u25B4"}</h3>
                    {this.state.form4 ? null : <DeleteDependencyForm />}
                    <h3 id="form5" onClick={() => this.toggle(5)}>Update Task {this.state.form5 ? "\u25BE" : "\u25B4"}</h3>
                    {this.state.form5 ? null : <UpdateTaskForm />}
                    <h3 id="form6" onClick={() => this.toggle(6)}>Update Dependency {this.state.form6 ? "\u25BE" : "\u25B4"}</h3>
                    {this.state.form6 ? null : <UpdateDependencyForm />}
                    <h3>{this.props.projectID}</h3>
                    <Link to="/project"><button onClick={()=>this.props.toggleGraphPage(null)}>Back</button></Link>
                </div>
            </React.Fragment>
        )
    }
}

class CreateTaskForm extends React.Component{
    render()
    {
        return(
            <form method='post' action='/task/add'>
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
        );
    }
}

///*value="0" onchange='setDuration()'*/

class CreateDependencyForm extends React.Component{
    render()
    {
        return(
            <form method='post' action='/dependency/add'>
                <label for='cd_firstTaskId'> First Task ID</label> <br/>
                <input type='number' min="0" name='cd_firstTaskId'/> <br/> <br/>
                <label for='cd_secondTaskId'> Second Task ID</label> <br/>
                <input type='number' min="0" name='cd_secondTaskId'/> <br/> <br/>
                <label for='cd_relationshipType'> Relationship Type</label> <br/> 
                <select name='cd_relationshipType'> <br/>
                    <option value='ss'>Start-Start</option>
                    <option value='fs'>Finish-Start</option>
                </select> <br/> <br/>
                <label for='cd_dependencyDuration'> Dependency Duration</label> <br/>
                <input type='number' name='cd_dependencyDuration' value='0'/> <br/>
                <input type='submit' value='Submit'/>
            </form>
        );
    }
}

class DeleteTaskForm extends React.Component{
    render()
    {
        return(
            <form action="/task/delete" method="post">
                <label for="fname">Enter ID to delete:</label><br/>
                <input type="number" name="id"/><br/>
                <input type="submit" value="Submit"/>
            </form>
        );
    }
}

class DeleteDependencyForm extends React.Component{
    render()
    {
        return(
            <form action="/dependency/delete" method="post">
                <label for="fname">Enter 1st ID dependency to delete:</label><br/>
                <input type="number" name="dep1"/><br/>
                <label for="fname">Enter 2nd ID dependency to delete:</label><br/>
                <input type="number" name="dep2"/><br/>
                <input type="submit" value="Submit"/>
            </form>
        );
    }
}

class UpdateTaskForm extends React.Component{
    render()
    {
        return(
            <div>
                <form action="/" method="get">
                    <label for="ut_id_select">Select Task by ID:</label><br/>
                    <input name="ut_id_select" id="ut_id_select" type="number" min="0" onchange="selectTask()"/>
                    <button type="submit">Select</button>
                </form>
                <form id="extraForm" action="/task/update" method="post">
                    <input name="ut_id" id="ut_id" type="number" min="0" hidden/>
                    <label for="ut_name">Name:</label><br/>
                    <input name="ut_name" id="ut_name" type="text"/>
                    <br/><br/>
                    <label for="ut_startDate">Start Date:</label><br/>
                    <input name="ut_startDate" id="ut_startDate" type="date" onchange='setDuration()'/>
                    <br/><br/>
                    <label for="ut_duration">Duration:</label><br/>
                    <input name="ut_duration" id="ut_duration" type="number" onchange='setDuration()'/>
                    <br/><br/>
                    <label for="ut_endDate">End Date:</label><br/>
                    <input name="ut_endDate" id="ut_endDate" type="date" readonly/>
                    <br/><br/>
                    <label for="ut_description">Description:</label><br/>
                    <textarea name="ut_description" id="ut_description" cols="30" rows="10"></textarea>
                    <br/>
                    <button type="submit">Submit</button>
                </form>
            </div>
        );
    }
}

class UpdateDependencyForm extends React.Component{
    render()
    {
        return(
            <form action="/dependency/update" method="post">
                <p>Leave a field blank to not change it</p>
                <label for="ud_Fid">Select First Task by ID:</label><br/>
                <input name="ud_Fid" type="number" min="0"/>
                <br/><br/>
                <label for="ud_Sid">Select Second Task by ID:</label><br/>
                <input name="ud_Sid" type="number" min="0"/>
                <br/><br/>
                <label for="ud_relationshipType">Select Relationship Type:</label><br/>
                <select name="ud_relationshipType">
                    <option value="ss">Start-Start</option>
                    <option value="fs">Finish-Start</option>
                </select>
                <br/><br/>
                <label for="ud_duration">Duration:</label><br/>
                <input name="ud_duration" type="number" min="0"/>
                <br/>
                <button type="submit">Submit</button>
            </form>
        );
    }
}

export default TaskPage;