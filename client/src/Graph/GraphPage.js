import React from 'react';
import { Table, Button, Container, Row, Col } from 'react-bootstrap'
import { Link } from "react-router-dom";
import Graph from './Graph'

class GraphPage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {task:null, dependency:null, nodes:null, links:null};
        this.toggleSidebar = this.toggleSidebar.bind(this);
    }

    async componentDidMount(){
        if(this.props.project===null) return
        const response = await fetch('/getProject',{
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
            body:JSON.stringify({ id:this.props.project.id })
        });
		const body = await response.json();
        if (response.status !== 200) throw Error(body.message);

        this.setState({nodes:body.tasks, links:body.rels})
    }

    toggleSidebar(newTaskID, newDependencyID){
        var newTask = null;
        var newDependency = null;
        var x;

        if(newTaskID != null)
        {
            for(x=0; x<this.state.nodes.length; x++)
            {
                if(this.state.nodes[x].id === newTaskID){
                    newTask = this.state.nodes[x];
                }
            }
            
            this.setState({task:newTask, dependency:newDependency});
        }

        else if(newDependencyID != null)
        {
            for(x=0; x<this.state.links.length; x++)
            {
                if(this.state.links[x].id === newDependencyID){
                    newDependency = this.state.links[x];  
                }
            }
            this.setState({task:newTask, dependency:newDependency});
        }
    }


    render(){
        if(this.props.project == null){
            return(
                <React.Fragment>
                    <h1>You shouldn't be here</h1>
                    <Link to="/project"><button onClick={()=>this.props.toggleGraphPage(null)}>Back</button></Link>
                </React.Fragment>
            )
        }

        return(
            <React.Fragment>
                <Container>
                    <Row>
                        <Col>
                            <ProjectDetails project={this.props.project}/> <br/>
                            <Link to="/project"><button onClick={()=>this.props.toggleGraphPage(null)}>Back</button></Link>
                            <button>Create Task</button>
                            <button>Create Dependency</button>
                            <button>Display Critical Path - Under Construction</button>
                            <button onClick={()=>this.toggleSidebar(1, null)}>View Task Sidebar</button> 
                            <button onClick={()=>this.toggleSidebar(null, 1)}>View Dependency Sidebar</button>
                            <br/><br/>
                            <hr/>
                            <br/><br/>
                            {this.state.task !== null ? <TaskSidebar task={this.state.task}/> : null}
                            {this.state.dependency !== null ? <DependencySidebar dependency={this.state.dependency} nodes={this.state.nodes}/> : null}
                        </Col>
                        <Col>
                            {this.state.nodes!==null?<Graph toggleSidebar={this.toggleSidebar} nodes={this.state.nodes} links={this.state.links}/>:null}
                        </Col>
                    </Row>
                </Container>
            </React.Fragment>
        )
    }

}

class ProjectDetails extends React.Component{
    constructor(props) {
        super(props);
        this.state = {permissions:false};
        this.togglePermissions = this.togglePermissions.bind(this);
        this.permissionsTable = this.permissionsTable.bind(this);
    }

    togglePermissions(){
        this.setState({permissions:!this.state.permissions})
    }

    permissionsTable(){
        return(
            <Table className="mt-2" striped bordered size="sm" variant="light">
                <tbody>
                    <tr>
                        <td></td>
                        <td>Create </td>
                        <td>Delete </td>
                        <td>Update </td>
                    </tr>
                    <tr>
                        <td>Package Manager</td>
                        <td>{this.props.project.permissions[0] === true ? "X" : null}</td>
                        <td>{this.props.project.permissions[1] === true ? "X" : null}</td>
                        <td>{this.props.project.permissions[2] === true ? "X" : null}</td>
                    </tr>
                    <tr>
                        <td>Responsible Person</td>
                        <td>{this.props.project.permissions[3] === true ? "X" : null}</td>
                        <td>{this.props.project.permissions[4] === true ? "X" : null}</td>
                        <td>{this.props.project.permissions[5] === true ? "X" : null}</td>
                    </tr>
                    <tr>
                        <td>Resource</td>
                        <td>{this.props.project.permissions[6] === true ? "X" : null}</td>
                        <td>{this.props.project.permissions[7] === true ? "X" : null}</td>
                        <td>{this.props.project.permissions[8] === true ? "X" : null}</td>
                    </tr>
                </tbody>
            </Table>
        );
    }

    render(){
        return(
            <React.Fragment>
                <h3>{this.props.project.name}</h3>
                <p>{this.props.project.description}</p>
                <Button variant="secondary" onClick={this.togglePermissions}>Permissions  {this.state.permissions ? "\u25B4":"\u25BE"}</Button>
                {this.state.permissions? <this.permissionsTable /> : null}
            </React.Fragment>
        )
    }
}

class TaskSidebar extends React.Component{
    render(){
        let startDate = this.props.task.startDate.year.low+"-"+this.props.task.startDate.month.low+"-"+this.props.task.startDate.day.low
        let endDate = this.props.task.endDate.year.low+"-"+this.props.task.endDate.month.low+"-"+this.props.task.endDate.day.low
    
        return(
            <React.Fragment>
                <h1>{this.props.task.name}</h1>
                <p>{this.props.task.description}</p>
                <p>Start Date: {startDate}</p>
                <p>End Date: {endDate}</p>
                <p>Duration: {this.props.task.duration}</p>
                <button>Edit Task</button>
                <button>Delete Task</button>
            </React.Fragment>
        )
    }
}

class DependencySidebar extends React.Component{
    render(){

        var start;
        var end;

        for(var x=0; x<this.props.nodes.length; x++)
        {
            if(this.props.nodes[x].id === this.props.dependency.source){
                start = this.props.nodes[x].name
            }

            else if(this.props.nodes[x].id === this.props.dependency.target){
                end = this.props.nodes[x].name
            }
        }


        return(
            <React.Fragment>
                <h1>{start+"→"+end}</h1>
                <p>{this.props.dependency.relationshipType === "fs" ? "Finish-Start" : "Start-Start"}</p>
                <p>{this.props.dependency.duration}</p>
                <button>Edit Dependency</button>
                <button>Delete Dependency</button>
            </React.Fragment>
        )
    }
}

export default GraphPage;