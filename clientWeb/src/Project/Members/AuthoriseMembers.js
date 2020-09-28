import React from "react";
import {
  Form,
  Modal,
  Button,
  Container,
  Spinner,
  Row,
  Col
} from "react-bootstrap";
import $ from "jquery"

class JoinProject extends React.Component {
    constructor() {
        super();
        this.state = {users: null};
        this.setUsers = this.setUsers.bind(this);
    }

    setUsers(){
        let users = [...this.state.users]
        users.shift();
        this.setState({users:users})
    }

    componentDidMount(){
        $.post("/people/getpendingmembers",
            { projId: this.props.project.id },
            (response) => {
                this.setState({ users: response.users });
            }
            ).fail(() => {
            alert("Unable to get pending members");
        });
    }

    render() {
        if(this.state.users === null){
            return(
                <Spinner
                animation="border"
                variant="success"
                size="sm"
                ></Spinner>
            )
        }

        else if(this.state.users.length === 0){
            return(
                <h4>
                    No pending members
                </h4>
            )
        }

        return (
            <React.Fragment>
                <PendingMember user={this.state.users[0]} project={this.props.project} setUsers={this.setUsers}/>
            </React.Fragment>
        );
    }
}

class PendingMember extends React.Component{
    constructor(){
        super()
        this.state = {}
    }

    handleClick(value){
        let data={
            user: this.props.user.id,
            project: this.props.project.id,
            check: value
        }

        data = JSON.stringify(data);
        $.post("/people/authorisemember", JSON.parse(data), (response) => {
            return 
        }).fail(() => {
            alert("Unable to authorise member");
            return;
        });

        this.props.setUsers();
    }

    render(){
        return(
            <Container className="align-items-center">
                <Row>
                    <h4>Pending Members</h4>
                </Row>
                <Row>
                    <img
                        class="circular"
                        src={this.props.user.profilePicture}
                        alt="user"
                        width="70"
                        height="70"
                    />
                </Row>
                <Row>
                    {this.props.user.name + " " + this.props.user.surname}
                </Row>
                <Row>
                    <Col>
                        <Button variant="success" onClick={()=>this.handleClick(true)}>
                            Accept
                        </Button>
                    </Col>
                    <Col>
                        <Button variant="danger" onClick={()=>this.handleClick(false)}>
                            Decline
                        </Button>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default JoinProject;