import React from 'react';
import {Form, Container, Button, Col, Row, Card} from 'react-bootstrap';
import $ from 'jquery';


function stringifyFormData(fd){
    const data = {};
    for (let key of fd.keys()){
        data[key] = fd.get(key);
    }
    return JSON.stringify(data, null, 2);
}


class Register extends React.Component
{
    constructor(props) {
        super(props);
    
      
      }

      handleSubmit(event){
        event.preventDefault();
        let data = stringifyFormData(new FormData(event.target));
        console.log(data);
        $.post( "/register", JSON.parse(data) , response => {
            sessionStorage.setItem("sessionToken", response.sessionToken);
        })
        .done(() => {
        })
        .fail(() => {
            alert( "Unable to Create User" );
        })
        .always(() => {
            //alert( "finished" );
        });
    }

      render(){
        return (
            <React.Fragment>
                <Container>
                    <Row>
                        <Col></Col>
                        <Col>
                            <Card style={{ width: '18rem' }}>
                                <Card.Header>Register</Card.Header>
                                <Card.Body>
                                    <Form onSubmit={this.handleSubmit}>
                                        <Form.Group>
                                            <Form.Label>Email: </Form.Label>
                                            <Form.Control type='text' id="email" name="email" required/>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control type='password' id="password" name="password" required/>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control type='text' id="name" name="name" required/>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Surname</Form.Label>
                                            <Form.Control type='text' id="sname" name="sname" required/>
                                        </Form.Group>
                                        <Form.Group>
                                        <Card.Link href="">
                                            <Button type="submit" variant="dark">
                                                Register
                                            </Button>
                                            </Card.Link>
                                        </Form.Group>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col></Col>
                    </Row>
                </Container>

            </React.Fragment>
        );
    }
}

export default Register;