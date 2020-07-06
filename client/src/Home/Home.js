import React, { Component } from 'react';
import {ProgressBar, Button, Container, Row, Col } from 'react-bootstrap'

class Home extends Component{
    render(){
        return(
            <React.Fragment>
                <Progress/>
            </React.Fragment>
        )
    }
}

class Progress extends React.Component{
    constructor(props) {
        super(props);
        this.state = {progressInfo:null};
        this.getProjectProgress = this.getProjectProgress.bind(this)
    }

    async getProjectProgress(info){
        var currentId = info[0].projectId;
        var totalDuartion = 0;
        var completeDuration = 0;
        var projectName = info[0].projectName;
        var projectProgress = []

        for(var x=0; x<info.length; x++)
        {
            if(info[x].projectId !== currentId)
            {
                projectProgress.push({
                                name: projectName,
                                id: currentId,
                                progress: Math.round((completeDuration/totalDuartion)*100)
                            })

                currentId = info[x].projectId;
                projectName = info[x].projectName;
                totalDuartion = 0;
                completeDuration = 0;
            }

            completeDuration += info[x].progress === "Complete" ? info[x].duration : 0;
            totalDuartion += info[x].duration;
        }

        projectProgress.push({
            name: projectName,
            id: currentId,
            progress: (completeDuration/totalDuartion)*100
        })

        this.setState({progressInfo:projectProgress})
    }

    async componentDidMount(){
        const response = await fetch('/getProgress',{
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
            body:JSON.stringify({ check:"sent" })
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        this.getProjectProgress(body.response)
    }

    render(){
        return <ProgressList progressInfo={this.state.progressInfo}/>
    }
}

class ProgressList extends React.Component{
    getColor(value){
        if(value < 33){
            return "danger"
        }

        else if(value < 66){
            return "warning"
        }

        else{
            return "success"
        }
    }

    render(){

        if(this.props.progressInfo === null){
            return null;
        }

        var listItems = []
        var projects = this.props.progressInfo;
        for(var x=0; x<projects.length; x++){
            var currentVariant = this.getColor(projects[x].progress)
            listItems.push(
                <React.Fragment key={projects[x].id}>
                    <Container className="py-4"> 
                        <Row className="text-left align-items-center">
                            <Col className="text-left">
                                <h1>{projects[x].name}</h1>   
                            </Col>
                            <Col className="text-left" xs={8}>                             
                                <ProgressBar variant={currentVariant} now={projects[x].progress} label={`${projects[x].progress}%`}/>
                            </Col>        
                        </Row> 
                    </Container>
                    
                </React.Fragment>
            )
        }

        return listItems
    }
}

export default Home;