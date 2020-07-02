import React from 'react';
import * as joint from 'jointjs'
import _ from 'lodash'
import $ from 'jquery'
import dagre from 'dagre';
import graphlib from 'graphlib';
import CreateDependency from './Dependency/CreateDependency'
import {Button} from 'react-bootstrap'

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
        this.handleDblClick = this.handleDblClick.bind(this)
        this.drawGraph = this.drawGraph.bind(this)
        this.createDependency = this.createDependency.bind(this)
        this.hideModal = this.hideModal.bind(this)
        this.zoomIn = this.zoomIn.bind(this)
        this.zoomOut = this.zoomOut.bind(this)
        this.resetZoom = this.resetZoom.bind(this)
        this.paperScale = this.paperScale.bind(this)
        this.state = {createDep:false, source:null, target:null, graphScale:1, }
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

    createDependency(cellView) {
        if(cellView.model.attributes.target !== undefined)
        {
            if(cellView.model.attributes.target.id !== undefined && cellView.model.attributes.target.id !== cellView.model.attributes.source.id)
            {
                this.setState({createDep:true, source:cellView.model.attributes.source.id, target:cellView.model.attributes.target.id})
            }
        }
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

        //paper.on('cell:pointerdown cell:pointerup', this.createDependency);

        $("#paper")
            .mousemove(function(event) {
                if (dragStartPosition)
                    paper.translate(
                        event.offsetX - dragStartPosition.x, 
                        event.offsetY - dragStartPosition.y);
        });
        console.log(graphScale)
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
        this.setState({createDep: false})
    }

    render(){
        this.drawGraph();

        return(
            <React.Fragment>
                <div id="paper" className="h-100 w-100 overflow-hidden user-select-none"></div>
                {this.state.createDep ? <CreateDependency hideModal={ this.hideModal } project={ this.props.project } source={this.state.source} target={this.state.target}/> : null}
                <Button variant="dark" block size="sm" onClick={this.zoomIn}>+</Button>
                <Button variant="dark" block size="sm" onClick={this.zoomOut}>-</Button>
                <Button variant="dark" block size="sm" onClick={this.resetZoom}>Reset</Button>
            </React.Fragment>
        )
    }

}

export default Graph