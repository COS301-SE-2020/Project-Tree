import React from 'react';
import ReactDOM from 'react-dom'
import * as joint from 'jointjs'

function stringifyFormData(fd) {
    const data = {};
      for (let key of fd.keys()) {
        data[key] = fd.get(key);
    }
    return JSON.stringify(data, null, 2);
}

class Graph extends React.Component {

    constructor(props) {
        super(props);
		this.graph = new joint.dia.Graph();
    }

    async componentDidMount() {
		const response = await fetch('/getProject',{
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
            body:JSON.stringify({ id: 0 })
        });
		const body = await response.json();
		//console.log(body)
		if (response.status !== 200) throw Error(body.message);

       	this.paper = new joint.dia.Paper({
            el: ReactDOM.findDOMNode(this.refs.placeholder),
            width: 1800,
            height: 600,
            model: this.graph,
            gridSize: 1
		});
		
		let nodes = []

		let rect = []
		for(var x = 0; x < body.tasks.length; x++)
		{
			var str = body.tasks[x].record._fields[0].properties.name
			rect = new joint.shapes.basic.Rect({
				position: { x: 100 + (x*120), y: 30 },
				size: { width: 100, height: 30 },
				attrs: {
					rect: { fill: 'blue' },
					text: { text: str, fill: 'white' },
					ownId: {id: body.tasks[x].record._fields[0].identity.low}
				}
			});

			this.graph.addCells([rect]);
			nodes.push(rect)
		}
		//console.log(nodes)
		for(var y = 0; y < body.rels.length; y++)
		{
			var label = body.rels[y].record._fields[0].properties.relationshipType
			var from = body.rels[y].record._fields[0].start.low
			var to = body.rels[y].record._fields[0].end.low
			var startRec;
			var endRec;
			for(var i = 0; i < nodes.length; i++)
			{
				//console.log(from , nodes[i].attributes.attrs.ownId.id)
				if(from === nodes[i].attributes.attrs.ownId.id)
				{
					startRec = nodes[i]
					console.log(startRec)
				}

				if(to === nodes[i].attributes.attrs.ownId.id)
				{
					endRec = nodes[i]
				}
			}
			var link = new joint.shapes.standard.Link();
			link.source(startRec);
			link.target(endRec);
			link.appendLabel({
				attrs: {
					text: {
						text: label
					}
				}
			});
			link.addTo(this.graph);
		}

    }

    render() {
        return <div ref="placeholder" ></div>;
    }
}

export default Graph;