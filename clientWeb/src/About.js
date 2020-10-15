import React from "react";
import { Container, Modal, Button, Row, Col } from "react-bootstrap";
import CarouselSlides from "./CarouselSlides";

class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = { show: false };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  showModal() {
    this.setState({ show: true });
  }

  hideModal() {
    this.setState({ show: false });
  }
  render() {
    return (
      <Container fluid>
        <h8
          onClick={() => {
            this.showModal();
          }}
        >
          <a href="/#">Find out More... </a>
        </h8>
        <Modal
          size="lg"
          closeButton
          show={this.state.show}
          onHide={() => {
            this.hideModal();
          }}
        >
          <Modal.Header style={{ justifyContent: "center" }}>
            <Modal.Title>
              <Row>
                <Col className="text-center">
                  <h3>About Project-Tree</h3>
                </Col>
              </Row>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            <h5>
              The application represents a project visually as a tree structure,
              with each “leaf” being a project task, and each branch being a
              task dependency. The core idea of the app is to allow for all task
              dependencies to be captured accurately and clearly, to ensure
              effective project management.
            </h5>

            <CarouselSlides />
          </Modal.Body>
          <Modal.Footer style={{ justifyContent: "center" }}>
            <Row>
              <Col>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => {
                    this.hideModal();
                  }}
                >
                  Done
                </Button>
              </Col>
            </Row>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  }
}

export default About;
