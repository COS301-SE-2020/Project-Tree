import React, {Component} from 'react';
import {View, Text} from 'react-native';
import * as Progress from 'react-native-progress';
import {Spinner} from 'native-base';

export default class ProgressDashboardWrapper extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {tasks: null, criticalPath: null};
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.project.id === this.props.project.id) return;

    this._isMounted = true;f

    var response = await fetch(
      'http://projecttree.herokuapp.com/project/projecttasks',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({projId: this.props.project.id}),
      },
    );

    var body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    else {
      if (this._isMounted === true) this.setState({tasks: body.tasks});
    }

    response = await fetch(
      'http://projecttree.herokuapp.com/project/criticalpath',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({projId: this.props.project.id}),
      },
    );

    body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    else {
      if (this._isMounted === true) this.setState({criticalPath: body});
    }
  }

  async componentDidMount() {
    this._isMounted = true;

    var response = await fetch(
      'http://projecttree.herokuapp.com/project/projecttasks',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({projId: this.props.project.id}),
      },
    );

    var body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    else {
      if (this._isMounted === true) this.setState({tasks: body.tasks});
    }

    response = await fetch(
      'http://projecttree.herokuapp.com/project/criticalpath',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({projId: this.props.project.id}),
      },
    );

    body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    else {
      if (this._isMounted === true) this.setState({criticalPath: body});
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    if (this.state.tasks === null || this.state.criticalPath === null) {
      return <Spinner />;
    }
    return (
      <ProgressDashboard
        tasks={this.state.tasks}
        criticalPath={this.state.criticalPath}
      />
    );
  }
}

class ProgressDashboard extends Component {
  constructor(props) {
    super(props);
  }

  getProjectProgress() {
    let totalDur = 0,
      completeDur = 0,
      percentage = 0;

    this.props.tasks.forEach((task) => {
      completeDur += task.progress;
      totalDur += 100;
    });
    if (totalDur !== 0) percentage = (completeDur / totalDur) * 100;

    return Math.round(percentage);
  }

  getCPProgress() {
    let totalDur = 0,
      completeDur = 0,
      percentage = 0;

    if (
      this.props.criticalPath !== null &&
      this.props.criticalPath.path !== null
    )
      this.props.criticalPath.path.segments.forEach((el, i) => {
        if (i === 0) {
          completeDur += el.start.properties.progress.low;
          totalDur += 100;
        }
        completeDur += el.end.properties.progress.low;
        totalDur += 100;
      });
    if (totalDur !== 0) percentage = (completeDur / totalDur) * 100;
    else percentage = 0;

    return Math.round(percentage);
  }

  render() {
    let cp = this.getCPProgress();
    let pp = this.getProjectProgress();

    let cpColor = '#0275d8';
    let ppColor = '#0275d8';

    return (
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-evenly',
        }}>
        <View style={{alignItems: 'center'}}>
          <Progress.Circle
            progress={pp / 100}
            size={100}
            showsText={true}
            formatText={(progress) => {
              return `${pp}%`;
            }}
            color={ppColor}
          />
          <Text>Project Progress</Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <Progress.Circle
            progress={cp / 100}
            size={100}
            showsText={true}
            formatText={(progress) => {
              return `${cp}%`;
            }}
            color={cpColor}
          />
          <Text>Critical Path Progress</Text>
        </View>
      </View>
    );
  }
}
