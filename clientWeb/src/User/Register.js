import React from 'react';
import {Form, Button} from 'react-bootstrap';
import $ from 'jquery';
import register from '../Images/Register.svg';


function stringifyFormData(fd){
    const data = {};
    for (let key of fd.keys()){
        data[key] = fd.get(key);
    }
    return JSON.stringify(data, null, 2);
}


export class Register extends React.Component
{
    constructor(){
        super();
        this.state = {
          email: "",
          password: "",
          name: "",
          sname: "",
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
     //   const { email, password, name, sname } = this.state;
        let data = stringifyFormData(new FormData(event.target));
        console.log(data);
        
        $.post( "/register", JSON.parse(data) , response => {
            localStorage.setItem("sessionToken", response.sessionToken);
            this.props.handleReg(response);
        })
        .done(() => {
            //this.setState(sessionToken.getItem({sessionToken}));
        })
        .fail(() => {
            alert( "Unable to create User" );
        })
        .always(() => {
           // alert( "finished" );
        });
        event.preventDefault();
    }
        onChange = event => 
        {
         this.setState({ [event.target.name]: event.target.value });
        };

      render(){

        const {
            email,
            password,
            name,
            sname,
           // error
          } = this.state;

        // return (
        //     <React.Fragment>
        //         <Container>
        //             <Row>
        //                 <Col></Col>
        //                 <Col>
        //                     <Card style={{ width: '18rem' }}>
        //                         <Card.Header>Register</Card.Header>
        //                         <Card.Body>
        //                             <Form onSubmit={this.handleSubmit}>
        //                                 <Form.Group>
        //                                     <Form.Label>Email: </Form.Label>
        //                                     <Form.Control type='text' id="email" name="email" value={email}  onChange={this.onChange} required/>
        //                                 </Form.Group>
        //                                 <Form.Group>
        //                                     <Form.Label>Password</Form.Label>
        //                                     <Form.Control type='password' id="password" name="password" value={password}  onChange={this.onChange} required/>
        //                                 </Form.Group>
        //                                 <Form.Group>
        //                                     <Form.Label>Name</Form.Label>
        //                                     <Form.Control type='text' id="name" name="name" value={name}  onChange={this.onChange} required/>
        //                                 </Form.Group>
        //                                 <Form.Group>
        //                                     <Form.Label>Surname</Form.Label>
        //                                     <Form.Control type='text' id="sname" name="sname" value={sname}  onChange={this.onChange} required/>
        //                                 </Form.Group>
        //                                 <Form.Group>
        //                                 <Card.Link href="">
        //                                     <Button type="submit" variant="dark">
        //                                         Register
        //                                     </Button>
        //                                     </Card.Link>
        //                                 </Form.Group>
        //                                 {error && <p>{error.message}</p>}
        //                             </Form>
        //                         </Card.Body>
        //                     </Card>
        //                 </Col>
        //                 <Col></Col>
        //             </Row>
        //         </Container>

        //     </React.Fragment>
        // );
        return (
            <div className="base-container" ref={this.props.containerRef}>
              <div className="header"> Register </div>
              <Form onSubmit={this.handleSubmit}>
              <div className="content">
                <div className="image">
                  <img alt='Registration' src={register} />
                </div>
                <div className="form">
                  <div className="form-group">
                    <label htmlFor="name">Name: </label>
                    <input type="text" name="name" value={name}  onChange={this.onChange} required/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="sname">Surname: </label>
                    <input type="text" name="sname" value={sname}  onChange={this.onChange} required/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email" value={email}  onChange={this.onChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type='password' id="password" name="password" value={password}  onChange={this.onChange} required />
                  </div>
                </div>
              </div>
              <div className="footer">
                <Button type="submit" className="btn">
                  Register
                </Button>
              </div>
              </Form>
            </div>
          );
    }
}

