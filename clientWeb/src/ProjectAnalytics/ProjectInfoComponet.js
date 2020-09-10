import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import DeleteProject from "../Project/DeleteProject";

export default class ProjectInfoComponent extends React.Component{
    render(){
        return(
            <Container>
                <Row>
                    <Col className="text-center">
                        <h2 style={{textDecoration: "underline"}}>{this.props.project.name}</h2>
                    </Col>
                </Row>
                <Row className="align-items-center py-2">
                    <Col className="text-center">
                        <Link to="/project">
                            <Button
                            style={{
                                borderColor: "#EEBB4D",
                                backgroundColor: "#EEBB4D",
                                color: "black",
                                fontSize: "15px",
                                width: "100px"
                            }}
                            onClick={() => {
                                this.props.setProject(this.props.project);
                            }}
                            >
                            <i className="	fa fa-info-circle"></i> Info
                            </Button>
                        </Link>
                    </Col>
                    <Col className="text-center">
                        <Link to="/graph">
                            <Button
                            style={{
                                borderColor: "#EEBB4D",
                                backgroundColor: "#EEBB4D",
                                color: "black",
                                width: "100px",
                                fontSize: "15px",
                            }}
                            onClick={() => {
                                this.props.setProject(this.props.project);
                            }}
                            >
                            <i className="fa fa-line-chart"></i> Graph
                            </Button>
                        </Link>
                    </Col>
                    <Col className="text-center">
                        <DeleteProject setProject={this.props.setProject} project={this.props.project}/>
                    </Col>
                </Row>
            </Container>
        )
    }
}