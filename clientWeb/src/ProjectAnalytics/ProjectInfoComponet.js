import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import DeleteProject from "../Project/DeleteProject";

export default class ProjectInfoComponent extends React.Component{
    render(){
        return(
            <Container>
                <Row>
                    <Col>
                    <h2>{this.props.project.name}</h2>
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
                                // this.props.setProject(project);
                                // this.props.closeSideBar(true);
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
                                // this.props.setProject(project);
                                // this.props.closeSideBar(true);
                            }}
                            >
                            <i className="fa fa-line-chart"></i> Graph
                            </Button>
                        </Link>
                    </Col>
                    <Col className="text-center">
                        <DeleteProject
                            // project={project}
                            // setProject={(project) => {
                            //   this.props.setProject(project);
                            // }}
                        />
                    </Col>
                </Row>
            </Container>
        )
    }
}