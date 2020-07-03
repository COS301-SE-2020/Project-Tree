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
    var link = new joint.shapes.standard.Link({
        id:edge.id,
        source: { id: edge.source },
        target: { id: edge.target },
        attrs: {
            type:'link'
        }
    })
    return link
}

function makeElement(node) {
    var maxLineLength = _.max(node.name.split('\n'), function(l) { return l.length; }).length;
    
    var letterSize = 12;
    var width = 2 * (letterSize * (0.6 * maxLineLength + 1));
    var height = 2 * ((node.name.split('\n').length + 1) * letterSize);

    return new joint.shapes.basic.Rect({
        id: node.id,
        size: { width: width, height: height },
        attrs: {
            type:'node',
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
        this.drawGraph = this.drawGraph.bind(this)
        this.addTask = this.addTask.bind(this)
        this.hideModal = this.hideModal.bind(this)
        this.zoomIn = this.zoomIn.bind(this)
        this.zoomOut = this.zoomOut.bind(this)
        this.resetZoom = this.resetZoom.bind(this)
        this.paperScale = this.paperScale.bind(this)
        this.toggleCreateDependency = this.toggleCreateDependency.bind(this)
        this.clearDependency = this.clearDependency.bind(this)
        this.state = {createTask:false, createDependency:false, graphScale:1, source:null, target:null }
    }

    clearDependency(){
        this.setState({source:null, target:null});
    }

    toggleCreateDependency(clickedNode){
        var new_source_targetID = clickedNode.model.id

        if(new_source_targetID == null)
        {
            this.setState({source:null, target:null});
            return;
        }

        var source_target
        for(var x=0; x<this.props.nodes.length; x++)
        {
            if(this.props.nodes[x].id === new_source_targetID){
                source_target = this.props.nodes[x];
            }
        }
        
        if(this.state.source === null)
        {
            this.setState({source:source_target});
        }

        else{
            if(this.state.source.id === new_source_targetID)
            {
                this.setState({source:null, target:null})
            }
            else{
                this.setState({target:source_target});
            }
        }
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

    addTask(){
        this.setState({createTask:true})
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

        paper.on('element:contextmenu', this.toggleCreateDependency);

        paper.on('cell:pointerclick', this.handleClick);
        
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

    hideDependecyModal(){
        this.setState({createDependency:false})
    }

    render(){
        this.drawGraph();

        var both = false;
        var dependency = null
        if(this.state.source != null && this.state.target != null)
        {
            dependency = this.state.source.name+"→"+this.state.target.name
            both = true
        }

        else if(this.state.source != null){
            dependency = this.state.source.name+"→"
        }

        return(
            <React.Fragment>
                <Container className="text-center py-2">
                    <Row>
                        <Col></Col>
                        <Col>
                        <Row>
                            {dependency != null ? <Col className="text-center"><Button variant="outline-secondary" block size="sm">{dependency}</Button></Col> : null}
                            {this.state.source != null ? <Col className="text-center"><Button onClick={this.clearDependency} variant="outline-secondary" block size="sm">X</Button></Col> : null}
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