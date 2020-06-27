import React from 'react';
import ReactDOM from 'react-dom'
import * as joint from 'jointjs'

class Graph extends React.Component {

    constructor(props) {
        super(props);
		this.graph = new joint.dia.Graph();
    }

    async componentDidMount() {
		const response = await fetch('/getAll');
		const body = await response.json();
		if (response.status !== 200) throw Error(body.message);

        this.paper = new joint.dia.Paper({
            el: ReactDOM.findDOMNode(this.refs.placeholder),
            width: 1800,
            height: 600,
            model: this.graph,
            gridSize: 1
        });

		let rect = []
		for(var x = 0; x < body.nodes.length; x++)
		{
			var str = body.nodes[x].name
			rect = new joint.shapes.basic.Rect({
				position: { x: 100 + (x*120), y: 30 },
				size: { width: 100, height: 30 },
				attrs: {
					rect: { fill: 'blue' },
					text: { text: str, fill: 'white' }
				}
			});

			this.graph.addCells([rect]);
		}
    }

    render() {
        return <div ref="placeholder" ></div>;
    }
}

export default Graph;