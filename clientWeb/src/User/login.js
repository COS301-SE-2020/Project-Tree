import React, { Component } from 'react';
import {Form, Button} from 'react-bootstrap';
import $ from 'jquery';
import loginImg from '../Images/LoginImg.svg';

function stringifyFormData(fd){
    const data = {};
    for (let key of fd.keys()){
        data[key] = fd.get(key);
    }
    return JSON.stringify(data, null, 2);
}

export class Login extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        email: "",
        password: "",
        loginErrors: ""
      };
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleChange = this.handleChange.bind(this);
    }


    handleChange(event) {
        this.setState({
          [event.target.name]: event.target.value
        });
      }


    handleSubmit(event){
      //  const { email, password } = this.state;
        let data = stringifyFormData(new FormData(event.target));
        //console.log(data)
        $.post( "/login", JSON.parse(data) , response => {
            if(response.status === true)
            {
                //console.log(response)
                localStorage.setItem("sessionToken", response.sessionToken);
                this.props.handleLogin(response);
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
        return (
            <div className="base-container" ref={this.props.containerRef}>
              <div className="header">Login</div>
              <Form onSubmit={this.handleSubmit}>
              <div className="content">
                <div className="image">
                 <img alt="Login" src={loginImg} />
                </div>              
                <div className="form">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input  type='text' name="email" value={this.state.email} onChange={this.handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input  type='password' name="password" value={this.state.password} onChange={this.handleChange} required />
                  </div>
                </div>
              </div>
              <div className="footer">
                <Button type="submit" className="btn">
                  Login
                </Button>
              </div>
              </Form>
            </div>
          );
        // return(
        //     <React.Fragment>
        //         <Container>
        //             <Row>
        //                 <Col></Col>
        //                 <Col>
        //                     <Card style={{ width: '20rem' }}>
        //                         <Card.Body>Login
        //                         <div class="card"><img class="card-img-top img-fluid" src={loginImg} /> </div>
        //                             <Form onSubmit={this.handleSubmit}>
        //                                 <Form.Group>
        //                                     <Form.Label>Email</Form.Label>
        //                                     <Form.Control type='text' name="email" value={this.state.email} onChange={this.handleChange} required/>
        //                                 </Form.Group>
        //                                 <Form.Group>
        //                                     <Form.Label>password</Form.Label>
        //                                     <Form.Control type='password' name="password" value={this.state.password} onChange={this.handleChange} required/>
        //                                 </Form.Group>
        //                                 <Card.Link href="/register">register</Card.Link>
        //                                 <Card.Link href="#">
        //                                     <Button type="submit" variant="dark">
        //                                         Login
        //                                     </Button>
        //                                 </Card.Link>
        //                             </Form>
        //                         </Card.Body>
        //                     </Card>
        //                 </Col>
        //                 <Col></Col>
        //             </Row>
        //         </Container>
        //     </React.Fragment>
        // )
    }
}
