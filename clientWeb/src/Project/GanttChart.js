import React from "react";
import { Chart } from "react-google-charts";
import { Row, ToggleButtonGroup, ToggleButton, Container, Col, Form, Button } from "react-bootstrap";

function datetimeToString(datetime){
    let obj = {
      year: datetime.year.low,
      month: datetime.month.low < 10 ? `0${datetime.month.low}` : datetime.month.low,
      day: datetime.day.low < 10 ? `0${datetime.day.low}` : datetime.day.low,
      hour: datetime.hour.low < 10 ? `0${datetime.hour.low}` : datetime.hour.low,
      min: datetime.minute.low < 10 ? `0${datetime.minute.low}` : datetime.minute.low,
    }
    return `${obj.year}-${obj.month}-${obj.day}T${obj.hour}:${obj.min}`
}

export default class GanttChartWrapper extends React.Component{
    constructor(props){
        super(props)
        this.state = {showCriticalPath:false, durationType:"all", rowHeight: null}
        this.setRowHeight = this.setRowHeight.bind(this);
    }

    setRowHeight(val){
        this.setState({rowHeight:val})
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
                        rowHeight={this.state.rowHeight}
                        setRowHeight={this.setRowHeight}
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
            filterDate.setDate(filterDate.getDate()+7)
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
            startDate = new Date(tasks[x].startDate);
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
                startDate: datetimeToString(el.start.properties.startDate),
                endDate:  datetimeToString(el.start.properties.endDate),
                duration: el.start.properties.duration.low,
              });
            }
            list.push({
              id: el.end.identity.low,
              name: el.end.properties.name,
              description: el.end.properties.description,
              type: el.end.properties.type,
              progress: el.end.properties.progress.low,
              startDate: datetimeToString(el.start.properties.startDate),
              endDate:  datetimeToString(el.start.properties.endDate),
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

        let tasks = this.filterTasks();
        let formattedTasks = this.formatTasks(tasks);
        if(formattedTasks.length === 0 || formattedTasks.length === 1){
            return <p>No tasks to display</p>
        }

        let chartHeight = ((formattedTasks.length * 30))+"px";
        if(chartHeight !== this.props.rowHeight){
            this.props.setRowHeight(chartHeight);
        }

        return(
            <Chart
            width={'100%'}
            height={this.props.rowHeight}
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