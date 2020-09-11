import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Chart } from 'react-google-charts';
import image from '../Images/project_analytic_1.svg'

export default class ScheduleTrackingComponent extends React.Component {
    formatData(tasks){
        let data = [];
        data.push(['Task', 'Percentage Complete', 'Expected Percentage Complete']);

        let expectedPercentage;
        tasks.forEach((task)=>{
            if((new Date(task.endDate)).valueOf() < (new Date()).valueOf()) expectedPercentage = 100;
            else{
                expectedPercentage = (((new Date()).valueOf() - (new Date(task.startDate)).valueOf()) / task.duration)*100 
            }
            
            data.push(
                [task.name, task.progress, Math.round(expectedPercentage)]
            )
        });

        return data;
    }

    filterTasks(tasks){
        tasks = tasks.filter((task)=>{
            return (task.type !== "Complete" && (new Date(task.endDate)).valueOf() < (new Date()).valueOf())
                || ((new Date(task.startDate)).valueOf() < (new Date()).valueOf() && (new Date(task.endDate)).valueOf() > (new Date()).valueOf());
        })

        return tasks
    }

    render(){
        let tasks = this.filterTasks(this.props.tasks);
        let data = this.formatData(tasks);
        
        return(
            <Container fluid>
                <Row>
                    <Col>
                        <h4>Schedule Tracking</h4>
                        {data.length === 1 ?
                            <Col className="text-center">
                                No ongoing tasks <br/>
                                <img src={image} style={{ width: "90%", height:"10em" }} alt="Logo" />
                            </Col>
                            :
                            <Chart
                                width={'100%'}
                                height={'14em'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={data}
                                rootProps={{ 'data-testid': '2' }}
                            />
                        }
                    </Col>
                </Row>
            </Container>
        )
    }
}