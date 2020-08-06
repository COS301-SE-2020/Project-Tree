import React, { Component} from "react";
import { Container, Row, Col, Navbar, Carousel, Button  } from "react-bootstrap";
import "./About.scss";
import logo from './Images/Logo.png';
import s1 from './Images/S1.png';
import s2 from './Images/S2.png';
import s3 from './Images/S3.png';
import s4 from './Images/S4.png';
import s5 from './Images/S5.png';




class About extends Component{
    render(){
        return(
            <Carousel >
                <Carousel.Item >
                    <img src={logo} alt="Logo"/>
                    <Carousel.Caption>
                    <h3>First slide label</h3>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img src={logo} alt="Logo"/>
                    <Carousel.Caption >
                    <h3>Second slide label</h3>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item >
                    <img src={logo} alt="Logo" />
                    <Carousel.Caption >
                    <h3>Third slide label</h3>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img src={logo} alt="Logo" />
                    <Carousel.Caption >
                    <h3>Third slide label</h3>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img src={logo} alt="Logo" />
                    <Carousel.Caption >
                    <h3>Third slide label</h3>
                    </Carousel.Caption>
                </Carousel.Item>
        </Carousel>
                        )

                    }
}

export default About;