import React, { Component } from "react";
import { Carousel, Container, Row, Col } from "react-bootstrap";
import "./Carousel.scss";
import Dashboard from "./Images/Dashboard.png";
import Graph from "./Images/Graph.png";
import Mobile from "./Images/Mobile.png";
import Notification from "./Images/Notification.png";
import Calendar from "./Images/Calendar.png";

class CarouselSlides extends Component {
  render() {
    return (
      <Container fluid className="align-items-center">
        <Row className="text-center align-items-center">
          <Col className="text-center align-items-center">
            <Carousel className="border rounded align-items-center">
              <Carousel.Item>
                <img src={Graph} alt="Graph" className="carouselSlides" />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  src={Dashboard}
                  alt="Dashboard"
                  className="carouselSlides"
                />
              </Carousel.Item>

              <Carousel.Item>
                <img
                  src={Notification}
                  alt="Notification"
                  className="carouselSlides"
                />
              </Carousel.Item>
              <Carousel.Item>
                <img src={Calendar} alt="Calendar" className="carouselSlides" />
              </Carousel.Item>
              <Carousel.Item>
                <img src={Mobile} alt="Mobile" className="carouselSlides" />
                <Carousel.Caption>
                <h4>
                    <a href="https://drive.google.com/file/d/1xgWt-K9mzN6L9JeMkQ-rF9eO_YAiVuRY/view?usp=sharing">
                      Click here to <br></br> download Adroid <br></br> App!
                    </a>
                  </h4>
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
