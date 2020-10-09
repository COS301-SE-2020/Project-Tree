import React from "react";
import * as joint from "jointjs";
import _ from "lodash";
import $ from "jquery";
import dagre from "dagre";
import graphlib from "graphlib";
import CreateDependency from "./Dependency/CreateDependency";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import CreateTask from "./Task/CreateTask";
import "./style.scss";

function makeLink(edge, criticalPathLinks) {
  let strokeColor = "#000";
  if (criticalPathLinks.includes(edge.id)) strokeColor = "#0275d8";
  let link = new joint.shapes.standard.Link({
    id: "l" + edge.id,
    source: { id: `${edge.source}` },
    target: { id: `${edge.target}` },
    // connector: { name: "rounded" },
    // router: { name: "manhattan" },
    connector: { name: 'smooth' },
    attrs: {
      type: "link",
      line: { stroke: strokeColor },
    },
  });

  return link;
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
  let fillAmount = null;
  if (node.type === "Incomplete") {
    let today = new Date();
    if (today > new Date(node.endDate)) {
      statusColor = "#ff6961";
      fillAmount = [{ offset: `100%`, color: statusColor }];
    } else {
      fillAmount = [
        { offset: `${node.progress}%`, color: statusColor },
        { offset: `${node.progress + 1}%`, color: "#fff" },
      ];
    }
  } else if (node.type === "Complete") {
    statusColor = "#77dd77";
    fillAmount = [{ offset: `100%`, color: statusColor }];
  } else if (node.type === "Issue") {
    statusColor = "#ffae42";
    fillAmount = [{ offset: `100%`, color: statusColor }];
  }

  var borderColor = "#000";
  var borderWidth = 1;
  if (criticalPathNodes.includes(node.id)) borderColor = "#0275d8";

  let shadowHighlight = {
    name: "dropShadow",
    args: {
      dx: 1,
      dy: 1,
      blur: 2,
    },
  };
  if (node.highlighted !== undefined) {
    shadowHighlight = {
      name: "highlight",
      args: {
        color: "#009999",
        width: 3,
        opacity: 0.7,
        blur: 5,
      },
    };
  }

  let xVal, yVal;
  if(node.changedX !== undefined){
    xVal = node.changedX;
    yVal = node.changedY;
  }

  else{
    xVal = node.positionX;
    yVal = node.positionY;
  }

  return new joint.shapes.standard.Rectangle({
    id: `${node.id}`,
    size: { width: width, height: height },
    position: { x: xVal, y: yVal },
    attrs: {
      type: "node",
      body: {
        fill: {
          type: "linearGradient",
          stops: fillAmount,
        },
        filter: shadowHighlight,
        stroke: borderColor,
        strokeWidth: borderWidth,
      },
      text: {
        text: `${wraptext}\n(${node.progress}%)`,
        "font-size": letterSize,
        "font-family": "monospace",
        transform: "translate(15, 15)",
      },
      rect: {
        rx: 10,
        ry: 10,
        transform: "translate(15, 15)",
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

function createViews(allNodes, viewNodes) {
  let clonedNodes = allNodes;
  if (viewNodes !== null) {
    for (let x = 0; x < viewNodes.length; x++) {
      for (let y = 0; y < allNodes.length; y++) {
        if (viewNodes[x].originalNode === parseInt(allNodes[y].id)) {
          let clonedNode = allNodes[y].clone();

          var width = 100;
          var height = 80;

          var wraptext = joint.util.breakText(
            `(View) ${allNodes[y].attributes.attrs.text.text}`,
            {
              width: width - 20,
              height: height,
            }
          );

          clonedNode.attributes.attrs.text.text = `${wraptext}`;
          clonedNode.attributes.attrs.originId = allNodes[y].id;
          clonedNode.attributes.id = `${viewNodes[x].id}`;
          clonedNode.id = `${viewNodes[x].id}`;
          clonedNodes.push(clonedNode);
        }

        for (let z = 0; z < viewNodes[x].outDepArr.length; z++) {
          if (`l${viewNodes[x].outDepArr[z].low}` === allNodes[y].id) {
            allNodes[y].attributes.source = { id: `${viewNodes[x].id}` };
          }
        }

        for (let a = 0; a < viewNodes[x].inDepArr.length; a++) {
          if (`l${viewNodes[x].inDepArr[a].low}` === allNodes[y].id) {
            allNodes[y].attributes.target = { id: `${viewNodes[x].id}` };
          }
        }
      }
    }
  }
  return clonedNodes;
}

var graphScale = 1;
var paper = null;

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
      viewId_source: null,
      viewId_target: null,
      displayCriticalPath: true,
      savePosition: false,
      newPosition: {x:0, y:0}
    };
    this.handleClick = this.handleClick.bind(this);
    this.drawGraph = this.drawGraph.bind(this);
    this.addTask = this.addTask.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
    this.resetZoom = this.resetZoom.bind(this);
    this.paperScale = this.paperScale.bind(this);
    this.openCreateDependency = this.openCreateDependency.bind(this);
    this.closeCreateDependency = this.closeCreateDependency.bind(this);
    this.toggleCreateDependency = this.toggleCreateDependency.bind(this);
    this.clearDependency = this.clearDependency.bind(this);
    this.moveNode = this.moveNode.bind(this);
    this.autoPosition = this.autoPosition.bind(this);
  }

  recDepCheck(curr, target) {
    let check = false;
    for (let i = 0; i < this.props.links.length; i++) {
      const el = this.props.links[i];
      if (el.source === curr) {
        if (target === el.target) check = true;
        check = check || this.recDepCheck(el.target, target);
      }
    }
    return check;
  }

  toggleCreateDependency(clickedNode) {
    if(this.state.savePosition === true){
      return;
    }

    if (this.props.userPermission["create"] !== true) {
      alert("You do not have the permission to create a dependency");
      return;
    }

    var new_source_targetID = parseInt(clickedNode.model.id);
    if (clickedNode.model.attributes.attrs.originId !== undefined) {
      new_source_targetID = parseInt(
        clickedNode.model.attributes.attrs.originId
      );
    }
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
      if (clickedNode.model.attributes.attrs.originId !== undefined) {
        this.setState({
          source: source_target,
          viewId_source: clickedNode.model.id,
        });
      } else {
        this.setState({ source: source_target });
      }
    } else {
      if (this.state.source.id === new_source_targetID) {
        this.setState({ source: null, target: null });
      } else {
        if (clickedNode.model.attributes.attrs.originId !== undefined) {
          this.setState({
            target: source_target,
            viewId_target: clickedNode.model.id,
          });
        } else {
          this.setState({ target: source_target });
        }
        if (
          this.recDepCheck(this.state.target.id, this.state.source.id) === true
        ) {
          this.setState({ target: null, alert: 1 });
          return;
        } else if (
          this.alreadyExists(this.state.target.id, this.state.source.id)
        ) {
          this.setState({ target: null, alert: 2 });
          return;
        }
      }
    }
  }

  alreadyExists(target, source) {
    let rels = this.props.links;

    for (var x = 0; x < rels.length; x++) {
      if (target === rels[x].target && source === rels[x].source) return true;
    }

    return false;
  }

  clearDependency() {
    this.setState({
      source: null,
      target: null,
      alert: null,
      viewId_source: null,
      viewId_target: null,
    });
  }

  handleClick(clickedNode) {
    if (clickedNode.model.attributes.attrs.type === "node") {
      if (clickedNode.model.attributes.attrs.originId !== undefined) {
        this.props.toggleSidebar(
          parseInt(clickedNode.model.attributes.attrs.originId),
          null,
          clickedNode.model.id
        );
      } else {
        this.props.toggleSidebar(parseInt(clickedNode.model.id), null);
      }
    } else if (clickedNode.model.attributes.attrs.type === "link") {
      let source = parseInt(clickedNode.model.attributes.source.id);
      let target = parseInt(clickedNode.model.attributes.target.id);
      let sourceView = null;
      let targetView = null;

      for (let x = 0; x < this.props.views.length; x++) {
        if (this.props.views[x].id === source) {
          sourceView = source;
        } else if (this.props.views[x].id === target) {
          targetView = target;
        }
      }
      this.props.toggleSidebar(
        null,
        parseInt(clickedNode.model.id.substr(1)),
        undefined,
        sourceView,
        targetView
      );
    }
  }

  addTask(cell) {
    if(this.state.savePosition === true) return;
    if (this.props.userPermission["create"] === true)
      this.setState({ createTask: true, newPosition: {x:cell.offsetX, y:cell.offsetY} });
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

  moveNode(cell){
    if(this.state.source!==null) return;

    var center = cell.getBBox().topLeft();
    var id = cell.id
    for(let x = 0; x < this.props.nodes.length; x++){
      if(this.props.nodes[x].id === parseInt(id)){
        this.props.nodes[x].changedX=center.x
        this.props.nodes[x].changedY=center.y
      }
    }

    if(this.props.userPermission["update"]===false){
      return;
    }

    if(this.state.savePosition !== true){
      this.setState({savePosition:true});
    }
  }

  async saveChanges(){
    let changedNodes = [];
    let nodes = [...this.props.nodes]

    for(let x=0; x<nodes.length; x++){
      if(nodes[x].changedX !== undefined){
        changedNodes.push(nodes[x]);
      }
    }

    let data = {
      changedNodes: changedNodes
    };

    this.setState({savePosition:false})

    data = JSON.stringify(data);
    const response = await fetch("/task/savePositions", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: data,
    });
    
    const body = await response.json();
    if(body.message !== "ok"){
      alert("Graph positions could not be saved")
    }
  }

  clearChanges(){
    let nodes = this.props.nodes;

    for(let x=0; x<nodes.length; x++){
      if(nodes[x].changedX !== undefined){
        nodes[x].changedX = undefined;
        nodes[x].changedY = undefined;
      }
    }

    this.setState({savePosition:false});
  }

  autoPosition(){
    joint.layout.DirectedGraph.layout(this.state.graph, {
      dagre: dagre,
      graphlib: graphlib,
      setLinkVertices: false,
      rankDir: "TB",
      nodeSep: 100,
      rankSep: 100,
    });
    this.setState({savePosition:true});
  }

  componentDidMount() {
    let graph = new joint.dia.Graph();
    paper = new joint.dia.Paper({
      el: $("#paper"),
      width: "100%",
      height: "93%",
      gridSize: 1,
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

    paper.on("blank:mousewheel", function (evt, x, y, delta) {
      evt.preventDefault();
      evt = evt.originalEvent;
      var normalizedDelta = Math.max(-1, Math.min(1, delta)) / 50;
      graphScale += normalizedDelta; // the current paper scale changed by delta
      paper.scale(graphScale, graphScale);
    });

    graph.on('change:position', this.moveNode);

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

    var cells = buildGraph(this.props.nodes, this.props.links, criticalPath);
    cells = createViews(cells, this.props.views);
    this.state.graph.resetCells(cells);
  }

  showModal() {
    this.setState({ createTask: true });
  }

  hideModal() {
    this.setState({ createTask: false, newPosition: {x:0, y:0} });
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
              <Row>
                <Col
                  className="text-left align-top "
                  style={{ fontSize: "27px" }}
                >
                  <OverlayTrigger
                    placement='auto'
                    overlay={
                      <Tooltip className="helpTooltip">
                        Double click on an empty space to create a new task or
                        right click on two tasks to create a dependency
                        <LegendSidebar />
                      </Tooltip>
                    }
                  >
                    <i className="fa fa-question-circle"></i>
                  </OverlayTrigger>
                </Col>
                {this.state.savePosition === true ? (
                  <React.Fragment>
                    <Col className="text-center">
                    <Button
                      block
                      variant="success"
                      size="sm"
                      style={{ overflow: "hidden" }}
                      onClick={()=>this.saveChanges()}
                    >
                      Save Changes
                    </Button>
                  </Col>
                  <Col className="text-center">
                    <Button
                      block
                      variant="danger"
                      size="sm"
                      style={{ overflow: "hidden" }}
                      onClick={()=>this.clearChanges()}
                    >
                      Clear Changes
                    </Button>
                  </Col>
                  </React.Fragment>
                ): null}
                {this.props.userPermission["create"] === true && this.state.savePosition === false ? (
                  <Col className="text-center">
                    <Button
                      onClick={()=>this.showModal()}
                      block
                      variant="outline-secondary"
                      size="sm"
                      style={{ overflow: "hidden" }}
                    >
                      Create Task
                    </Button>
                  </Col>
                ): null}
                {dependency != null ? (
                  <Col className="text-center">
                    <Button
                      onClick={this.openCreateDependency}
                      variant={color}
                      block
                      size="sm"
                      disabled={this.state.target === null}
                      style={{ overflow: "hidden" }}
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
                      onClick={() => {
                        this.setState({
                          displayCriticalPath: !this.state.displayCriticalPath,
                        });
                      }}
                    >
                      <Form.Check
                        type="switch"
                        id="switchEnabled"
                        label="Critical Path"
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
                    size="sm"
                    block
                    onClick={this.autoPosition}
                  >
                    Auto Postion Tasks
                  </Button>
                </Col>
              </Row>
              {this.state.alert === 1 ? (
                <Row style={{ color: "red" }}>
                  Please select another node that is not higher in the same
                  chain
                </Row>
              ) : null}

              {this.state.alert === 2 ? (
                <Row style={{ color: "red" }}>
                  This dependency already exists
                </Row>
              ) : null}
            </Col>
          </Row>
        </Container>
        <div class="wrapper">
          <div id="zoomButtons" className="overflow-hidden user-select-none m-10">
            <Col id="increaseZoom" className="text-center">
              <Button
                variant="outline-secondary"
                block
                size="sm"
                onClick={this.zoomIn}
              >
                <i className="fa fa-search-plus"></i>
              </Button>
            </Col>
            <Col id="decreaseZoom" className="text-center">
              <Button
                variant="outline-secondary"
                block
                size="sm"
                onClick={this.zoomOut}
              >
                <i className="fa fa-search-minus"></i>
              </Button>
            </Col>
            <Col id="resetZoom" className="text-center">
              <Button
                variant="dark"
                size="sm"
                block
                onClick={this.resetZoom}
              >
                <i className="fa fa-repeat"></i>
              </Button>
            </Col>
          </div>
          <div id="paper" className="overflow-hidden user-select-none m-10"></div>
        </div>
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
            viewId_source={this.state.viewId_source}
            viewId_target={this.state.viewId_target}
          />
        ) : null}
        {this.state.createTask ? (
          <CreateTask
            hideModal={this.hideModal}
            project={this.props.project}
            position={this.state.newPosition}
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

class LegendSidebar extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Container
          className="text-black text-center mb-3"
        >
          <Row>
            <Col className="text-center">
              <h5>Graph key</h5>
            </Col>
          </Row>
          <Row>
            <Col></Col>
            <Col
              className="text-center border rounded border-dark m-1"
              xs={6}
              style={{
                backgroundColor: "white",
                color: "black",
                height: "30px",
              }}
            >
              Incomplete
            </Col>
            <Col></Col>
          </Row>
          <Row>
            <Col></Col>
            <Col
              className="text-center border rounded border-dark m-1"
              xs={6}
              style={{
                backgroundColor: "#77dd77",
                color: "black",
                height: "30px",
              }}
            >
              Complete
            </Col>
            <Col></Col>
          </Row>
          <Row>
            <Col></Col>
            <Col
              className="text-center border rounded border-dark m-1"
              xs={6}
              style={{
                backgroundColor: "#ff6961",
                color: "black",
                height: "30px",
              }}
            >
              Overdue
            </Col>
            <Col></Col>
          </Row>
          <Row>
            <Col></Col>
            <Col
              className="text-center border rounded border-dark m-1"
              xs={6}
              style={{
                backgroundColor: "#ffae42",
                color: "black",
                height: "30px",
              }}
            >
              Issue
            </Col>
            <Col></Col>
          </Row>
          <Row>
            <Col></Col>
            <Col
              className="text-center border rounded border-primary m-1 align-items-center"
              xs={6}
              style={{
                backgroundColor: "white",
                color: "black",
                height: "30px",
              }}
            >
              Critical Path
            </Col>
            <Col></Col>
          </Row>
          <Row>
            <Col></Col>
            <Col
              className="text-center border rounded border-info m-1 align-items-center "
              xs={6}
              style={{
                backgroundColor: "white",
                color: "black",
                height: "30px",
                boxShadow: "0 0 10px #009999",
              }}
            >
              Highlight
            </Col>
            <Col></Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default Graph;
