/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';


export default class App extends Component {
  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent>
              <Icon name='menu' />
            </Button>
          </Left>
          <Body>
            <Title>Header</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <ProjectListPage/>
        </Content>
        <Footer>
          <FooterTab>
            <Button full>
              <Text>Footer</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

class ProjectListPage extends Component{
  constructor(props){
    super(props);
    this.state = {projects:null, project:null};
    // this.toggleSideBar = this.toggleSideBar.bind(this);
    // this.setProjectInfo = this.setProjectInfo.bind(this); 
  }

  async componentDidMount(){
    const response = await fetch('http://projecttree.herokuapp.com/project/get',{
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        },
        body:null,
    });
    const body = await response.json();
    this.setState({projects:body.nodes});
  }

  render(){
    return(
      <Body>
      <ProjectList projects={this.state.projects}/>
      </Body>
    )
  }
}

class ProjectList extends React.Component{
  render(){
      if(this.props.projects === null) return null;
      const projects = this.props.projects;
      const listItems = projects.map((project, i) =>
          <Button key={i} block>
              <Text>
                {project.name}
              </Text>
          </Button>
      );

      return(
          <Container>
              {listItems}
          </Container>
      );
  }
}