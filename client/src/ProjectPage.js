import React from 'react';
import {Form, Table, Modal, Button, Container, Row, Col} from 'react-bootstrap'

import {
	Link
} from "react-router-dom";

function stringifyFormData(fd) {
    const data = {};
      for (let key of fd.keys()) {
        data[key] = fd.get(key);
    }
    return JSON.stringify(data, null, 2);
}

class ProjectPage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {form1:true, form2:true, form3:true, form4:true, projects:null, project:null, refresh:false};
        this.projectList = this.projectList.bind(this);
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
    
            default:
                return;
        }   
    }

    async componentDidMount() {
		const response = await fetch('/projectInfo');
		const body = await response.json();
        if (response.status !== 200) throw Error(body.message);

        this.setState({projects: body.nodes})
    }

    async setProjectInfo(){
        const response = await fetch('/projectInfo');
		const body = await response.json();
        if (response.status !== 200) throw Error(body.message);

        this.setState({projects: body.nodes})
    }

    projectList(){
        if(this.state.projects === null){return null;}
        const projects = this.state.projects;
        const listItems = projects.map((project, i) =>
          <Button key={i} onClick={() => this.toggleSideBar(project)} variant="secondary" size="sm" block>
            {project.name}
          </Button>
        );

        return (
            <Container>
                <Row> {listItems} </Row>
            </Container>
        );
    }

    render(){
        return(
            <React.Fragment>
                <Container fluid>
                    <Row>
                        <Col> <br/> <ProjectList projects={this.state.projects} toggleSideBar={this.toggleSideBar} /> <br/> <CreateProject setProjectInfo={this.setProjectInfo}/> </Col>
                        <Col xs={6} className="text-center"> <br/>Under construction - JointJS</Col>
                        <Col className="text-center"> <br/> {this.state.project != null ? 
                        <Sidebar toggleSideBar={this.toggleSideBar} setProjectInfo={this.setProjectInfo} toggleGraphPage={this.props.toggleGraphPage} toggleSideBar={this.toggleSideBar} project={this.state.project}/> : null} </Col>
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
        console.log(this.props.project.permissions[8]);
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
                        <td>{this.props.project.permissions[0] ? "X" : null}</td>
                        <td>{this.props.project.permissions[1] ? "X" : null}</td>
                        <td>{this.props.project.permissions[2] ? "X" : null}</td>
                    </tr>
                    <tr>
                        <td>Responsible Person</td>
                        <td>{this.props.project.permissions[3] ? "X" : null}</td>
                        <td>{this.props.project.permissions[4] ? "X" : null}</td>
                        <td>{this.props.project.permissions[5] ? "X" : null}</td>
                    </tr>
                    <tr>
                        <td>Resource</td>
                        <td>{this.props.project.permissions[6] ? "X" : null}</td>
                        <td>{this.props.project.permissions[7] ? "X" : null}</td>
                        <td>{this.props.project.permissions[8] ? "X" : null}</td>
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
                <Container className="block-example border border-secondary">
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
                        <UpdateProject project={this.props.project} setProjectInfo={this.props.setProjectInfo} toggleSideBar={this.props.toggleSideBar}/></Col>
                        <Col></Col>
                    </Row>
                    <br/> 
                </Container>
            </React.Fragment>
        )
    }
}

class CreateProject extends React.Component{
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

        const response = await fetch('/project/add', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
            body: data,
        });
        this.setState({ Show:false })
        console.log(response)

        this.props.setProjectInfo();
    }

    render(){
        return (
            <React.Fragment>
                <Button variant="outline-dark" onClick={this.ShowModal} block>Create Project</Button>
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
                                <Form.Control as="textarea" rows="3"type='text' id="cp_Description" name="cp_DescriptionName" required/>
                            </Form.Group>
                            <Table>
                                <thead>
                                    <tr>
                                        <td colSpan="4">Project Permisions</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td></td>
                                        <td>Create</td>
                                        <td>Delete</td>
                                        <td>Update</td>
                                    </tr>
                                    <tr>
                                        <td>Package Manager</td>
                                        <td><input type="checkbox" id='cp_pm_Create' name="cp_pm_Create"/></td>
                                        <td><input type="checkbox"  id='cp_pm_Delete' name="cp_pm_Delete"/></td>
                                        <td><input type="checkbox" id='cp_pm_Update' name="cp_pm_Update"/></td>
                                    </tr>
                                    <tr>
                                        <td>Responsible Person</td>
                                        <td><input type="checkbox" id='cp_rp_Create' name="cp_rp_Create"/></td>
                                        <td><input type="checkbox" id='cp_rp_Delete' name="cp_rp_Delete"/></td>
                                        <td><input type="checkbox" id='cp_rp_Update' name="cp_rp_Update"/></td>
                                    </tr>
                                    <tr>
                                        <td>Resource</td>
                                        <td><input type="checkbox" id='cp_r_Create' name="cp_r_Create"/></td>
                                        <td><input type="checkbox" id='cp_r_Delete' name="cp_r_Delete"/></td>
                                        <td><input type="checkbox" id='cp_r_Update' name="cp_r_Update"/></td>
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

class UpdateProject extends React.Component{
    constructor(props) {
        super(props);
        this.state = { Show:false, 
                        id: this.props.project.id,
                        name: this.props.project.name, 
                        description: this.props.project.description,
                        up_pm_Create: this.props.project.permissions[0] == 'true',
                        up_pm_Delete: this.props.project.permissions[1] == 'true',
                        up_pm_Update: this.props.project.permissions[2] == 'true',
                        up_rp_Create: this.props.project.permissions[3] == 'true',
                        up_rp_Delete: this.props.project.permissions[4] == 'true',
                        up_rp_Update: this.props.project.permissions[5] == 'true',
                        up_r_Create: this.props.project.permissions[6] == 'true',
                        up_r_Delete: this.props.project.permissions[7] == 'true',
                        up_r_Update: this.props.project.permissions[8] == 'true'
                    };
        this.ShowModal = this.ShowModal.bind(this);
        this.HideModal = this.HideModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    ShowModal(){
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

        const response = await fetch('/project/update', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
            body: data,
        });
        this.setState({ Show:false })
        this.props.setProjectInfo()
        this.props.toggleSideBar(null)
        console.log(response.body)
    }

    render(){
        return (
            <React.Fragment>
                <Button className="btn-dark" onClick={this.ShowModal}><i className="fa fa-edit"> </i> Update </Button>
                <Modal show={this.state.Show} onHide={this.HideModal}>
                    <form onSubmit={this.handleSubmit}>
                        <Modal.Header closeButton>
                            <Modal.Title>Update Project</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <input hidden type="number" id="up_id" name="up_id" value={this.state.id} onChange={()=>{}}/>
                            <label> Name of project<br /><input type='text' id="up_name" name="up_name" value={this.state.name}
                                                                                                        onChange={e => {
                                                                                                            this.setState({ name: e.target.value });
                                                                                                            this.value = this.state.name;
                                                                                                        }}/></label><br/><br/>
                            <label> Description of project<br /><textarea id="up_description" name="up_description" cols='30' rows='10' value={this.state.description}
                                                                                                        onChange={e => {
                                                                                                            this.setState({ description: e.target.value });
                                                                                                            this.value = this.state.description;
                                                                                                        }}></textarea></label><br/>
                            <br />
                            <table>
                                <thead>
                                    <tr>
                                        <th colSpan="4"><u>Project Permisions</u></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td></td>
                                        <td>Create</td>
                                        <td>Delete</td>
                                        <td>Update</td>
                                    </tr>
                                    <tr>
                                        <td>Package Manager</td>
                                        <td><input type="checkbox" id='up_pm_Create' name='up_pm_Create' checked={this.state.up_pm_Create}
                                                                                                            onChange={e => {
                                                                                                                this.setState({ up_pm_Create: e.target.checked });
                                                                                                                this.checked = this.state.up_pm_Create;
                                                                                                            }}/></td>
                                        <td><input type="checkbox" id='up_pm_Delete' name='up_pm_Delete' checked={this.state.up_pm_Delete}
                                                                                                            onChange={e => {
                                                                                                                this.setState({ up_pm_Delete: e.target.checked });
                                                                                                                this.checked = this.state.up_pm_Delete;
                                                                                                            }}/></td>
                                        <td><input type="checkbox" id='up_pm_Update' name='up_pm_Update' checked={this.state.up_pm_Update}
                                                                                                            onChange={e => {
                                                                                                                this.setState({ up_pm_Update: e.target.checked });
                                                                                                                this.checked = this.state.up_pm_Update;
                                                                                                            }}/></td>
                                    </tr>
                                    <tr>
                                        <td>Responsible Person</td>
                                        <td><input type="checkbox" id='up_rp_Create' name='up_rp_Create' checked={this.state.up_rp_Create}
                                                                                                            onChange={e => {
                                                                                                                this.setState({ up_rp_Create: e.target.checked });
                                                                                                                this.checked = this.state.up_rp_Create;
                                                                                                            }}/></td>
                                        <td><input type="checkbox" id='up_rp_Delete' name='up_rp_Delete' checked={this.state.up_rp_Delete}
                                                                                                            onChange={e => {
                                                                                                                this.setState({ up_rp_Delete: e.target.checked });
                                                                                                                this.checked = this.state.up_rp_Delete;
                                                                                                            }}/></td>
                                        <td><input type="checkbox" id='up_rp_Update' name='up_rp_Update' checked={this.state.up_rp_Update}
                                                                                                            onChange={e => {
                                                                                                                this.setState({ up_rp_Update: e.target.checked });
                                                                                                                this.checked = this.state.up_rp_Update;
                                                                                                            }}/></td>
                                    </tr>
                                    <tr>
                                        <td>Resource</td>
                                        <td><input type="checkbox" id='up_r_Create' name='up_r_Create' checked={this.state.up_r_Create}
                                                                                                            onChange={e => {
                                                                                                                this.setState({ up_r_Create: e.target.checked });
                                                                                                                this.checked = this.state.up_r_Create;
                                                                                                            }}/></td>
                                        <td><input type="checkbox" id='up_r_Delete' name='up_r_Delete' checked={this.state.up_r_Delete}
                                                                                                            onChange={e => {
                                                                                                                this.setState({ up_r_Delete: e.target.checked });
                                                                                                                this.checked = this.state.up_r_Delete;
                                                                                                            }}/></td>
                                        <td><input type="checkbox" id='up_r_Update' name='up_r_Update' checked={this.state.up_r_Update}
                                                                                                            onChange={e => {
                                                                                                                this.setState({ up_r_Update: e.target.checked });
                                                                                                                this.checked = this.state.up_r_Update;
                                                                                                            }}/></td>
                                    </tr>
                                </tbody>
                            </table><br />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.HideModal}>
                            Cancel
                            </Button>
                            <Button  type="submit" variant="dark">
                            Update Project
                            </Button>
                        </Modal.Footer>
                    </form>
                </Modal>
            </React.Fragment>
        );
    }
}

class DeleteProject extends React.Component{
    constructor(props) {
        super(props);
        this.state = { Show:false, 
                        id: this.props.project.id
                    };
        this.ShowModal = this.ShowModal.bind(this);
        this.HideModal = this.HideModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    ShowModal(){
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

        const response = await fetch('/project/delete', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
            body: data,
        });
        this.setState({ Show:false })
        this.props.setProjectInfo()
        this.props.toggleSideBar(null);
        console.log(response.body)
    }

    render(){
        return (
            <React.Fragment>
                <Button className="btn-dark" onClick={this.ShowModal}>< i className="fa fa-trash"></i></Button>
                <Modal show={this.state.Show} onHide={this.HideModal}>
                    <Form onSubmit={this.handleSubmit}>
                        <Modal.Header closeButton>
                            <Modal.Title>Delete Project</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group>
                                <input hidden type="number" id="dp_id" name="dp_id" value={this.state.id} onChange={()=> {}}/>
                                <p>Are you sure you want to delete this project</p>
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.HideModal}>
                            Cancel
                            </Button>
                            <Button type="submit" variant="primary">
                            Delete Project
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </React.Fragment>
        );
    }
  }

class DeleteProjectForm extends React.Component{
    async handleSubmit(event) {
        event.preventDefault();
        let data = new FormData(event.target);
        data = await stringifyFormData(data)

        const response = await fetch('/project/delete', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
            body: data,
        });
      }
      
    render(){
        return(
            <form onSubmit={this.handleSubmit}>
                <label>Enter ID to delete:<br/><input type="number" id="dp_id" name="dp_id"/></label><br/>
                <input type="submit" value="Submit" />
            </form>
        );
    }
}

export default ProjectPage;

