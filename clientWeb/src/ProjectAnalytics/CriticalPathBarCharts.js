import React from "react";
import { Container, Row, Col, Button, ProgressBar } from "react-bootstrap";
import { Chart } from 'react-google-charts';

export default class CriticalPathBarCharts extends React.Component {
    render(){
        return(
            <Container fluid>
                <Row>
                    <Col>
                        <h4>Critical Path Info</h4>
                        <Chart
                        width={'100%'}
                        height={'12em'}
                        chartType="Bar"
                        loader={<div>Loading Chart</div>}
                        data={[
                            ['Critical Path Task', 'Duration', 'Percent Complete'],
                            ['Task A', 10, 90],
                            ['Task B', 5, 100],
                            ['Task C', 20, 0],
                            ['Task D', 10, 33],
                        ]}
                        options={{
                            chart: {
                            subtitle: 'Duration and Percentage Complete',
                            },
                        }}
                        rootProps={{ 'data-testid': '2' }}
                        />
                    </Col>
                </Row>
            </Container>
        )
    }
}