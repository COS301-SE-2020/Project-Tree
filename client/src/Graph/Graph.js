import React from 'react';
import * as joint from 'jointjs'
import _ from 'lodash'
import $ from 'jquery'
import dagre from 'dagre';
import graphlib from 'graphlib';
import CreateDependency from './Dependency/CreateDependency'

function makeLink(edge) {
    var lnk = new joint.dia.Link({
        id:edge.id,
        source: { id: edge.source },
        target: { id: edge.target },
        attrs: {
            '.marker-target': { d: 'M 4 0 L 0 2 L 4 4 z' },
            type:'link',
        },
        labels: [{
            position: 0.5,
            attrs: {
                text: {
                    text: edge.relationshipType
                }
            }
        }],
        connector: {name: 'normal'}
    });
    return lnk;
}

function makeElement(node) {
    var maxLineLength = _.max(node.name.split('\n'), function(l) { return l.length; }).length;

    var letterSize = 12;
    var width = 2 * (letterSize * (0.6 * maxLineLength + 1));
    var height = 2 * ((node.name.split('\n').length + 1) * letterSize);

    return new joint.shapes.basic.Rect({
        id: node.id,
        size: { width: 100, height: height },
        attrs: {
            type:'node',
            text: { 
              text: node.name, 
              'font-size': letterSize, 
              'font-family': 'monospace',
            },
            rect: {
                width: width, height: height,
                rx: 5, ry: 5,
                stroke: '#555',
                magnet: true
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

class Graph extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this)
        this.handleDblClick = this.handleDblClick.bind(this)
        this.createDependency = this.createDependency.bind(this)
        this.hideModal = this.hideModal.bind(this)
        this.state = {createDep:false, source:null, target:null}
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
        if(cellView.model.attributes.target.id !== undefined && cellView.model.attributes.target.id !== cellView.model.attributes.source.id)
        {
            this.setState({createDep:true, source:cellView.model.attributes.source.id, target:cellView.model.attributes.target.id})
        }
    }

    handleDblClick(clickedNode)
    {
        this.props.toggleCreateDependency(clickedNode.model.id)
    }

    async componentDidMount() {
        var graph = new joint.dia.Graph();
        var paper = new joint.dia.Paper({
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

        paper.on('cell:pointerdown cell:pointerup', this.createDependency);

        $("#paper")
            .mousemove(function(event) {
                if (dragStartPosition)
                    paper.translate(
                        event.offsetX - dragStartPosition.x, 
                        event.offsetY - dragStartPosition.y
                        );
            });

        var cells = buildGraph(this.props.nodes,this.props.links);
        graph.resetCells(cells);
        joint.layout.DirectedGraph.layout(graph, {
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
        return(
            <React.Fragment>
                <div id="paper" className="h-100 w-100 overflow-hidden user-select-none"></div>
                {this.state.createDep ? <CreateDependency hideModal={ this.hideModal } project={ this.props.project } source={this.state.source} target={this.state.target}/> : null}
            </React.Fragment>
        )
    }

}

export default Graph