import React from "react";
import {
  Button,
  Container,
  Row,
  Col,
  ToggleButtonGroup,
  ToggleButton,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import Autosuggest from "react-autosuggest";
import "./FilterComponent.css";

export default class FilterComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterMode: "highlight",
      filterTaskOption: "taskAll",
      filterPeopleOption: null,
      tempSearchValue: "",
      searchValue: null,
      error: false,
    };
    this.setSearchValue = this.setSearchValue.bind(this);
    this.setTempSearchValue = this.setTempSearchValue.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.filterTasks = this.filterTasks.bind(this);
    this.highlightTasks = this.highlightTasks.bind(this);
    this.filterPeople = this.filterPeople.bind(this);
    this.highlightPeople = this.highlightPeople.bind(this);
    this.quickSearch = this.quickSearch.bind(this);
  }

  setTempSearchValue(value) {
    this.setState({ tempSearchValue: value, error: false });
  }

  setSearchValue(value) {
    this.setState({ searchValue: value, error: false });
  }

  checkDependency(tasks, dependency) {
    for (var x = 0; x < tasks.length; x++) {
      if (tasks[x].id === dependency) {
        return true;
      }
    }

    return false;
  }

  filterDependencies(tasks, dependencies) {
    dependencies = dependencies.filter((dependency) => {
      return (
        this.checkDependency(tasks, dependency.source) &&
        this.checkDependency(tasks, dependency.target)
      );
    });

    return dependencies;
  }

  filterTasks(searchValue) {
    let tasks = [...this.props.nodes];

    if (this.state.filterTaskOption === "taskComplete") {
      tasks = tasks.filter((task) => {
        return task.type === "Complete";
      });
    } else if (this.state.filterTaskOption === "taskIncomplete") {
      tasks = tasks.filter((task) => {
        return task.type === "Incomplete" || task.type === "Issue";
      });
    } else if (this.state.filterTaskOption === "taskIssue") {
      tasks = tasks.filter((task) => {
        return task.type === "Issue";
      });
    }

    if (searchValue !== null) {
      tasks = tasks.filter((task) => {
        return task.id === searchValue.id;
      });
    }

    if (tasks.length === 0) {
      this.setState({ searchValue: null, tempSearchValue: "", error: true });
      return;
    }

    this.props.setTaskInfo(
      tasks,
      this.filterDependencies(tasks, [...this.props.links])
    );
    this.props.setFilterOn(true);
  }

  highlightTasks(searchValue) {
    let tempTasks = [...this.props.nodes];
    let tasks = [...this.props.nodes];

    if (this.state.filterTaskOption === "taskComplete") {
      tempTasks = tempTasks.filter((task) => {
        return task.type === "Complete";
      });
    } else if (this.state.filterTaskOption === "taskIncomplete") {
      tempTasks = tempTasks.filter((task) => {
        return task.type === "Incomplete" || task.type === "Issue";
      });
    } else if (this.state.filterTaskOption === "taskIssue") {
      tempTasks = tempTasks.filter((task) => {
        return task.type === "Issue";
      });
    }

    if (searchValue !== null) {
      tempTasks = tempTasks.filter((task) => {
        return task.id === searchValue.id;
      });
    }

    let searchCheck = false;
    for (var y = 0; y < tempTasks.length; y++) {
      for (var z = 0; z < tasks.length; z++) {
        if (tempTasks[y].id === tasks[z].id) {
          tasks[z].highlighted = true;
          searchCheck = true;
        }
      }
    }

    if (!searchCheck) {
      this.setState({ searchValue: null, tempSearchValue: "", error: true });
      return;
    }

    this.props.setTaskInfo(tasks, this.props.links);
    this.props.setFilterOn(true);
  }

  filterPeople(searchValue) {
    if (searchValue === null) {
      alert("Please enter the name of a person");
      return;
    }

    let userId = searchValue.id;
    let filterType = this.state.filterPeopleOption;
    let filteredUsers = [];
    let users = [...this.props.users];
    let tasks = [];

    if (filterType === "peoplePackMan") {
      for (var x = 0; x < users.length; x++) {
        if (users[x][1].type === "PACKAGE_MANAGER") {
          filteredUsers.push(users[x]);
        }
      }
    } else if (filterType === "peopleResPer") {
      for (var y = 0; y < users.length; y++) {
        if (users[y][1].type === "RESPONSIBLE_PERSON") {
          filteredUsers.push(users[y]);
        }
      }
    } else if (filterType === "peopleResources") {
      for (var z = 0; z < users.length; z++) {
        if (users[z][1].type === "RESOURCE") {
          filteredUsers.push(users[z]);
        }
      }
    } else filteredUsers = users;

    filteredUsers = filteredUsers.filter((user) => {
      return user[0].id === userId;
    });

    for (x = 0; x < filteredUsers.length; x++) {
      for (y = 0; y < this.props.nodes.length; y++) {
        if (filteredUsers[x][1].end === this.props.nodes[y].id) {
          tasks.push(JSON.parse(JSON.stringify(this.props.nodes[y])));
        }
      }
    }

    if (tasks.length === 0) {
      this.setState({ searchValue: null, tempSearchValue: "", error: true });
      return;
    }

    this.props.setTaskInfo(
      tasks,
      this.filterDependencies(tasks, [...this.props.links])
    );
    this.props.setFilterOn(true);
  }

  highlightPeople(searchValue) {
    if (searchValue === null) {
      alert("Please enter the name of a person");
      return;
    }

    let userId = searchValue.id;
    let filterType = this.state.filterPeopleOption;
    let filteredUsers = [];
    let users = [...this.props.users];
    let tasks = [...this.props.nodes];

    if (filterType === "peoplePackMan") {
      for (var x = 0; x < users.length; x++) {
        if (users[x][1].type === "PACKAGE_MANAGER") {
          filteredUsers.push(users[x]);
        }
      }
    } else if (filterType === "peopleResPer") {
      for (var y = 0; y < users.length; y++) {
        if (users[y][1].type === "RESPONSIBLE_PERSON") {
          filteredUsers.push(users[y]);
        }
      }
    } else if (filterType === "peopleResources") {
      for (var z = 0; z < users.length; z++) {
        if (users[z][1].type === "RESOURCE") {
          filteredUsers.push(users[z]);
        }
      }
    } else filteredUsers = users;

    filteredUsers = filteredUsers.filter((user) => {
      return user[0].id === userId;
    });

    let searchCheck = false;
    for (x = 0; x < filteredUsers.length; x++) {
      for (y = 0; y < tasks.length; y++) {
        if (filteredUsers[x][1].end === tasks[y].id) {
          tasks[y].highlighted = true;
          searchCheck = true;
        }
      }
    }

    if (!searchCheck) {
      this.setState({ searchValue: null, tempSearchValue: "", error: true });
      return;
    }

    this.props.setTaskInfo(tasks, this.props.links);
    this.props.setFilterOn(true);
  }

  quickSearch(mode) {
    if (mode === "filter") {
      this.filterPeople(this.props.user);
    } else {
      this.highlightPeople(this.props.user);
    }
  }

  handleSearch() {
    let searchValue = this.state.searchValue;

    if (searchValue !== null) {
      if (
        this.state.filterTaskOption !== null &&
        this.state.searchValue.name !== this.state.tempSearchValue
      ) {
        searchValue = null;
      } else if (
        this.state.filterPeopleOption !== null &&
        this.state.searchValue.name + " " + this.state.searchValue.surname !==
          this.state.tempSearchValue
      ) {
        searchValue = null;
      }
    }

    if (this.state.filterTaskOption !== null) {
      if (this.state.filterMode === "filter") this.filterTasks(searchValue);
      else this.highlightTasks(searchValue);
    } else {
      if (this.state.filterMode === "filter") this.filterPeople(searchValue);
      else this.highlightPeople(searchValue);
    }
  }

  getTaskPersonOption() {
    if (this.state.filterTaskOption !== null) {
      return "task";
    } else return "people";
  }

  getSubOption() {
    let data = "";
    if (this.state.filterTaskOption !== null) {
      data = this.state.filterTaskOption;
      data = data.replace("task", "");
    } else {
      data = this.state.filterPeopleOption;
      data = data.replace("people", "");

      if (data === "PackMan") {
        data = "package manager";
      } else if (data === "ResPer") {
        data = "responsible person";
      }
    }

    data = data.toLowerCase();

    return data;
  }

  getSearchValue() {
    if (this.state.searchValue === null) return null;

    if (this.state.filterTaskOption !== null) {
      return this.state.searchValue.name;
    } else {
      return this.state.searchValue.name + " " + this.state.searchValue.surname;
    }
  }

  render() {
    if (this.props.filterOn) {
      return (
        <Container>
          <Row>
            <Col>
              <Button
                variant="outline-danger"
                className="mb-1"
                onClick={() => {
                  this.props.setFilterOn(false);
                  this.props.setTaskInfo();
                }}
              >
                Clear Filter
              </Button>
            </Col>
          </Row>
          <Row>
            <Col></Col>
            <Col
              className="text-center border rounded border-warning m-1 align-items-center p-0"
              xs={5}
              style={{
                backgroundColor: "white",
                color: "black",
                height: "30px",
              }}
            >
              {this.state.filterMode}
            </Col>
            <Col></Col>
          </Row>
          <Row>
            <Col></Col>
            <Col
              className="text-center border rounded border-warning m-1 align-items-center p-0"
              xs={5}
              style={{
                backgroundColor: "white",
                color: "black",
                height: "30px",
              }}
            >
              {this.getTaskPersonOption()}
            </Col>
            <Col></Col>
          </Row>
          <Row>
            <Col></Col>
            <Col
              className="text-center border rounded border-warning m-1 align-items-center p-0"
              xs={5}
              style={{
                backgroundColor: "white",
                color: "black",
                height: "30px",
              }}
            >
              {this.getSubOption()}
            </Col>
            <Col></Col>
          </Row>
          <Row>
            <Col></Col>
            <Col
              className="text-center border rounded border-warning m-1 align-items-center p-0"
              xs={5}
              style={{
                backgroundColor: "white",
                color: "black",
                minHeight: "30px",
                wordWrap: "break-word",
              }}
            >
              {this.getSearchValue()}
            </Col>
            <Col></Col>
          </Row>
          <hr />
        </Container>
      );
    }

    return (
      <Container className="p-2">
        <Row>
          <Col className="text-center">
            <h4>
              Search{" "}
              <OverlayTrigger
                placement="auto"
                overlay={
                  <Tooltip className="helpTooltip">
                    Select the filter or highlight button then select tasks or
                    people and search for specific tasks or people to display.
                    Now click GO!
                  </Tooltip>
                }
              >
                <i
                  className="fa fa-question-circle"
                  style={{ color: "black", fontSize: "17px" }}
                ></i>
              </OverlayTrigger>
            </h4>
          </Col>
        </Row>
        <Row>
          <Col className="text-center">
            <ToggleButtonGroup
              horizontal="true"
              name="filterMode"
              value={this.state.filterMode}
              defaultValue={this.state.filterMode}
            >
              <ToggleButton
                variant="secondary"
                value="filter"
                onClick={() =>
                  this.setState({ filterMode: "filter", error: false })
                }
              >
                Filter
              </ToggleButton>
              <ToggleButton
                variant="secondary"
                value="highlight"
                onClick={() =>
                  this.setState({ filterMode: "highlight", error: false })
                }
              >
                Highlight
              </ToggleButton>
            </ToggleButtonGroup>
          </Col>
        </Row>
        <Row>
          <Col xs={12} lg={6} className="p-2">
            <Col>{"Select tasks"} </Col>
            <ToggleButtonGroup
              vertical
              name="taskFilterOptions"
              value={this.state.filterTaskOption}
              defaultValue={this.state.filterTaskOption}
              style={{ width: "100%" }}
            >
              <ToggleButton
                variant="outline-secondary"
                value="taskAll"
                onClick={() =>
                  this.setState({
                    filterTaskOption: "taskAll",
                    filterPeopleOption: null,
                    error: false,
                  })
                }
              >
                All
              </ToggleButton>
              <ToggleButton
                variant="outline-secondary"
                value="taskComplete"
                onClick={() =>
                  this.setState({
                    filterTaskOption: "taskComplete",
                    filterPeopleOption: null,
                    error: false,
                  })
                }
              >
                Complete
              </ToggleButton>
              <ToggleButton
                variant="outline-secondary"
                value="taskIncomplete"
                onClick={() =>
                  this.setState({
                    filterTaskOption: "taskIncomplete",
                    filterPeopleOption: null,
                    error: false,
                  })
                }
              >
                Incomplete
              </ToggleButton>
              <ToggleButton
                variant="outline-secondary"
                value="taskIssue"
                onClick={() =>
                  this.setState({
                    filterTaskOption: "taskIssue",
                    filterPeopleOption: null,
                    error: false,
                  })
                }
              >
                Issue
              </ToggleButton>
            </ToggleButtonGroup>
          </Col>
          <Col xs={12} lg={6} className="p-2">
            <Col>{"Select people"} </Col>
            <ToggleButtonGroup
              vertical
              name="peopleFilterOptions"
              value={this.state.filterPeopleOption}
              defaultValue={this.state.filterPeopleOption}
              style={{ width: "100%" }}
            >
              <ToggleButton
                variant="outline-secondary"
                value="peopleAll"
                onClick={() =>
                  this.setState({
                    filterTaskOption: null,
                    filterPeopleOption: "peopleAll",
                    errror: false,
                  })
                }
              >
                All
              </ToggleButton>
              <ToggleButton
                variant="outline-secondary"
                value="peoplePackMan"
                onClick={() =>
                  this.setState({
                    filterTaskOption: null,
                    filterPeopleOption: "peoplePackMan",
                    error: false,
                  })
                }
              >
                Package Managers
              </ToggleButton>
              <ToggleButton
                variant="outline-secondary"
                value="peopleResPer"
                onClick={() =>
                  this.setState({
                    filterTaskOption: null,
                    filterPeopleOption: "peopleResPer",
                    error: false,
                  })
                }
              >
                Responsible People
              </ToggleButton>
              <ToggleButton
                variant="outline-secondary"
                value="peopleResources"
                onClick={() =>
                  this.setState({
                    filterTaskOption: null,
                    filterPeopleOption: "peopleResources",
                    error: false,
                  })
                }
              >
                Resources
              </ToggleButton>
            </ToggleButtonGroup>
          </Col>
        </Row>
        <Row>
          <Col className="text-center">
            <Searchbar
              bg-light
              nodes={this.props.nodes}
              users={this.props.users}
              filterTaskOption={this.state.filterTaskOption}
              setSearchValue={this.setSearchValue}
              setTempSearchValue={this.setTempSearchValue}
              value={this.state.tempSearchValue}
            />
          </Col>
        </Row>
        <Row>
          <Col className="text-center p-2">
            <Button
              variant="dark"
              onClick={() => this.handleSearch()}
              style={{ width: "25%" }}
            >
              GO!
            </Button>
          </Col>
        </Row>
        {this.state.error ? (
          <Row className="mt-2">
            <Col style={{ color: "red" }}>
              Your search didn't return anything
            </Col>
          </Row>
        ) : null}
        <hr />
      </Container>
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

  componentDidUpdate(prevProps) {
    if (this.props === prevProps || this.props.users === null) return;

    let tempUsers = [];
    let users = [];
    for (var x = 0; x < this.props.users.length; x++) {
      tempUsers.push(JSON.parse(JSON.stringify(this.props.users[x][0])));
    }

    let check = true;
    for (var y = 0; y < tempUsers.length; y++) {
      for (var z = 0; z < users.length; z++) {
        if (tempUsers[y].id === users[z].id) check = false;
      }

      if (check) users.push(tempUsers[y]);
      else check = true;
    }

    this.setState({ users: users });
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

    if (this.props.filterTaskOption === null) {
      return inputLength === 0
        ? []
        : this.state.users.filter(
            (lang) =>
              lang.name.toLowerCase().slice(0, inputLength) === inputValue
          );
    } else {
      if (parseInt(inputValue)) {
        return inputLength === 0
          ? []
          : this.props.nodes.filter(
              (lang) =>
                lang.id.toString().toLowerCase().slice(0, inputLength) ===
                inputValue
            );
      }

      return inputLength === 0
        ? []
        : this.props.nodes.filter(
            (lang) =>
              lang.name.toLowerCase().slice(0, inputLength) === inputValue
          );
    }
  }

  getSuggestionValue(suggestion) {
    this.props.setSearchValue(suggestion);

    if (this.props.filterTaskOption === null) {
      return suggestion.name + " " + suggestion.surname;
    } else {
      return suggestion.name;
    }
  }

  renderSuggestion(suggestion) {
    if (this.props.filterTaskOption !== null) {
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
              {suggestion.name + " " + suggestion.id}
            </Col>
            <Col></Col>
          </Row>
        </Container>
      );
    } else {
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
  }

  render() {
    const { suggestions } = this.state;
    const value = this.props.value;

    const inputProps = {
      placeholder: this.props.filterTaskOption
        ? "Enter a task name or id"
        : "Enter a person's name",
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
