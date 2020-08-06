import React, { Component} from "react";
import { Container, Row, Col, Navbar, Carousel, Button  } from "react-bootstrap";
import logo from './Images/Logo.png';



class About extends Component{
    render(){
        return(
            <Carousel className="bg-dark">
                <Carousel.Item>
                    <img src={logo} alt="Logo" style={{width:"500px"}}/>
                    <Carousel.Caption>
                    <h3>First slide label</h3>
                    <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img src={logo} alt="Logo" style={{width:"500px"}}/>

                    <Carousel.Caption>
                    <h3>Second slide label</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img src={logo} alt="Logo" style={{width:"500px"}}/>

                    <Carousel.Caption>
                    <h3>Third slide label</h3>
                    <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                    </Carousel.Caption>
                </Carousel.Item>
        </Carousel>
                        )

                    }
}

export default About;