import React, { Component } from "react";
import { Carousel, Container, Row, Col } from "react-bootstrap";
import "./Carousel.scss";
import logo from "./Images/Logo.png";

class CarouselSlides extends Component {
  render() {
    return (
      <Container fluid className="align-items-center">
        <Row className="text-center align-items-center">
            <Col className="text-center align-items-center">
              <Carousel className="border rounded align-items-center">
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
            </Col>
          </Row>
      </Container>
      
       
    );
  }
}

export default CarouselSlides;
