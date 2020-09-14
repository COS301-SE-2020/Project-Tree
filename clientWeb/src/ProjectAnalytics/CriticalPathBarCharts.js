import React from "react";
import { Container, Row, Col, Button, ProgressBar } from "react-bootstrap";
import { Chart } from 'react-google-charts';
import image from '../Images/project_analytic_3.svg'

export default class CriticalPathBarCharts extends React.Component {
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
                duration: el.start.properties.duration,
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
              duration: el.end.properties.duration,
            });
          });
        } 

        return list;
    }

    formatData(tasks){
        let data = [];
        data.push(['Critical Path Task', 'Duration (Days)']);
        tasks.forEach((task)=>{
            data.push(
                [task.name, (task.duration / (60*60*24*1000))]
            )
        });

        return data;
    }

    render(){
        let criticalPath = this.createCriticalPath();
        criticalPath = this.formatData(criticalPath);
        return(
            <Container fluid>
                <Row>
                    <Col>
                        <h4>Critical Path Info</h4>
                        {criticalPath.length === 1 ?
                          <Col className="text-center">
                            No critical path to display
                            <img src={image} style={{ width: "90%", height:"10em" }} alt="Logo" />
                          </Col>
                          :
                          <Chart
                            width={'100%'}
                            height={'12em'}
                            chartType="Bar"
                            loader={<div>Loading Chart</div>}
                            data={criticalPath}
                            options={{
                                chart: {
                                subtitle: 'Duration',
                                },
                            }}
                            rootProps={{ 'data-testid': '2' }}
                          />
                        }
                    </Col>
                </Row>
            </Container>
        )
    }
}