import React, { Component } from 'react';
import { View } from 'react-native'
import { Container, Header, Tab, Tabs, TabHeading, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, StyleProvider } from 'native-base';
import buttonStyling from '../native-base-theme/variables/buttonStylingProjList';
import getTheme from '../native-base-theme/components';

class ProjectListPage extends Component{
    constructor(props){
        super(props);
        this.state = {projects:null, project:null};
        this.toggleActionSheet = this.toggleActionSheet.bind(this);
        // this.setProjectInfo = this.setProjectInfo.bind(this); 
    }

    toggleActionSheet(selectedProject){
        console.log(selectedProject.name);
        this.setState({project: selectedProject});
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
        <Content padder style={{ padding: 5 }}>
            <ProjectList projects={this.state.projects} toggleActionSheet={this.toggleActionSheet}/>
        </Content>
      )
    }
}
  
class ProjectList extends React.Component{
    render(){
        if(this.props.projects === null) return null;
        const projects = this.props.projects;
        const listItems = projects.map((project, i) =>
            <View key={i} style={{ padding: 5 }}>
                <StyleProvider style={getTheme(buttonStyling)}>
                    <Button block light onPress={() => this.props.toggleActionSheet(project)}>
                        <Text>
                            {project.name}
                        </Text>
                    </Button>
                </StyleProvider>
            </View>
        );

        return(
            <Container>
                {listItems}
            </Container>
        );
    }
}

export default ProjectListPage;