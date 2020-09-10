import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = momentLocalizer(moment);
let now = new Date();

// let myEventsList = [
//   {
//     id: 0,
//     title: 'All Day Event very long title',
//     allDay: true,
//     start: new Date(2020, 8, 6),
//     end: new Date(2020, 8, 7),
//   },
  
// ]

class CalendarWrapper extends React.Component {
  CreateEventsList(){
    let events = [];
    let ownedProjects= this.props.ownedProjects;
    let otherProjects = this.props.otherProjects;
    let tasks;
    for(var x = 0; x<ownedProjects.length; x++){
      tasks=ownedProjects[x].tasks;
      for(var y=0; y<tasks.length; y++){
        events.push(
          {
            id: tasks[y].id,
            title: ownedProjects[x].projectInfo.name + " " + tasks[y].name,
            start: new Date(tasks[y].startDate),
            end: new Date(tasks[y].endDate)
          }
        )
      }
    }

    for(x = 0; x<otherProjects.length; x++){
      tasks=otherProjects[x].tasks;
      for(y=0; y<tasks.length; y++){
        events.push(
          {
            id: tasks[y].id,
            title: otherProjects[x].projectInfo.name + " " + tasks[y].name,
            start: new Date(tasks[y].startDate),
            end: new Date(tasks[y].endDate)
          }
        )
      }
    }
    return events;
  }
  
  render() {
    
    let events= this.CreateEventsList();
    return (
      <Container fluid style={{height:(window.innerHeight-300+"px"), width:'100%'}}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={['month', 'week', 'day']}
        />
      </Container>
    );
  }
}

export default CalendarWrapper;