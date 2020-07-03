import React from 'react';
import * as joint from 'jointjs'
import _ from 'lodash'
import $ from 'jquery'
import dagre from 'dagre';
import graphlib from 'graphlib';
import CreateDependency from './Dependency/CreateDependency'
import {Button, Container, Row, Col } from 'react-bootstrap'
import CreateTask from './Task/CreateTask';

function makeLink(edge) {
    return new joint.shapes.standard.Link({
        id:edge.id,
        source: { id: edge.source },
        target: { id: edge.target },
        attrs: {
            type:'link'
        }
    })
}

function makeElement(node) {
    var maxLineLength = _.max(node.name.split('\n'), function(l) { return l.length; }).length;
    
    var letterSize = 12;
    var width = 2 * (letterSize * (0.6 * maxLineLength + 1));
    var height = 2 * ((node.name.split('\n').length + 1) * letterSize);

    var statusColor = '#fff'
    if(node.progress === "Incomplete"){
        let today = new Date();
        if(parseInt(today.getFullYear()) <= parseInt(node.endDate.year.low)){
            if(parseInt(today.getMonth()+1)<=parseInt(node.endDate.month.low)){
                if(parseInt(today.getDate()) > parseInt(node.endDate.day.low)){
                    statusColor = '#ff6961'
                }
            }
            else{
                statusColor = '#ff6961'
            }
        }
        else{
            statusColor = '#ff6961'
        }
    }
    else if(node.progress === "Complete"){
        statusColor = '#77dd77'
    }
    else if(node.progress === "Issue"){
        statusColor = '#ffae42'
    }

    return new joint.shapes.standard.Rectangle({
        id: node.id,
        size: { width: width, height: height },
        attrs: {
            type:'node',
            body: {
                fill: statusColor
            },
            text: { 
              text: node.name, 
              'font-size': letterSize, 
              'font-family': 'monospace',
            },
            rect: {
                rx: 10, ry: 10,
                stroke: '#000',
                //magnet: true
            }
        }
    });
}

function buildGraph(nodes,rels) {
    var elements = [];
    var links = [];
      
    _.each(nodes, function(node) {
      elements.push(makeElement(node));
    })
    
    _.each(rels, function(edge) {
      links.push(makeLink(edge)); 
    })
    return elements.concat(links);
}

var graphScale = 1
var paper = null

class Graph extends React.Component {
    constructor(props) {
        super(props);
        this.state={graph:null, paper:null}
        this.handleClick = this.handleClick.bind(this)
        this.handleDblClick = this.handleDblClick.bind(this)
        this.drawGraph = this.drawGraph.bind(this)
        // this.createDependency = this.createDependency.bind(this)
        this.addTask = this.addTask.bind(this)
        this.hideModal = this.hideModal.bind(this)
        this.zoomIn = this.zoomIn.bind(this)
        this.zoomOut = this.zoomOut.bind(this)
        this.resetZoom = this.resetZoom.bind(this)
        this.paperScale = this.paperScale.bind(this)
        this.state = {createTask:false, source:null, target:null, graphScale:1, }
    }

    handleClick(clickedNode){
        if(clickedNode.model.attributes.attrs.type === 'node')
        {
            this.props.toggleSidebar(clickedNode.model.id, null);
        }

        else if(clickedNode.model.attributes.attrs.type === 'link')
        {
            this.props.toggleSidebar(null, clickedNode.model.id);
        }
    }

    // createDependency(cellView) {
    //     if(cellView.model.attributes.target !== undefined)
    //     {
    //         if(cellView.model.attributes.target.id !== undefined && cellView.model.attributes.target.id !== cellView.model.attributes.source.id)
    //         {
    //             this.setState({createDep:true, source:cellView.model.attributes.source.id, target:cellView.model.attributes.target.id})
    //         }
    //     }
    // }

    addTask(){
        this.setState({createTask:true})
    }

    handleDblClick(clickedNode)
    {
        this.props.toggleCreateDependency(clickedNode.model.id)
    }

    paperScale(sx, sy) {
        paper.scale(sx, sy);
    };

    zoomOut() {
        graphScale -= 0.1;
        this.paperScale(graphScale, graphScale);
    };

    zoomIn() {
        graphScale += 0.1;
        this.paperScale(graphScale, graphScale);
    }

    resetZoom() {
        graphScale = 1;
        this.paperScale(graphScale, graphScale);
    };

    componentDidMount(){
        var graph = new joint.dia.Graph();
        paper = new joint.dia.Paper({
            el: $('#paper'),
            width: $('#paper').width(),
            height: $('#paper').height(),
            gridSize: 1,
            model: graph,
            //restrictTranslate: true,
            linkPinning: false,
        });

        paper.on('cell:pointerclick', this.handleClick);

        paper.on('element:pointerdblclick', this.handleDblClick);
        
        var dragStartPosition
        paper.on('blank:pointerdown',
            function(event, x, y) {
                dragStartPosition = { x: x, y: y};
            }
        );

        paper.on('cell:pointerup blank:pointerup', function(cellView, x, y) {
            dragStartPosition = null;
        });

        paper.on('blank:pointerdblclick', this.addTask);

        //paper.on('cell:pointerdown cell:pointerup', this.createDependency);

        $("#paper")
            .mousemove(function(event) {
                if (dragStartPosition)
                    paper.translate(
                        event.offsetX - dragStartPosition.x, 
                        event.offsetY - dragStartPosition.y
                    );
        });

        this.setState({graph: graph, paper: paper});
    }

    async drawGraph() {
        if(this.state.graph === null || this.state.graph === undefined){
            return;
        }
        
        var cells = buildGraph(this.props.nodes,this.props.links);
        this.state.graph.resetCells(cells);
        joint.layout.DirectedGraph.layout(this.state.graph, {
            dagre: dagre,
            graphlib: graphlib,
            setLinkVertices: false,
            rankDir: "TB",
            nodeSep: 100,
            rankSep: 100
        })
    }

    hideModal(){
        this.setState({createTask: false})
    }

    render(){
        this.drawGraph();

        return(
            <React.Fragment>
                <Container className="text-center py-2">
                    <Row>
                        <Col></Col>
                        <Col>
                        <Row>
                            <Col className="text-center"><Button variant="outline-secondary" block size="sm" onClick={this.zoomIn}><i className="fa fa-search-plus"></i></Button></Col>
                            <Col className="text-center"><Button variant="outline-secondary" block size="sm" onClick={this.zoomOut}><i className="fa fa-search-minus"></i></Button></Col>
                            <Col className="text-center"> <Button variant="dark" size="sm" block onClick={this.resetZoom}><i className="fa fa-repeat"></i></Button></Col>
                            </Row>
                        </Col>
                        <Col></Col>
                    </Row>
                </Container>
                <div id="paper" className="h-100 w-100 overflow-hidden user-select-none"></div>
                {/* {this.state.createDep ? <CreateDependency hideModal={ this.hideModal } project={ this.props.project } source={this.state.source} target={this.state.target}/> : null} */}
                {this.state.createTask ? <CreateTask hideModal={this.hideModal} project={this.props.project} setTaskInfo={this.props.setTaskInfo}/> : null}
            </React.Fragment>
        )
    }

}

export default Graph