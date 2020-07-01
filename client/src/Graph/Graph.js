import React from 'react';
import * as joint from 'jointjs'
import _ from 'lodash'
import $ from 'jquery'
import dagre from 'dagre';
import graphlib from 'graphlib';

function makeLink(edge) {
    var lnk = new joint.dia.Link({
        id:edge[0].id,
        source: { id: edge[0].source },
        target: { id: edge[0].target },
        attrs: {
            '.marker-target': { d: 'M 4 0 L 0 2 L 4 4 z' }
        },
        labels: [{
            position: 0.5,
            attrs: {
                text: {
                    text: edge[0].label
                }
            }
        }],
        connector: {name: 'normal'}
    });
    return lnk;
}

function makeElement(node) {
    var maxLineLength = _.max(node[0].name.split('\n'), function(l) { return l.length; }).length;

    var letterSize = 12;
    var width = 2 * (letterSize * (0.6 * maxLineLength + 1));
    var height = 2 * ((node[0].name.split('\n').length + 1) * letterSize);

    return new joint.shapes.basic.Rect({
        id: node[0].id,
        size: { width: 100, height: height },
        attrs: {
            text: { 
              text: node[0].name, 
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
    async componentDidMount() {
        var graph = new joint.dia.Graph();
        this.paper = new joint.dia.Paper({
            el: $('#paper'),
            width: 2000,
            height: 2000,
            gridSize: 1,
            model: graph
        });
        this.paper.on('cell:pointerclick', 
            function(clickedNode) { 
                alert('Node ID: ' + clickedNode.model.id); 
            }
        );

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