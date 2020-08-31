import React, { Component } from "react";
import { Carousel } from "react-bootstrap";
import "./About.scss";
import logo from "./Images/Logo.png";

class About extends Component {
  render() {
    return (
      <Carousel className="border rounded">
        <Carousel.Item>
          <img src={logo} alt="Logo" />
        </Carousel.Item>
        <Carousel.Item>
          <img src={logo} alt="Logo" />
          <Carousel.Caption>
            <h3>Second slide label</h3>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img src={logo} alt="Logo" />
          <Carousel.Caption>
            <h3>Third slide label</h3>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img src={logo} alt="Logo" />
          <Carousel.Caption>
            <h3>Third slide label</h3>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img src={logo} alt="Logo" />
          <Carousel.Caption>
            <h3>Third slide label</h3>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    );
  }
}

export default About;
