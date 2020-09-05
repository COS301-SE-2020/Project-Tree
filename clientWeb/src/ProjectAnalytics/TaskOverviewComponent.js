import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

export default class TaskOverviewComponent extends React.Component {
    render(){
        return(
            <Row>
                <Col>
                    <h4>Task Info</h4>
                    <p className='mt-4'>Tasks completed this week: 10</p>
                    <p className='mt-2'>Critical path tasks completed this week: 4</p>
                    <p className='mt-2'>Next task ending: Task A</p>
                    <p className='mt-2'>Next task starting: Task C</p>
                </Col>
            </Row>
        )
    }
}