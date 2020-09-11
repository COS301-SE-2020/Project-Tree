import React from "react";
import { Container, Row, Col, Button, ProgressBar } from "react-bootstrap";
import { Chart } from 'react-google-charts';
import image from '../Images/project_analytic_2.svg'

export default class DependencyPieChartsComponent extends React.Component {
    createCriticalPath() {
        let list = [];
        if (
        this.props.criticalPath !== undefined &&
          this.props.criticalPath.path !== undefined &&
          this.props.criticalPath !== null &&
          this.props.criticalPath.path !== null 
        ) {
          this.props.criticalPath.path.segments.forEach((el, index) => {
            if (index === 0) {
              list.push({
                id: el.start.identity.low,
                name: el.start.properties.name,
                description: el.start.properties.description,
                type: el.start.properties.type,
                progress: el.start.properties.progress.low,
                startDate: el.start.properties.startDate,
                endDate: el.start.properties.endDate,
                duration: el.start.properties.duration.low,
              });
            }
            list.push({
              id: el.end.identity.low,
              name: el.end.properties.name,
              description: el.end.properties.description,
              type: el.end.properties.type,
              progress: el.end.properties.progress.low,
              startDate: el.end.properties.startDate,
              endDate: el.end.properties.endDate,
              duration: el.end.properties.duration.low,
            });
          });
        } 

        return list;
    }

    formatData(tasks){
        let data = [];
        data.push(['Task', 'Number of Dependencies']);

        if(this.props.rels.length === 0) return data;

        tasks.forEach((task)=>{
            data.push(
                [task.name, this.getNumberOfDependencies(task)]
            )
        });

        return data;
    }

    getNumberOfDependencies(task){
        let count = 0;
        let rels = this.props.rels;

        for(var x=0; x<rels.length; x++){
            if(task.id === rels[x].source){
                count++;
            }
        }

        return count;
    }

    render(){
        let tasks = this.formatData(this.props.tasks)
        let criticalPath = this.formatData(this.createCriticalPath());

        console.log(tasks)

        return(
            <React.Fragment>
                <Container fluid>
                    <Row>
                        <Col>
                            <h4>Dependency Info</h4>
                        </Col>
                    </Row>
                    <Row className="align-items-center my-2">
                        {tasks.length === 1 ? 
                            <Col className="text-center">
                                No dependencies to display
                                <img src={image} style={{ width: "90%", height:"10em" }} alt="Logo" />
                            </Col>
                            :
                            <Col>
                                <Chart
                                    width={'100%'}
                                    height={'100%'}
                                    chartType="PieChart"
                                    loader={<div>Loading Chart</div>}
                                    data={tasks}
                                    options={{
                                        title: 'Number of dependencies per task',
                                        sliceVisibilityThreshold: 0.1
                                    }}
                                    rootProps={{ 'data-testid': '1' }}
                                />
                            </Col>
                        }
                        {criticalPath.length === 1 ? null:
                            <Col>
                                <Chart
                                    width={'100%'}
                                    height={'100%'}
                                    chartType="PieChart"
                                    loader={<div>Loading Chart</div>}
                                    data={criticalPath}
                                    options={{
                                        title: 'Number of dependencies per critical path task',
                                        sliceVisibilityThreshold: 0.1
                                    }}
                                    rootProps={{ 'data-testid': '1' }}
                                />
                            </Col>
                        }
                    </Row>
                </Container>
            </React.Fragment>
        )
    }
}