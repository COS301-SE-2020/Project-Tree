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
    //state = initialState;
    constructor(){
        super();
        this.state = {
          email: "",
          password: "",
          name: "",
          sname: "",
          passwordError: "",
          passwordError2: "",
          passwordError3: "",
          passwordError4: ""

        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    password_validate(d) 
    {
      let str = ""
      let arr = []
      let p = d.password;
       (/[A-Z]/.test(p)) === false ?arr.push("Must contain at least one Capital Letter \n"):str+="";
       (/[0-9]/.test(p))=== false? arr.push("Must contain at least one number \n"):str+="";
      (/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(p)) === false? arr.push("Must contain at least one special character eg. #!@$ \n"):str+="";
       (/^.{8,22}$/.test(p))=== false ? arr.push("Must be between 8 and 22 characters  "): str+="";
      return arr;
      // return /[A-Z]/.test(p) && /[0-9]/.test(p) && /[?=.*[!@#$&*]]/.test(p) && /^.{8}$/.test(p);
    }

    handleChange(event)
    {
      this.setState({
        [event.target.name]: event.target.value
      });
    }

    handleSubmit(event){
      event.preventDefault();
        let data = stringifyFormData(new FormData(event.target));
        let x = (JSON.parse(data));
        let arr = this.password_validate(x)
        if(arr.length === 0)
        {
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
        }
        else
        {
          this.setState({passwordError: arr[0]})
          this.setState({passwordError2: arr[1]})
          this.setState({passwordError3: arr[2]})
          this.setState({passwordError4: arr[3]})
        }    
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
                    <label htmlFor="name">Name </label>
                    <input type="text" name="name" value={name}  onChange={this.onChange} required/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="sname">Surname </label>
                    <input type="text" name="sname" value={sname}  onChange={this.onChange} required/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" value={email}  onChange={this.onChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type='password' id="password" name="password" value={password}  onChange={this.onChange} required />
                  </div>
                  <div style={{ fontSize: 12, color: "red" }}>
                     <p>{this.state.passwordError}</p>
                     <p>{this.state.passwordError1}</p>                     
                     <p>{this.state.passwordError2}</p>                     
                     <p>{this.state.passwordError3}</p>                     
                   </div>
                </div>
              </div>
              <div className="footer">
                <Button type="submit" className=".btn">
                  Register
                </Button>
              </div>
              </Form>
            </div>
          );
    }
}

