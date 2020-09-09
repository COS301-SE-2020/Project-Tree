import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

export default class TaskOverviewComponent extends React.Component {
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
              list.push(el.start.identity.low);
            }
            list.push(el.end.identity.low);
          });
        } 

        return list;
    }

    getCriticalPath(ids){
        let tasks = [];

        for(var x=0; x<this.props.tasks.length; x++){
            for(var y=0; y<ids.length; y++){
                if(ids[y] === this.props.tasks[x].id){
                    tasks.push(this.props.tasks[x]);
                }
            }
        }

        return tasks;
    }

    filterByComplete(tasks){
        tasks = tasks.filter((task)=>{
            return task.type === "Complete";
        })

        return tasks
    }

    filterByDate(tasks){
            let d = new Date();
            let day = d.getDay();
            let diff = d.getDate() - day + (day === 0 ? -6:1) - 1;
            let startOfWeek = new Date(d.setDate(diff));
            
            tasks = tasks.filter((task)=>{
                return (new Date(task.timeComplete)).valueOf() > startOfWeek.valueOf();
            })
    
            return tasks

    }

    getNextTaskEnding(){
        let tasks = this.props.tasks;

        if(this.props.tasks === null || this.props.tasks.length === 0){
            return "no tasks remaining"
        } 

        let today = new Date();
        tasks = tasks.filter((task)=>{
            return (new Date(task.endDate)).valueOf() > today.valueOf();
        })

        let soonestTaskEnding = tasks[0];
        tasks.forEach((task)=>{
            if((new Date(task.endDate)).valueOf() < (new Date(soonestTaskEnding.endDate)).valueOf()){
                soonestTaskEnding = task;
            }
        })

        return soonestTaskEnding.name + " " + soonestTaskEnding.endDate.substring(0, 10);
    }

    getNextTaskStarting(){
        let tasks = this.props.tasks;

        if(this.props.tasks === null || this.props.tasks.length === 0){
            return "no tasks remaining"
        } 

        let today = new Date();
        tasks = tasks.filter((task)=>{
            return (new Date(task.startDate)).valueOf() > today.valueOf();
        })

        let soonestTaskStarting = tasks[0];
        tasks.forEach((task)=>{
            if((new Date(task.startDate)).valueOf() < (new Date(soonestTaskStarting.startDate)).valueOf()){
                soonestTaskStarting = task;
            }
        })

        return soonestTaskStarting.name + " " + soonestTaskStarting.startDate.substring(0, 10);
    }

    render(){
        if(this.props.tasks === undefined || this.props.tasks.length === 0 || this.props.tasks ===null) return null;
        let tasks = this.props.tasks;
        let cpTasks = this.getCriticalPath(this.createCriticalPath());

       
        tasks = this.filterByComplete(tasks);
        cpTasks = this.filterByComplete(cpTasks);

        tasks = this.filterByDate(tasks);
        cpTasks = this.filterByDate(cpTasks);


        return(
            <Container>
                <Row>
                    <Col>
                        <h4>Task Info</h4>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        Tasks completed this week: {tasks.length}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        Critical path tasks completed this week: {cpTasks.length}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        Next task ending: {this.getNextTaskEnding()}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        Next task starting: {this.getNextTaskStarting()}
                    </Col>
                </Row>
            </Container>
           
        )
    }
}