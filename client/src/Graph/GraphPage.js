import React from 'react';
import { Table, Button, Container, Row, Col } from 'react-bootstrap'
import { Link } from "react-router-dom";

class GraphPage extends React.Component{
    // async componentDidMount() {
    //     const response = await fetch('/project');
    //     const body = await response.json();
    //     if (response.status !== 200) throw Error(body.message);

    //     console.log(body)

    //     // this.setState({projects: body.nodes})
    // }

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
                <ProjectDetails project={this.props.project}/> <br/>
                <Link to="/project"><button onClick={()=>this.props.toggleGraphPage(null)}>Back</button></Link>
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

export default GraphPage;