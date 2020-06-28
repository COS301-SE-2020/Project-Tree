import React from 'react';
import {Button, Container, Row, Col} from 'react-bootstrap'

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
        this.state = {form1:true, form2:true, form3:true, form4:true, projects:null, project:null};
        this.projectList = this.projectList.bind(this);
        this.toggleSideBar = this.toggleSideBar.bind(this);
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
                {/* <div>
                    <h3 id="form1" onClick={() => this.toggle(1)}>Select Project {this.state.form1 ? "\u25BE" : "\u25B4"}</h3>
                    {this.state.form1 ? null : <SelectProjectForm />}
                    <h3 id="form3" onClick={() => this.toggle(3)}>Delete Project {this.state.form3 ? "\u25BE" : "\u25B4"}</h3>
                    {this.state.form3 ? null : <DeleteProjectForm />}
                    <h3 id="form4" onClick={() => this.toggle(4)}>Update Project {this.state.form4 ? "\u25BE" : "\u25B4"}</h3>
                    {this.state.form4 ? null : <UpdateProjectForm />}
                </div> */}
                {/* <this.projectList /> */}
                {/* <h3 id="form2" onClick={() => this.toggle(2)}>Create Project {this.state.form2 ? "\u25BE" : "\u25B4"}</h3> */}
                {/* {this.state.form2 ? null : <CreateProjectForm />} */}
                <Container fluid>
                    <Row>
                        <Col className="text-center"> <br/> <this.projectList /> <br/> 
                        <Button variant="outline-dark" size="lg" block> Create Project</Button> </Col>
                         <Col xs={6} className="text-center"> <br/>Under construction - JointJS</Col>
                        <Col className="text-center"> <br/> {this.state.project != null ? 
                        <Sidebar project={this.state.project}/> : null} </Col>
                    </Row>
                </Container>
            </React.Fragment>
        )
    }
}

class Sidebar extends React.Component{
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
        console.log(this.props.project)

        return(
            <table>
                <tbody>
                    <tr>
                        <td></td>
                        <td>Create</td>
                        <td>Delete</td>
                        <td>Update</td>
                    </tr>
                    <tr>
                        <td>Package Manager</td>
                        <td>x</td>
                        <td></td>
                        <td>x</td>
                    </tr>
                    <tr>
                        <td>Responsible Person</td>
                        <td></td>
                        <td>x</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Resource</td>
                        <td>x</td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        )
    }

    render()
    {
        return(
            <React.Fragment>
                <Container className="block-example border border-secondary">
                    <Row className="align-items-center bg-dark">
                        <Col className="text-center"> <Button className="btn-dark">< i className="fa fa-trash"></i></Button> </Col>
                        <Col className="text-white"> {this.props.project.name}  </Col>
                        <Col className="text-center" ><Button className="btn-dark"><i className="fa fa-close"></i></Button></Col>
                    </Row> 
                    <Row className="align-items-center">
                        <Col><p>{this.props.project.description}</p> </Col>
                    </Row> 
                    <Row className="align-items-center" >
                        <Col className="text-center" >
                        <Button variant="secondary" onClick={this.togglePermissions}>Permissions {this.state.permissions ? "\u25B4":"\u25BE"}</Button>
                        {this.state.permissions? <this.permissionsTable /> : null}</Col>
                    </Row> <br/>
                    <Row className="align-items-center">
                        <Col> </Col>
                        <Col className="text-center"><Button variant="outline-dark" size="md">View Project</Button></Col>
                        <Col></Col>
                    </Row> <br/>
                    <Row className="align-items-center">
                        <Col> </Col>
                        <Col className="text-center">
                        <Button className="btn-dark"><i className="fa fa-edit"> </i> Update </Button></Col>
                        <Col></Col>
                    </Row>
                    <br/> 
                </Container>
            </React.Fragment>
        )
    }
}

class CreateProjectForm extends React.Component{
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
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
      }

    render()
    {
        return(
            <form onSubmit={this.handleSubmit}>
                <label> Name of project<br /><input type='text' id="cp_Name" name="cp_Name" required/></label><br/><br/>
                <label> Description of project<br /><textarea id="cp_Description" cols='30' rows='10' name="cp_Description" required></textarea></label><br/>
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
                </table><br />
                <input type='submit' value='Submit'/>
            </form>
        )
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

class UpdateProjectForm extends React.Component{
    render(){
        return(
            <form>
                <label>Enter ID to update:<br/><input type="number" id="up_id" name="up_id"/></label><br/>
                <label> Name of project<br /><input type='text' id="up_name" name="up_name"/></label><br/><br/>
                <label> Description of project<br /><textarea id="up_description" name="up_description" cols='30' rows='10'></textarea></label><br/>
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
                            <td><input type="checkbox" id='up_pm_Create' name='up_pm_Create'/></td>
                            <td><input type="checkbox" id='up_pm_Delete' name='up_pm_Delete'/></td>
                            <td><input type="checkbox" id='up_pm_Update' name='up_pm_Update'/></td>
                        </tr>
                        <tr>
                            <td>Responsible Person</td>
                            <td><input type="checkbox" id='up_rp_Create' name='up_rp_Create'/></td>
                            <td><input type="checkbox" id='up_rp_Delete' name='up_rp_Delete'/></td>
                            <td><input type="checkbox" id='up_rp_Update' name='up_rp_Update'/></td>
                        </tr>
                        <tr>
                            <td>Resource</td>
                            <td><input type="checkbox" id='up_r_Create' name='up_r_Create'/></td>
                            <td><input type="checkbox" id='up_r_Delete' name='up_r_Delete'/></td>
                            <td><input type="checkbox" id='up_r_Update' name='up_r_Update'/></td>
                        </tr>
                    </tbody>
                </table><br />
                <input type='submit' value='Submit' />
            </form>
        );
    }
}


export default ProjectPage;

