import React from "react";
import * as joint from "jointjs";
import _ from "lodash";
import $ from "jquery";
import dagre from "dagre";
import graphlib from "graphlib";
import CreateDependency from "./Dependency/CreateDependency";
import { Form, Button, Container, Row, Col, Tooltip, OverlayTrigger } from "react-bootstrap";
import CreateTask from "./Task/CreateTask";

function makeLink(edge, criticalPathLinks) {
  let strokeColor = "#000";
  if (criticalPathLinks.includes(edge.id)) strokeColor = "#0275d8";
  let link = new joint.shapes.standard.Link({
    id: "l" + edge.id,
    source: { id: `${edge.source}` },
    target: { id: `${edge.target}` },
    connector: { name: 'smooth' },
    attrs: {
      type: "link",
      line: { stroke: strokeColor },
    },
  });

  return link
}

function makeElement(node, criticalPathNodes) {
  let letterSize = 16;
  let width = 100;
  let height = 80;

  let wraptext = joint.util.breakText(node.name, {
    width: width - 20,
    height: height,
  });

  let statusColor = "#77dd77";
  if (node.type === "Incomplete") {
    let today = new Date();
    if (today > new Date(node.endDate)) statusColor = "#ff6961";
  } else if (node.type === "Complete") {
    statusColor = "#77dd77";
  } else if (node.type === "Issue") {
    statusColor = "#ffae42";
  }
  
  var borderColor = "#000";
  var borderWidth = 1;
  if (criticalPathNodes.includes(node.id)) borderColor = "#0275d8";

  let shadowHighlight = {
    name: 'dropShadow',
    args: {
      dx: 1,
      dy: 1,
      blur: 2
    }
  }
  if(node.highlighted !== undefined){
    shadowHighlight = {
      name: 'highlight',
      args: {
        color: '#009999',
        width: 3,
        opacity: 0.7,
        blur: 5
      }
    }
  }

  return new joint.shapes.standard.Rectangle({
    id: `${node.id}`,
    size: { width: width, height: height },
    attrs: {
      type: "node",
      body: {
        fill: {
          type: 'linearGradient',
          stops: [
            { offset: `${node.progress}%`, color: statusColor },
            { offset: `${node.progress+1}%`, color: '#fff' },
          ]
        },
        filter: shadowHighlight,
        stroke: borderColor,
        strokeWidth: borderWidth,
      },
      text: {
        text: `${wraptext}\n(${node.progress}%)`,
        "font-size": letterSize,
        "font-family": "monospace",
        transform: "translate(2, 2)",
      },
      rect: {
        rx: 10,
        ry: 10,
        transform: "translate(2, 2)",
      },
    },
  });
}

function buildGraph(nodes, rels, criticalPath) {
  let elements = [];
  let links = [];
  let criticalPathLinks = [];
  let criticalPathNodes = [];
  if (criticalPath !== null && criticalPath.path !== null)
    criticalPath.path.segments.forEach((element) => {
      criticalPathNodes.push(element.start.identity.low);
      criticalPathLinks.push(element.relationship.identity.low);
      criticalPathNodes.push(element.end.identity.low);
    });

  _.each(nodes, (node) => {
    elements.push(makeElement(node, criticalPathNodes));
  });

  _.each(rels, (edge) => {
    links.push(makeLink(edge, criticalPathLinks));
  });
  return elements.concat(links);
}

let graphScale = 1;
let paper = null;

class Graph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      graph: null,
      paper: null,
      createTask: false,
      createDependency: false,
      graphScale: 1,
      source: null,
      target: null,
      alert: null,
      displayCriticalPath: true,
    };
    this.handleClick = this.handleClick.bind(this);
    this.drawGraph = this.drawGraph.bind(this);
    this.addTask = this.addTask.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
    this.resetZoom = this.resetZoom.bind(this);
    this.paperScale = this.paperScale.bind(this);
    this.openCreateDependency = this.openCreateDependency.bind(this);
    this.closeCreateDependency = this.closeCreateDependency.bind(this);
    this.toggleCreateDependency = this.toggleCreateDependency.bind(this);
    this.clearDependency = this.clearDependency.bind(this);
  }

  recDepCheck(curr, target) {
    for (let i = 0; i < this.props.links.length; i++) {
      const el = this.props.links[i];
      if (el.source === curr) {
        if (target === el.target) return true;
        return this.recDepCheck(el.target, target);
      }
    }
    return false;
  }

  toggleCreateDependency(clickedNode) {
    if (this.props.userPermission["create"] !== true) {
      alert("You do not have the permission to create a dependency");
      return;
    }

    let new_source_targetID = parseInt(clickedNode.model.id);
    this.setState({ alert: null });

    if (new_source_targetID === null) {
      this.setState({ source: null, target: null });
      return;
    }

    let source_target;
    for (let x = 0; x < this.props.nodes.length; x++) {
      if (this.props.nodes[x].id === new_source_targetID) {
        source_target = this.props.nodes[x];
      }
    }

    if (this.state.source === null) {
      this.setState({ source: source_target });
    } else {
      if (this.state.source.id === new_source_targetID) {
        this.setState({ source: null, target: null });
      } else {
        this.setState({ target: source_target });
        if (
          this.recDepCheck(this.state.target.id, this.state.source.id) === true
        ) {
          this.setState({ target: null, alert: 1 });
        }
      }
    }
  }

  clearDependency() {
    this.setState({ source: null, target: null, alert: null });
  }

  handleClick(clickedNode) {
    if (clickedNode.model.attributes.attrs.type === "node") {
      this.props.toggleSidebar(parseInt(clickedNode.model.id), null);
    } else if (clickedNode.model.attributes.attrs.type === "link") {
      this.props.toggleSidebar(null, parseInt(clickedNode.model.id.substr(1)));
    }
  }

  addTask() {
    if (this.props.userPermission["create"] === true)
      this.setState({ createTask: true });
    else alert("You do not have the permission to create a task");
  }

  paperScale(sx, sy) {
    paper.scale(sx, sy);
  }

  zoomOut() {
    graphScale -= 0.1;
    this.paperScale(graphScale, graphScale);
  }

  zoomIn() {
    graphScale += 0.1;
    this.paperScale(graphScale, graphScale);
  }

  resetZoom() {
    graphScale = 1;
    this.paperScale(graphScale, graphScale);
  }

  componentDidMount() {
    let graph = new joint.dia.Graph();
    paper = new joint.dia.Paper({
      el: $("#paper"),
      width: "100%",
      height: "93%",
      gridSize: 10,
      model: graph,
      linkPinning: false,
    });

    paper.on("element:contextmenu", this.toggleCreateDependency);

    paper.on("cell:pointerclick", this.handleClick);

    let dragStartPosition;
    paper.on("blank:pointerdown", function (event, x, y) {
      dragStartPosition = { x: x * graphScale, y: y * graphScale };
    });

    paper.on("cell:pointerup blank:pointerup", function (cellView, x, y) {
      dragStartPosition = null;
    });

    paper.on("blank:pointerdblclick", this.addTask);

    paper.on('blank:mousewheel', function(evt, x, y, delta) {
      evt.preventDefault();
      evt = evt.originalEvent;
      var normalizedDelta = Math.max(-1, Math.min(1, (delta))) / 50;
      graphScale += normalizedDelta; // the current paper scale changed by delta
      paper.scale(graphScale, graphScale);
    })

    $("#paper").mousemove(function (event) {
      if (dragStartPosition)
        paper.translate(
          event.offsetX - dragStartPosition.x,
          event.offsetY - dragStartPosition.y
        );
    });

    this.setState({ graph: graph, paper: paper });
  }

  async drawGraph(criticalPath) {
    if (this.state.graph === null || this.state.graph === undefined) {
      return;
    }

    let cells = buildGraph(this.props.nodes, this.props.links, criticalPath);
    this.state.graph.resetCells(cells);
    joint.layout.DirectedGraph.layout(this.state.graph, {
      dagre: dagre,
      graphlib: graphlib,
      setLinkVertices: false,
      rankDir: "TB",
      nodeSep: 100,
      rankSep: 100,
    });    
  }

  hideModal() {
    this.setState({ createTask: false });
  }

  openCreateDependency() {
    this.setState({ createDependency: true });
  }

  closeCreateDependency() {
    this.setState({ createDependency: false });
  }

  render() {
    if (this.state.displayCriticalPath) {
      $.post(
        "/project/criticalpath",
        { projId: this.props.project.id },
        (response) => {
          this.drawGraph(response);
        }
      ).fail(() => {
        alert("Unable to get Critical Path");
      });
    } else this.drawGraph(null);

    let dependency = null;
    let color = "outline-dark";
    if (this.state.source != null && this.state.target != null) {
      dependency = this.state.source.name + "→" + this.state.target.name;
      color = "success";
    } else if (this.state.source != null) {
      dependency = this.state.source.name + "→";
    }

    return (
      <React.Fragment>
        <Container className="text-center py-2" fluid>
          <Row>
            <Col className="alignSelfCenter">
              {this.state.alert != null ? (
                <Row>
                  Please select another node that is not higher in the same
                  chain
                </Row>
              ) : null}
              <Row>
                <Col className="text-left align-top " style={{ fontSize: "27px"}}>
                    <OverlayTrigger overlay={<Tooltip>Double click on empty space to create a new task or right click on two tasks to create a dependency</Tooltip>}><i className="fa fa-question-circle"></i></OverlayTrigger>
                </Col>
                {dependency != null ? (
                  <Col className="text-center">
                    <Button
                      onClick={this.openCreateDependency}
                      variant={color}
                      block
                      size="sm"
                    >
                      {dependency}
                    </Button>
                  </Col>
                ) : null}
                {this.state.source != null ? (
                  <Col className="text-center">
                    <Button
                      onClick={this.clearDependency}
                      variant="danger"
                      block
                      size="sm"
                    >
                      <i className="fa fa-close"></i>
                    </Button>
                  </Col>
                ) : null}
                <Col>
                  <Form>
                    <Button
                      variant="outline-secondary"
                      block
                      xs={2}
                      size="sm"
                      style={{height: "31px", wordWrap: "break-word"}}
                      onClick={() => {
                        this.setState({
                          displayCriticalPath: !this.state.displayCriticalPath,
                        });
                      }}
                    >
                      <Form.Check
                        type="switch"
                        id="switchEnabled"
                        label="Display Critical Path"
                        checked={this.state.displayCriticalPath}
                        onChange={(e) => {
                          this.setState({
                            displayCriticalPath: this.state.displayCriticalPath,
                          });
                        }}
                      />
                    </Button>
                  </Form>
                </Col>
                <Col className="text-center">
                  <Button
                    variant="outline-secondary"
                    block
                    size="sm"
                    onClick={this.zoomIn}
                  >
                    <i className="fa fa-search-plus"></i>
                  </Button>
                </Col>
                <Col className="text-center">
                  <Button
                    variant="outline-secondary"
                    block
                    size="sm"
                    onClick={this.zoomOut}
                  >
                    <i className="fa fa-search-minus"></i>
                  </Button>
                </Col>
                <Col className="text-center">
                  <Button
                    variant="dark"
                    size="sm"
                    block
                    onClick={this.resetZoom}
                  >
                    <i className="fa fa-repeat"></i>
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
        <div
          id="paper"
          className="overflow-hidden user-select-none m-10"
        ></div>
        {this.state.createDependency ? (
          <CreateDependency
            closeModal={this.closeCreateDependency}
            getProjectInfo={this.props.getProjectInfo}
            setTaskInfo={this.props.setTaskInfo}
            toggleSidebar={this.props.toggleSidebar}
            clearDependency={this.clearDependency}
            project={this.props.project}
            source={this.state.source}
            target={this.state.target}
          />
        ) : null}
        {this.state.createTask ? (
          <CreateTask
            hideModal={this.hideModal}
            project={this.props.project}
            getProjectInfo={this.props.getProjectInfo}
            setTaskInfo={this.props.setTaskInfo}
            toggleSidebar={this.props.toggleSidebar}
            allUsers={this.props.allUsers}
            assignedProjUsers={this.props.assignedProjUsers}
          />
        ) : null}
      </React.Fragment>
    );
  }
}

export default Graph;
