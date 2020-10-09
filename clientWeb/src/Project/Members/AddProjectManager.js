import React from "react";
import {
  Form,
  Modal,
  Button,
  Spinner,
  Container,
  Row,
  Col,
  OverlayTrigger,
  Tooltip
} from "react-bootstrap";
import Autosuggest from "react-autosuggest";
import $ from "jquery";

class AddProjectManager extends React.Component {
  constructor() {
    super();
    this.state = { show: false, mode: 2, isloading: false, searchValue: null, tempSearchValue: "", users:null };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setSearchValue = this.setSearchValue.bind(this);
    this.setTempSearchValue = this.setTempSearchValue.bind(this);
  }

  componentDidMount(){
    $.post(
        "/people/getAllProjectMembers",
        { id: this.props.project.id },
        (response) => {
          this.setState({ users: response.users });
        }
      ).fail((err) => {
        throw Error(err);
      });
  }

  showModal() {
    this.setState({ show: true });
  }

  hideModal() {
    this.setState({ show: false });
  }

  setTempSearchValue(value) {
    this.setState({ tempSearchValue: value, error: false });
  }

  setSearchValue(value) {
    this.setState({ searchValue: value, error: false });
  }

  handleSubmit() {
    if(this.state.searchValue === null) return null;

    this.setState({ isloading: true });
    let data = JSON.stringify({userId: this.state.searchValue.id , projId: this.props.project.id })
    
    $.post("/people/addProjectManager", JSON.parse(data), (response) => {
      this.setState({ show: false, isloading: false });
    }).fail(() => {
      alert("Unable to add project manager");
    });
  }

  render() {
    return (
      <React.Fragment>
        <Button
          className="btn-warning mt-3"
          style={{
            width: "205px",
            color: "black",
          }}
          onClick={() => {
            this.showModal();
          }}
        >
          <i className="fa fa-group"></i> Add Project Manager {" "}
        </Button>
        <Modal
          show={this.state.show}
          onHide={() => {
            this.hideModal();
          }}
        >
          <Form
            onSubmit={(event) => {
              this.handleSubmit(event);
            }}
          >
            <Modal.Header closeButton style={{ backgroundColor: "#96BB7C" }}>
              <Modal.Title>Add Project Manager {" "}
              <OverlayTrigger
                placement='right'
                overlay={
                <Tooltip className="helpTooltip">
                  Only project managers may add project members or make project changes
                </Tooltip>
                } >
                <i className="fa fa-info-circle"  style={{ color: "black", fontSize: "20px" }}></i>
                </OverlayTrigger></Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {
                  this.state.users !== null ?
                  <Searchbar 
                    users={this.state.users}
                    filterTaskOption={this.state.filterTaskOption}
                    setSearchValue={this.setSearchValue}
                    setTempSearchValue={this.setTempSearchValue}
                    value={this.state.tempSearchValue}
                  />
                  :
                  null
              }
            </Modal.Body>
            <Modal.Footer style={{ backgroundColor: "#96BB7C" }}>
              <Button
                variant="secondary"
                onClick={() => {
                  this.hideModal();
                }}
              >
                Cancel
              </Button>
              <Button
                variant="dark"
                style={{ width: "100px" }}
                disabled={this.state.isloading}
                onClick={()=>this.handleSubmit()}
              >
                {this.state.isloading ? (
                  <Spinner
                    animation="border"
                    variant="success"
                    size="sm"
                  ></Spinner>
                ) : (
                  "Add"
                )}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}

class Searchbar extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        value: "",
        suggestions: [],
        users: null,
      };
  
      this.getSuggestionValue = this.getSuggestionValue.bind(this);
      this.renderSuggestion = this.renderSuggestion.bind(this);
    }
  
    componentDidMount() {
      this.setState({ users: this.props.users });
    }
  
    onChange = (event, { newValue }) => {
      this.props.setTempSearchValue(newValue);
    };
  
    onSuggestionsFetchRequested = ({ value }) => {
      this.setState({
        suggestions: this.getSuggestions(value),
      });
    };
  
    onSuggestionsClearRequested = () => {
      this.setState({
        suggestions: [],
      });
    };
  
    getSuggestions(value) {
      const inputValue = value.trim().toLowerCase();
      const inputLength = inputValue.length;
  
   
        return inputLength === 0
          ? []
          : this.state.users.filter(
              (lang) =>
                lang.name.toLowerCase().slice(0, inputLength) === inputValue
            );
    }
  
    getSuggestionValue(suggestion) {
      this.props.setSearchValue(suggestion);
      return suggestion.name + " " + suggestion.surname;
    }
  
    renderSuggestion(suggestion) {
        return (
            <Container>
            <Row>
                <Col></Col>
                <Col
                className="text-center border rounded border-dark m-1"
                xs={6}
                style={{
                    color: "black",
                    height: "30px",
                }}
                >
                {suggestion.name + " " + suggestion.surname}
                </Col>
                <Col></Col>
            </Row>
            </Container>
        );
    }
  
    render() {
      if(this.state.users === null){
          return null;
      }
    
      const { suggestions } = this.state;
      const value = this.props.value;
  
      const inputProps = {
        placeholder: "Enter a person's name",
        value,
        onChange: this.onChange,
      };
  
      return (
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps}
        />
      );
    }
  }

export default AddProjectManager;