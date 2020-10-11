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

export default class AddProjectManagerModal extends React.Component {
  constructor(props){
    super();
    this.state = {visible:false}
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
            <Text style={{color: '#fff'}}>Add Project Manager</Text>
          </TouchableOpacity>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.visible}
          onRequestClose={() => this.setModalVisible(false)}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={{flex: 1}}>
                <TouchableOpacity
                  style={styles.hideButton}
                  onPress={() => this.setModalVisible(false)}>
                  <Icon type="FontAwesome" name="close" />
                </TouchableOpacity>
              </View>

              <View style={{alignItems: 'center', flex: 1}}>
                <Text style={{fontSize: 25, color: '#184D47'}}>Add Project Manager</Text>
                <View
                  style={{
                    backgroundColor: '#EEBB4D',
                    height: 1,
                    width: '80%',
                    marginBottom: 10,
                  }}></View>
              </View>

              <View style={{flex: 6}}>
                <SearchComponent setModalVisible={this.setModalVisible} project={this.props.project} />
              </View>
            </View>
          </View>
        </Modal>
      </React.Fragment>
    );
  }
}

class SearchComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: null,
      users: null
    };
    this.setSearchValue = this.setSearchValue.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  setSearchValue(value) {
    this.setState({searchValue: value, onFocus: false});
  }

  async componentDidMount(){
    let data={
      id: this.props.project.id,
    }

    data = JSON.stringify(data);

    const response = await fetch(
      'https://projecttree.herokuapp.com/people/getAllProjectMembers',
      {
          method: 'POST',
          headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          },
          body: data,
      },
    );

    const body = await response.json();
    this.setState({users:body.users});
  }

  async handleSubmit(){
    let data={
      userId: this.state.searchValue.id, 
      projId: this.props.project.id 
    }

    data = JSON.stringify(data);

    const response = await fetch(
      'https://projecttree.herokuapp.com/people/addProjectManager',
      {
          method: 'POST',
          headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          },
          body: data,
      },
    );

    const body = await response.json();
    if(body.response !== "okay"){
      alert(body.response);
    }

    this.props.setModalVisible(false);
  }

  render() {
    if(this.state.users === null){
      return(
        <View style={{alignItems: 'center', flex: 1}}>
            <Spinner />
        </View>
      )
    }

    return (
      <View style={{alignItems: 'center', flex: 1}}>
        {this.state.searchValue !== null ? (
          <React.Fragment>
            <View style={{flex:4}}>
              <TouchableHighlight
                style={[styles.SelectedButtonStyle, {alignSelf: 'center'}]}
                onPress={() => this.setState({searchValue: null})}>
                <Text style={styles.SelectedTextStyle}>
                  {this.state.searchValue.name}
                </Text>
              </TouchableHighlight>
            </View>
            
            <View styles={{flex:1}}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={this.handleSubmit}>
                <Text style={{color: 'white'}}>Submit</Text>
              </TouchableOpacity>
            </View>
          </React.Fragment>
            
          ) : (
            <Searchbar
              users={this.state.users}
              setSearchValue={this.setSearchValue}
            />
          )}
      </View>
    );
  }
}

class Searchbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: [],
      users: null,
      searchTerm: '',
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props === prevProps || this.props.users === null) return;

    this.setState({users: this.props.users});
  }

  updateSearch(value, mode) {
    let suggestions = [];

    let name = '';
    for (var x = 0; x < this.state.users.length; x++) {
      name = this.state.users[x].name + ' ' + this.state.users[x].surname;
      if (name.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
        suggestions.push(this.state.users[x]);
      }
    }

    this.setState({searchTerm: value, suggestions: suggestions});
  }

  setSearch(suggestion) {
    this.props.setSearchValue(suggestion);
    this.setState({searchTerm: ''});
  }

  getSuggestions(suggestions) {
    let suggestionComponents = suggestions.map((suggestion) => {
      return (
        <View style={{alignItems: 'center'}} key={suggestion.id}>
          <TouchableOpacity
            type="button"
            onPress={() => this.setSearch(suggestion)}
            style={styles.ButtonStyle}>
              <Text style={styles.TextStyle}>
                {suggestion.name}&nbsp;{suggestion.surname}
              </Text>
          </TouchableOpacity>
        </View>
      );
    });

    return suggestionComponents;
  }

  render() {
      return (
        <View>
          <TextInput
            style={{
              height: 40,
              borderColor: 'gray',
              borderWidth: 1,
              width: 200,
              borderRadius: 5,
            }}
            onChangeText={(value) => this.updateSearch(value, 'people')}
            value={this.state.searchTerm}
            placeholder="Enter the name of a person"
          />
            <ScrollView>
              {this.state.searchTerm.length > 1
                ? this.getSuggestions(this.state.suggestions)
                : null}
            </ScrollView>
        </View>
      );
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
    height: 400,
    width: '100%',
  },
  createButton: {
    marginTop: 20,
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
    fontSize: 20,
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