import React from 'react';
import {
  View,
  TouchableHighlight,
  Text,
  StyleSheet,
  TextInput,
  Modal,
  TouchableOpacity
} from 'react-native';
import {Icon, Spinner} from 'native-base';
import {ScrollView} from 'react-native-gesture-handler';

export default class ViewProjectManagers extends React.Component {
  constructor(props){
    super();
    this.state = {visible:false, managers:null}
    this.setModalVisible = this.setModalVisible.bind(this);
  }

  setModalVisible(value){
    this.setState({visible:value});
  }

  

  render() {
    return (
      <React.Fragment>
        <View style={{width:'100%', alignItems:'center'}}>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => {
              this.setModalVisible(true);
            }}>
            <Text style={{color: '#fff'}}>View Project Managers</Text>
          </TouchableOpacity>
            {this.state.visible?
                <ViewManagerInfo project={this.props.project} visible={this.state.visible} setModalVisible={this.setModalVisible}/>
                :
                null
            } 
        </View>
      </React.Fragment>
    );
  }
}

class ViewManagerInfo extends React.Component{
    constructor(props){
    super();
    this.state = {managers:null}
    }

    async componentDidMount(){
        const response = await fetch(
            'https://projecttree.herokuapp.com/people/getProjectManagers',
            {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({id: this.props.project.id}),
            },
        );
    
        const body2 = await response.json();
        if (response.status !== 200) throw Error(body2.message);

        this.setState({managers: body2.users});
    }

    getManagers(){
        let managerComponents = [];

        for(let x=0; x<this.state.managers.length; x++){
            managerComponents.push(
                <View key={this.state.managers[x].id}>
                    <Text>
                        {this.state.managers[x].name + " " + this.state.managers[x].surname}
                    </Text>
                </View>
            )
        }

        return managerComponents;
    }

    render(){
        return(
            <Modal
                animationType="slide"
                transparent={true}
                visible={true}
                onRequestClose={() => this.props.setModalVisible(false)}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={{flex: 1}}>
                            <TouchableOpacity
                            style={styles.hideButton}
                            onPress={() => this.props.setModalVisible(false)}>
                            <Icon type="FontAwesome" name="close" />
                            </TouchableOpacity>
                        </View>

                        <View style={{alignItems: 'center', flex: 1}}>
                            <Text style={{fontSize: 25, color: '#184D47'}}>Project Managers</Text>
                            <View
                                style={{
                                    backgroundColor: '#EEBB4D',
                                    height: 1,
                                    width: '80%',
                                    marginBottom: 10,
                                }}>
                            </View>
                        </View>

                        <View style={{alignItems: 'center', flex: 5}}>
                            {this.state.managers !== null?
                                <ScrollView>
                                    {this.getManagers()}
                                </ScrollView>
                                :
                                <Spinner/>
                            }
                        </View>

                    </View>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    SelectedButtonStyle: {
      borderColor: '#184D47',
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
      height: 45,
      width: 120,
      borderRadius: 5,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 0.1,
      },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 1,
      margin: 10,
    },
    ButtonStyle: {
      backgroundColor: 'white',
      borderColor: '#184D47',
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
      height: 45,
      width: 120,
      borderRadius: 5,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 0.1,
      },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 1,
      margin: 10,
    },
    SelectedTextStyle: {
      color: '#184D47',
      textAlign: 'center',
    },
    TextStyle: {
      color: '#184D47',
      textAlign: 'center',
    },
    centeredView: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(100,100,100, 0.8)',
      padding: 20,
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 100,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      height: 300,
      width: '100%',
    },
    createButton: {
      marginTop: 0,
      backgroundColor: '#184D47',
      alignItems: 'center',
      justifyContent: 'center',
      height: 45,
      borderRadius: 5,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 3,
      margin: 0,
      width: 200
    },
    hideButton: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'flex-end',
      marginRight: 10,
      marginTop: 10,
      bottom: 0,
    },
    submitButton: {
      backgroundColor: '#184D47',
      alignItems: 'center',
      justifyContent: 'center',
      height: 45,
      borderRadius: 5,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 0.1,
      },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 1,
      marginTop: 15,
      width: 200
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
      fontSize: 25,
    },
    CreateDependencyBtn: {
      height: 50,
      borderRadius: 5,
      borderColor: 'green',
      borderWidth: 3,
      position: 'absolute',
      bottom: 72,
      left: 210,
      right: 74,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#EEBB4D',
    },
    ClearDependencyBtn: {
      height: 50,
      width: 50,
      borderRadius: 200,
      borderWidth: 3,
      borderColor: 'red',
      position: 'absolute',
      bottom: 72,
      justifyContent: 'center',
      left: 145,
      alignItems: 'center',
      backgroundColor: '#EEBB4D',
    },
    container: {flex: 1, paddingTop: 30, backgroundColor: '#fff', width: '100%'},
    head: {height: 40, backgroundColor: '#f1f8ff', width: 200},
    wrapper: {flexDirection: 'row'},
    title: {flex: 1, backgroundColor: '#f6f8fa'},
    row: {height: 40},
    text: {margin: 6, textAlign: 'center'},
  });