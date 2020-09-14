import React from "react";
import { Chart } from "react-google-charts";
import { Row, ToggleButtonGroup, ToggleButton, Container, Col, Form, Button } from "react-bootstrap";
import $ from 'jquery'

export default class GanttChartWrapper extends React.Component{
    constructor(props){
        super(props)
        this.state = {showCriticalPath:false, durationType:"all"}
    }

    render(){
        return(
            <React.Fragment>
                <Container fluid className="mb-3">
                    <Row>
                            <Form>
                                <Button
                                variant="outline-secondary"
                                block
                                size="md"
                                onClick={() => {
                                    this.setState({
                                    showCriticalPath: !this.state.showCriticalPath,
                                    });
                                }}
                                >
                                    <Form.Check
                                        type="switch"
                                        id="switchEnabled"
                                        label="Display Critical Path"
                                        checked={this.state.showCriticalPath}
                                        onChange={(e) => {
                                        this.setState({
                                            showCriticalPath: this.state.showCriticalPath,
                                        });
                                        }}
                                    />
                                </Button>
                            </Form>
                        <Col>
                            <ToggleButtonGroup name="durationType" defaultValue={this.state.durationType}>
                                <ToggleButton variant="outline-secondary" disabled value="label" style={{fontWeight:"bold"}}>Show tasks by</ToggleButton>
                                <ToggleButton variant="secondary" value="week" onClick={()=>this.setState({durationType:"week"})}>
                                    Week
                                </ToggleButton>
                                <ToggleButton variant="secondary" value="month" onClick={()=>this.setState({durationType:"month"})}>
                                    Month
                                </ToggleButton>
                                <ToggleButton variant="secondary" value="threeMonth" onClick={()=>this.setState({durationType:"threeMonth"})}>
                                    Three Months
                                </ToggleButton>
                                <ToggleButton variant="secondary" value="sixMonth" onClick={()=>this.setState({durationType:"sixMonth"})}>
                                    Six Months
                                </ToggleButton>
                                <ToggleButton variant="secondary" value="all" onClick={()=>this.setState({durationType:"all"})}>
                                    All Tasks
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Col>
                    </Row>
                    <Row className="mt-2">
                    {this.state.tasks !== null? 
                    <GanttChart 
                        project={this.props.project}
                        showCriticalPath={this.state.showCriticalPath}
                        durationType={this.state.durationType}
                    /> 
                    : null} 
                    </Row>
                </Container>
            </React.Fragment>
        )
    }

}

class GanttChart extends React.Component
{
    constructor(props){
        super(props)
        this.state = {formattedTasks: null, tasksReceived:false}
    }

    formatTasks(tasks){ 
        let rels = this.filterDependencies(tasks, [...this.props.project.rels]);
        let formattedTasks = [];

        formattedTasks.push(
            [
                { type: 'string', label: 'Task ID' },
                { type: 'string', label: 'Task Name' },
                { type: 'string', label: 'Resource' },
                { type: 'date', label: 'Start Date' },
                { type: 'date', label: 'End Date' },
                { type: 'number', label: 'Duration' },
                { type: 'number', label: 'Percent Complete' },
                { type: 'string', label: 'Dependencies' },
            ]
        )

        let startDate;
        let endDate;
        for(var x=0; x<tasks.length; x++){
            startDate = new Date(tasks[x].startDate);
            endDate = new Date(tasks[x].endDate);
            formattedTasks.push(
                [
                    tasks[x].id.toString(),
                    tasks[x].name,
                    null,
                    startDate,
                    endDate,
                    null,
                    tasks[x].progress,
                    this.getDependencies(tasks[x], rels)
                ]
            )
        }

        return formattedTasks;
    }

    checkDependency(tasks, dependency){
        for(var x=0; x<tasks.length; x++){
            if(tasks[x].id === dependency){
                return true;
            }
        }

        return false;
    }

    filterDependencies(tasks, dependencies){
        dependencies = dependencies.filter((dependency)=>{
            return this.checkDependency(tasks, dependency.source) && this.checkDependency(tasks, dependency.target);
        })

        return dependencies;
    }

    filterTasks(){
        let tasks;
        if(this.props.showCriticalPath === true){
            tasks = this.createCriticalPath();
        }

        else{
            tasks = this.props.project.tasks;
        }
        
        let filteredTasks = [];
        let filterDate = new Date();
        let beginFilterDate = new Date();

        if(this.props.durationType === "week"){
            filterDate.setDate(filterDate.getDay()+6);
        }

        else if(this.props.durationType === "month"){
            filterDate.setMonth(filterDate.getMonth()+1);
        }

        else if(this.props.durationType === "threeMonth"){
            filterDate.setMonth(filterDate.getMonth()+3);
        }

        else if(this.props.durationType === "sixMonth"){
            filterDate.setMonth(filterDate.getMonth()+6);
        }

        else{
            return tasks;
        }

        let startDate;
        for(var x=0; x<tasks.length; x++){
            startDate = new Date(tasks[x].startDate.year.low, tasks[x].startDate.month.low-1, tasks[x].startDate.day.low);
            if(startDate.valueOf() <= filterDate.valueOf() && startDate.valueOf() >= beginFilterDate.valueOf()){
                filteredTasks.push(tasks[x]);
            }
        }

        return filteredTasks;
    }

    createCriticalPath() {
        let list = [];
        if (
          this.props.project.criticalPath !== null &&
          this.props.project.criticalPath.path !== null
        ) {
          this.props.project.criticalPath.path.segments.forEach((el, index) => {
            if (index === 0) {
              list.push({
                id: el.start.identity.low,
                name: el.start.properties.name,
                description: el.start.properties.description,
                type: el.start.properties.type,
                progress: el.start.properties.progress.low,
                startDate: el.start.properties.startDate,
                endDate: el.start.properties.endDate,
                duration: el.start.properties.duration.low,
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
              duration: el.end.properties.duration.low,
            });
          });
        } 

        return list;
    }

    getDependencies(task, dependencies){
        let dependencyString = "";
        for(var x=0; x<dependencies.length; x++){
            if(task.id === dependencies[x].target){
                if(x === dependencies.length-1){    
                    dependencyString += dependencies[x].source
                }

                else{
                    dependencyString += dependencies[x].source + ","
                }
            }
        }

        return dependencyString;
    }

    render(){
        if(this.props.project.tasks.length === 0 || this.props.project.tasks === null){
            return null;
        }

        let tasks = this.filterTasks()
        let formattedTasks = this.formatTasks(tasks);
        if(formattedTasks.length === 1){
            let end = new Date();
            end.setDate(end.getDay()+6)
            formattedTasks.push(
                [
                    "0",
                    "Nothing matches your search",
                    null,
                    new Date(),
                    end,
                    null,
                    0,
                    null
                ]
            )
        }

        return(
            <Chart
            width={'100%'}
            height={((formattedTasks.length * 30) + 20)+"px"}
            chartType="Gantt"
            loader={<div>Loading Chart</div>}
            data={formattedTasks}
            rootProps={{ 'data-testid': '3' }}
            options={{
                gantt: {
                    criticalPathEnabled: false,
                    trackHeight: 30,
                    sortTasks: true,
                    percentEnabled: true,
                    arrow: {
                        color: 'orange',
                    },
                },
                }}
            />
        );
    }
}

//#184D47
//#EEBB4D
//#96BB7C

// [
//     [
//       { type: 'string', label: 'Task ID' },
//       { type: 'string', label: 'Task Name' },
//       { type: 'string', label: 'Resource' },
//       { type: 'date', label: 'Start Date' },
//       { type: 'date', label: 'End Date' },
//       { type: 'number', label: 'Duration' },
//       { type: 'number', label: 'Percent Complete' },
//       { type: 'string', label: 'Dependencies' },
//     ],
//     [
//       'Research',
//       'Find sources',
//       null,
//       new Date(2015, 0, 1),
//       new Date(2015, 0, 5),
//       null,
//       100,
//       null,
//     ],
//     [
//       'Write',
//       'Write paper',
//       'write',
//       null,
//       new Date(2015, 0, 9),
//       3 * 24 * 60 * 60 * 1000,
//       25,
//       'Research,Outline',
//     ],
//     [
//       'Cite',
//       'Create bibliography',
//       'write',
//       null,
//       new Date(2015, 0, 7),
//       1 * 24 * 60 * 60 * 1000,
//       20,
//       'Research',
//     ],
//     [
//       'Complete',
//       'Hand in paper',
//       'complete',
//       null,
//       new Date(2016, 0, 10),
//       1 * 24 * 60 * 60 * 1000,
//       0,
//       'Cite,Write',
//     ],
//     [
//       'Outline',
//       'Outline paper',
//       'write',
//       null,
//       new Date(2015, 0, 6),
//       1 * 24 * 60 * 60 * 1000,
//       100,
//       'Research',
//     ],
//   ]