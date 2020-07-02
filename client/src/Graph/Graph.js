import React from 'react';
import * as joint from 'jointjs'
import _ from 'lodash'
import $ from 'jquery'
import dagre from 'dagre';
import graphlib from 'graphlib';

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
              'font-family': 'monospace' },
            rect: {
                width: width, height: height,
                rx: 5, ry: 5,
                stroke: '#555'
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

    handleDblClick(clickedNode)
    {
        this.props.toggleCreateDependency(clickedNode.model.id)
    }

    async componentDidMount() {
        var graph = new joint.dia.Graph();
        var paper = new joint.dia.Paper({
            el: $('#paper'),
            width: 1000,
            height: 2000,
            gridSize: 1,
            model: graph
        });
        paper.on('cell:pointerclick', this.handleClick);
        paper.on('element:pointerdblclick', this.handleDblClick);

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

    render(){
        return(
            <React.Fragment>
                <div id="paper"></div>
            </React.Fragment>
        )
    }

}

export default Graph