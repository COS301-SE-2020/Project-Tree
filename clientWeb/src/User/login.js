import React, { Component } from 'react';
import {Card, Form, Button, Container, Row, Col} from 'react-bootstrap';
import $ from 'jquery';

function stringifyFormData(fd){
    const data = {};
    for (let key of fd.keys()){
        data[key] = fd.get(key);
    }
    return JSON.stringify(data, null, 2);
}

class Login extends Component{
    constructor(){
        super();
        this.state = { };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event){
        event.preventDefault();
        let data = stringifyFormData(new FormData(event.target));
        $.post( "/login", JSON.parse(data) , response => {
        })
        .done(() => {
        })
        .fail(() => {
            alert( "Unable to login" );
        })
        .always(() => {
            //alert( "finished" );
        });
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
                                            <Form.Control type='text' name="email" required/>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>password</Form.Label>
                                            <Form.Control type='password' name="password" required/>
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

export default Login;