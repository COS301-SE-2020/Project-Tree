import React, { Component } from 'react';
import {Card, Form, Button, Container, Row, Col} from 'react-bootstrap';
import $ from 'jquery';
import axios from 'axios';


function stringifyFormData(fd){
    const data = {};
    for (let key of fd.keys()){
        data[key] = fd.get(key);
    }
    return JSON.stringify(data, null, 2);
}

export default class Login extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        email: "",
        password: "",
        loginErrors: ""
      };
     // this.handleSuccessfulAuth = this.handleSuccessfulAuth.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleChange = this.handleChange.bind(this);
    }


    handleChange(event) {
        this.setState({
          [event.target.name]: event.target.value
        });
      }


    handleSubmit(event){
        const { email, password } = this.state;
        let data = stringifyFormData(new FormData(event.target));
        $.post( "/login", JSON.parse(data) , response => {
            if(response.status === true)
            {
                console.log(response)
                sessionStorage.setItem("sessionToken", response.sessionToken);
                this.props.handleSuccessfulAuth(response);
            }
            else
                alert( "Unable to Log" );
        })
        .fail(() => {
            alert( "Unable to login" );
        })
        .always(() => {
            //alert( "finished" );
        });
        event.preventDefault();
    }

    render(){
        return(
            <React.Fragment>
                <Container>
                    <Row>
                        <Col></Col>
                        <Col>
                            <Card style={{ width: '20rem' }}>
                                <Card.Header>Login</Card.Header>
                                <Card.Body>
                                    <Form onSubmit={this.handleSubmit}>
                                        <Form.Group>
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control type='text' name="email" value={this.state.email} onChange={this.handleChange} required/>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>password</Form.Label>
                                            <Form.Control type='password' name="password" value={this.state.password} onChange={this.handleChange} required/>
                                        </Form.Group>
                                        <Card.Link href="/register">register</Card.Link>
                                        <Card.Link href="#">
                                            <Button type="submit" variant="dark">
                                                Login
                                            </Button>
                                        </Card.Link>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col></Col>
                    </Row>
                </Container>
            </React.Fragment>
        )
    }
}
