import React from "react";
import { Container, Row, Col, Button, ProgressBar } from "react-bootstrap";
import { Chart } from 'react-google-charts';

export default class DependencyPieChartsComponent extends React.Component {
    render(){
        return(
            <React.Fragment>
                <Container className="border" fluid>
                    <Row>
                        <Col>
                            <h4>Dependency Info</h4>
                        </Col>
                    </Row>
                    <Row className="align-items-center my-2">
                        <Col>
                            <Chart
                                width={'100%'}
                                height={'100%'}
                                chartType="PieChart"
                                loader={<div>Loading Chart</div>}
                                data={[
                                    ['Task', 'Hours per Day'],
                                    ['Task A', 11],
                                    ['Task B', 2],
                                    ['Task C', 2],
                                    ['Task D', 2],
                                    ['Task E', 7],
                                ]}
                                options={{
                                    title: 'Tasks with the most dependencies',
                                }}
                                rootProps={{ 'data-testid': '1' }}
                            />
                        </Col>
                        <Col>
                            <Chart
                                width={'100%'}
                                height={'100%'}
                                chartType="PieChart"
                                loader={<div>Loading Chart</div>}
                                data={[
                                    ['Task', 'Hours per Day'],
                                    ['Task A', 9],
                                    ['Task B', 8],
                                    ['Task C', 6],
                                    ['Task D', 2],
                                    ['Task E', 4],
                                ]}
                                options={{
                                    title: 'Critical path tasks with the most dependencies',
                                }}
                                rootProps={{ 'data-testid': '1' }}
                            />
                        </Col>
                    </Row>
                </Container>
            </React.Fragment>
        )
    }
}