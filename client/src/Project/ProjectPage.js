import React from 'react';
import { Table, Button, Container, Row, Col } from 'react-bootstrap'
import { Link } from "react-router-dom";

import CreateProject from './CreateProject'
import UpdateProject from './UpdateProject'
import DeleteProject from './DeleteProject'


class ProjectPage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {projects:null, project:null};
        this.toggleSideBar = this.toggleSideBar.bind(this);
        this.setProjectInfo = this.setProjectInfo.bind(this);
        
    }

    toggleSideBar(newProject)
    {
        if(this.state.project === newProject)
        {
            this.setState({project:null})
        }

        else
        {
            this.setState({project:newProject})
        }
    }

    async componentDidMount() {
		const response = await fetch('/projectInfo');
		const body = await response.json();
        if (response.status !== 200) throw Error(body.message);

        this.setState({projects: body.nodes})
    }

    async setProjectInfo(newProject){
        const response = await fetch('/projectInfo');
		const body = await response.json();
        if (response.status !== 200) throw Error(body.message);

        if(newProject !== undefined){
            var index;
            for(var x=0; x<body.nodes.length; x++)
            {
                if(body.nodes[x].id === newProject)
                {
                    index = x;
                }
            }

            this.setState({projects: body.nodes, project: body.nodes[index]})
        }

        else{
            this.setState({projects: body.nodes}) 
        }       
    }

    render(){
        return(
            <React.Fragment>
                <Container fluid>
                    <Row>
                        <Col> <br/> <ProjectList projects={this.state.projects} toggleSideBar={this.toggleSideBar} /> <br/> <CreateProject setProjectInfo={this.setProjectInfo}/> </Col>
                        <Col xs={6} className="text-center"> <br/>Under construction - JointJS</Col>
                        <Col className="text-center"> <br/> {this.state.project != null ? 
                        <Sidebar toggleSideBar={this.toggleSideBar} setProjectInfo={this.setProjectInfo} toggleGraphPage={this.props.toggleGraphPage} project={this.state.project}/> : null} </Col>
                    </Row>
                </Container>
            </React.Fragment>
        )
    }
}

class ProjectList extends React.Component{
    render(){
        if(this.props.projects === null){return null;}
        const projects = this.props.projects;
        const listItems = projects.map((project, i) =>
          <Button key={i} onClick={() => this.props.toggleSideBar(project)} variant="secondary" size="sm" block>
            {project.name}
          </Button>
        );

        return (
            <Container>
                <Row> {listItems} </Row>
            </Container>
        );
    }
}

class Sidebar extends React.Component{
    constructor(props) {
        super(props);
        this.state = {permissions:false, hidden:false};
        this.togglePermissions = this.togglePermissions.bind(this);
        this.permissionsTable = this.permissionsTable.bind(this);
    }

    togglePermissions(){
        this.setState({permissions:!this.state.permissions})
    }
    
    permissionsTable(){
        return(
            <Table striped bordered size="sm" variant="light">
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

    render()
    {
        if(this.props.project == null)
        {
            return null;
        }
        
        return(
            <React.Fragment>
                <Container className="block-example border border-secondary bg-light">
                    <Row className="align-items-center bg-dark">
                        <Col className="text-center"> <DeleteProject project={this.props.project} setProjectInfo={this.props.setProjectInfo} toggleSideBar={this.props.toggleSideBar}/> </Col>
                        <Col className="text-white"> {this.props.project.name}  </Col>
                        <Col className="text-center" ><Button className="btn-dark" onClick={()=>this.props.toggleSideBar(null)}><i className="fa fa-close"></i></Button></Col>
                    </Row> 
                    <Row className="align-items-center">
                        <Col><p>{this.props.project.description}</p> </Col>
                    </Row> 
                    <Row className="align-items-center" >
                        <Col className="text-center" >
                        <Button variant="secondary" onClick={this.togglePermissions}>Permissions  {this.state.permissions ? "\u25B4":"\u25BE"}</Button> <br/> <br/> 
                        {this.state.permissions? <this.permissionsTable /> : null}</Col>
                    </Row> 
                    <Row className="align-items-center">
                        <Col> </Col>
                        <Col xs={6} className="text-center"><Link to="/graph"><Button onClick={()=>this.props.toggleGraphPage(this.props.project.id)} variant="outline-dark" size="md">View Project</Button></Link></Col>
                        <Col></Col>
                    </Row> <br/>
                    <Row className="align-items-center">
                        <Col> </Col>

                        <Col xs={6} className="text-center">
                        <UpdateProject project={this.props.project} setProjectInfo={this.props.setProjectInfo}/></Col>
                        <Col></Col>
                    </Row>
                    <br/> 
                </Container>
            </React.Fragment>
        )
    }
}

export default ProjectPage;