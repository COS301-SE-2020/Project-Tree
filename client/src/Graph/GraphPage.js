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
		//console.log(body)
        if (response.status !== 200) throw Error(body.message);
        
        let nodes=[]
        for(var x = 0; x < body.tasks.length; x++){
            nodes.push([
                {
                    name:body.tasks[x].record._fields[0].properties.name,
                    id:body.tasks[x].record._fields[0].identity.low,
                }
            ])
        }

        let links = []
        for(var y = 0; y < body.rels.length; y++){
            links.push([
                {
                    source:body.rels[y].record._fields[0].start.low,
                    target:body.rels[y].record._fields[0].end.low,
                    id:body.rels[y].record._fields[0].identity.low,
                    label:body.rels[y].record._fields[0].properties.relationshipType
                }
            ])
        }

        this.setState({nodes:nodes, links:links})
    }

    toggleSidebar(newTask, newDependency){
        if(newTask === this.state.task){
            newTask = null;
        }
        if(newDependency === this.state.dependency){
            newDependency = null;
        }

        this.setState({task:newTask, dependency:newDependency});
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
                            <button>Display Critical Path - Under Construction</button>
                            <button onClick={()=>this.toggleSidebar(1, null)}>View Task Sidebar</button> 
                            <button onClick={()=>this.toggleSidebar(null, 1)}>View Dependency Sidebar</button>
                        </Col>
                        <Col>
                            {this.state.nodes!==null?<Graph nodes={this.state.nodes} links={this.state.links}/>:null}
                        </Col>
                        <Col>
                            {this.state.task !== null ? <TaskSidebar /> : null}
                            {this.state.dependency !== null ? <DependencySidebar /> : null}
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
        return(
            <React.Fragment>
                <h1>Task A</h1>
                <p>Description</p>
                <p>Start Date</p>
                <p>Start Date</p>
                <p>Duration</p>
                <button>Edit Task</button>
                <button>Delete Task</button>
            </React.Fragment>
        )
    }
}

class DependencySidebar extends React.Component{
    render(){
        return(
            <React.Fragment>
                <h1>Task A-Task B</h1>
                <p>fs</p>
                <p>Duration</p>
                <button>Edit Dependency</button>
                <button>Delete Dependency</button>
            </React.Fragment>
        )
    }
}

export default GraphPage;