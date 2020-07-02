import React from 'react';
import { Table, Button, Container, Row, Col } from 'react-bootstrap'
import { Link } from "react-router-dom";
import Graph from './Graph'
import CreateDependency from './Dependency/CreateDependency'
import UpdateDependency from './Dependency/UpdateDependency'
import DeleteDependency from './Dependency/DeleteDependency'

class GraphPage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {task:null, dependency:null, nodes:null, links:null, source:null, target:null};
        this.toggleSidebar = this.toggleSidebar.bind(this);
        this.toggleCreateDependency = this.toggleCreateDependency.bind(this);
    }

    async componentDidMount(){
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

    toggleCreateDependency(new_source_targetID){
        if(new_source_targetID == null)
        {
            this.setState({source:null, target:null});
            return;
        }

        var source_target
        for(var x=0; x<this.state.nodes.length; x++)
        {
            if(this.state.nodes[x].id === new_source_targetID){
                source_target = this.state.nodes[x];
            }
        }
        
        if(this.state.source === null)
        {
            this.setState({source:source_target});
        }

        else{
            if(this.state.source.id === new_source_targetID)
            {
                this.setState({source:null, target:null})
            }
            else{
                this.setState({target:source_target});
            }
        }
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

        else{
            this.setState({task:null, dependency:null});
        }
    }


    render(){
        var dependency;
        if(this.state.source !== null && this.state.target !== null){
            dependency = this.state.source.name+"→"+this.state.target.name;
        }

        else if(this.state.source !== null){
            dependency = this.state.source.name+"→";
        }

        else{
            dependency = null;
        }

        return(
            <React.Fragment>
                <Container fluid >
                <Row> 
                        <Col className="text-center block-example border border-secondary bg-light">
                            <br/> 
                            <ProjectDetails toggleGraphPage={this.props.toggleGraphPage} project={this.props.project}/> 
                            <Button size="sm" variant="secondary" block >Create Task</Button>
                            <CreateDependency project={this.props.project} source={this.state.source} target={this.state.target}/>
                            {dependency}
                            {this.state.source != null ? <Button onClick={()=>this.toggleCreateDependency(null)}>X</Button> : null}
                            <Button size="sm" variant="secondary" block >Display Critical Path - Under Construction</Button>
                            <br/> {this.state.task !== null ? <TaskSidebar task={this.state.task} toggleSidebar={this.toggleSidebar}/> : null}
                            {this.state.dependency !== null ? <DependencySidebar project={this.props.project} dependency={this.state.dependency} nodes={this.state.nodes} toggleSidebar={this.toggleSidebar}/> : null}
                        </Col>
                        <Col xs={9} className="align-items-center text-center">
                            <br/> {this.state.nodes!==null?<Graph nodes={this.state.nodes} links={this.state.links} toggleCreateDependency={this.toggleCreateDependency} toggleSidebar={this.toggleSidebar}/>:null}
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
                <Container>
                    <Row>
                        <Col>
                            <br/> <Link to="/project"><Button variant="light" size="sm" className="text-left align-items-top"><i className="fa fa-arrow-left"></i></Button></Link> 
                        </Col>
                        <Col xs={6} className="text-center">
                            <h3>{this.props.project.name}</h3>
                            <p>{this.props.project.description}</p>
                        </Col>
                        <Col>
                        </Col>
                    </Row>
                </Container>
                
                <Button variant="secondary" block size="sm" onClick={this.togglePermissions}>Permissions  {this.state.permissions ? "\u25B4":"\u25BE"}</Button>  
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
                <Container className="text-white text-center rounded mb-0 border border-secondary bg-dark py-2">
                    <Row>
                        <Col> <Button className="btn-danger"><i className="fa fa-trash"></i></Button></Col>
                        <Col xs={8}><h1>{this.props.task.name}</h1></Col>
                        <Col></Col>
                    </Row>
                    <Row>
                        <Col><p>{this.props.task.description}</p></Col>
                    </Row>
                    <Row>
                        <Col><p>Start Date: {startDate}</p></Col>
                    </Row>
                    <Row>
                        <Col><p>End Date: {endDate}</p></Col>
                    </Row>
                    <Row>
                        <Col><p>Duration: {this.props.task.duration}</p></Col>
                    </Row>
                    <Row>
                        <Col><Button className="btn-light" onClick={this.ShowModal}><i className="fa fa-edit"> </i> Edit </Button></Col>
                    </Row>
                </Container>
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
                <Container className="text-white text-center rounded mb-0 border border-secondary bg-dark py-2">
                    <Row>
                        <Col> 
                            <DeleteDependency dependency={this.props.dependency} />
                        </Col>
                        <Col xs={8} ><h2>{start+"→"+end}</h2></Col>
                        <Col></Col>
                    </Row>
                    <Row>
                        <Col><p>{this.props.dependency.relationshipType === "fs" ? "Finish-Start" : "Start-Start"}</p></Col>
                    </Row>
                    <Row>
                        <Col><p>Duration: {this.props.dependency.duration}</p></Col>
                    </Row>
                    <Row>
                        <Col>
                            <UpdateDependency project={this.props.project} dependency={this.props.dependency}/>
                        </Col>
                    </Row>
                </Container>
            </React.Fragment>
        )
    }
}

export default GraphPage;