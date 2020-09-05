import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

export default class TaskOverviewComponent extends React.Component {
    render(){
        return(
            <Container>
                <Row>
                <Col>
                    <h4>Task Info</h4>
                </Col>
                </Row>
                <Row>
                <Col>
                    Tasks completed this week: 10
                </Col>
            </Row>
            <Row>
            <Col>
                Critical path tasks completed this week: 4
            </Col>
            </Row>
        <Row>
            <Col>
                Next task ending: Task A
            </Col>
        </Row>
        <Row>
            <Col>
                Next task starting: Task C
            </Col>
        </Row>
            </Container>
           
        )
    }
}