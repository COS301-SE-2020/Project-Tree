import React from "react";
import { Modal, Button, Col, Row, Container} from "react-bootstrap";

class Settings extends React.Component {
  constructor() {
    super();
    this.state = { show: false };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  showModal() {
    this.setState({ show: true });
  }

  hideModal() {
    this.setState({ show: false });
  }

  handleLogout() {
    localStorage.clear();
    this.setState({
      loggedInStatus: false,
      user: {}
    });
    this._isMounted = false;
    window.location.reload(false);
  }

  render() {
    return ( 
      <React.Fragment>
        <Button
          className="my-2"
          style={{borderColor:"#96BB7C", backgroundColor:"#96BB7C"}}
          onClick={() => {this.showModal()}}
          size="sm"
        >
          <i className="fa fa-cogs text-dark" style={{fontSize:"30px"}}></i>
        </Button>
        <Modal show={this.state.show} onHide={() => {this.hideModal()}}>
            <Modal.Header closeButton>
              <Modal.Title className="align-items-centers"> </Modal.Title> 
            </Modal.Header>
            <Modal.Body>
             {this.props.user.name}
             {this.props.user.sname}
             {this.props.user.email}
            </Modal.Body>
              <Container>
                <Row>
                  <Col>
                  <Button block variant="secondary" className="m-2" onClick={() => {this.hideModal()}}>
                  
                Edit preferences
                  </Button> 
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Button block  variant="dark" className="m-2" onClick={() => this.handleLogout()}>Logout</Button>
                  </Col>
                </Row>
              </Container>
              
        </Modal>
      </React.Fragment>
    );
  }
}

export default Settings;
