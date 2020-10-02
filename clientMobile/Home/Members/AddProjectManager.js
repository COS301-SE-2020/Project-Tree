// import React from "react";

// class AddProjectManager extends React.Component {
//   constructor() {
//     super();
//     this.state = { show: false, mode: 2, isloading: false, searchValue: null, tempSearchValue: "", users:null };
//     this.showModal = this.showModal.bind(this);
//     this.hideModal = this.hideModal.bind(this);
//     this.handleSubmit = this.handleSubmit.bind(this);
//     this.setSearchValue = this.setSearchValue.bind(this);
//     this.setTempSearchValue = this.setTempSearchValue.bind(this);
//   }

//   componentDidMount(){
//     $.post(
//         "/people/assignedProjectUsers",
//         { id: this.props.project.id },
//         (response) => {
//           this.setState({ users: response.projectUsers });
//         }
//       ).fail((err) => {
//         throw Error(err);
//       });
//   }

//   showModal() {
//     this.setState({ show: true });
//   }

//   hideModal() {
//     this.setState({ show: false });
//   }

//   setTempSearchValue(value) {
//     this.setState({ tempSearchValue: value, error: false });
//   }

//   setSearchValue(value) {
//     this.setState({ searchValue: value, error: false });
//   }

//   handleSubmit() {
//     if(this.state.searchValue === null) return null;

//     this.setState({ isloading: true });
//     let data = JSON.stringify({userId: this.state.searchValue.id , projId: this.props.project.id })
    
//     $.post("/people/addProjectManager", JSON.parse(data), (response) => {
//       this.setState({ show: false, isloading: false });
//     }).fail(() => {
//       alert("Unable to add project manager");
//     });
//   }

//   render() {
//     return (
//       <React.Fragment>
//         <Button
//           className="btn-warning"
//           style={{ width: "100px" }}
//           onClick={() => {
//             this.showModal();
//           }}
//         >
//           <i className="fa fa-plus"> </i> Add Project Manager{" "}
//         </Button>
//         <Modal
//           show={this.state.show}
//           onHide={() => {
//             this.hideModal();
//           }}
//         >
//           <Form
//             onSubmit={(event) => {
//               this.handleSubmit(event);
//             }}
//           >
//             <Modal.Header closeButton style={{ backgroundColor: "#96BB7C" }}>
//               <Modal.Title>Add Project Manager</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//               {
//                   this.state.users !== null ?
//                   <Searchbar 
//                     users={this.state.users}
//                     filterTaskOption={this.state.filterTaskOption}
//                     setSearchValue={this.setSearchValue}
//                     setTempSearchValue={this.setTempSearchValue}
//                     value={this.state.tempSearchValue}
//                   />
//                   :
//                   null
//               }
//             </Modal.Body>
//             <Modal.Footer style={{ backgroundColor: "#96BB7C" }}>
//               <Button
//                 variant="secondary"
//                 onClick={() => {
//                   this.hideModal();
//                 }}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 variant="dark"
//                 style={{ width: "100px" }}
//                 disabled={this.state.isloading}
//                 onClick={()=>this.handleSubmit()}
//               >
//                 {this.state.isloading ? (
//                   <Spinner
//                     animation="border"
//                     variant="success"
//                     size="sm"
//                   ></Spinner>
//                 ) : (
//                   "Add"
//                 )}
//               </Button>
//             </Modal.Footer>
//           </Form>
//         </Modal>
//       </React.Fragment>
//     );
//   }
// }

// class Searchbar extends React.Component {
//     constructor(props) {
//       super(props);
//       this.state = {
//         value: "",
//         suggestions: [],
//         users: null,
//       };
  
//       this.getSuggestionValue = this.getSuggestionValue.bind(this);
//       this.renderSuggestion = this.renderSuggestion.bind(this);
//     }
  
//     componentDidMount() {
//       let tempUsers = [];
//       let users = [];
//       for (var x = 0; x < this.props.users.length; x++) {
//         tempUsers.push(JSON.parse(JSON.stringify(this.props.users[x][0])));
//       }
  
//       let check = true;
//       for (var y = 0; y < tempUsers.length; y++) {
//         for (var z = 0; z < users.length; z++) {
//           if (tempUsers[y].id === users[z].id) check = false;
//         }
  
//         if (check) users.push(tempUsers[y]);
//         else check = true;
//       }
//       this.setState({ users: users });
//     }
  
//     onChange = (event, { newValue }) => {
//       this.props.setTempSearchValue(newValue);
//     };
  
//     onSuggestionsFetchRequested = ({ value }) => {
//       this.setState({
//         suggestions: this.getSuggestions(value),
//       });
//     };
  
//     onSuggestionsClearRequested = () => {
//       this.setState({
//         suggestions: [],
//       });
//     };
  
//     getSuggestions(value) {
//       const inputValue = value.trim().toLowerCase();
//       const inputLength = inputValue.length;
  
   
//         return inputLength === 0
//           ? []
//           : this.state.users.filter(
//               (lang) =>
//                 lang.name.toLowerCase().slice(0, inputLength) === inputValue
//             );
//     }
  
//     getSuggestionValue(suggestion) {
//       this.props.setSearchValue(suggestion);
//       return suggestion.name + " " + suggestion.surname;
//     }
  
//     renderSuggestion(suggestion) {
//         return (
//             <Container>
//             <Row>
//                 <Col></Col>
//                 <Col
//                 className="text-center border rounded border-dark m-1"
//                 xs={6}
//                 style={{
//                     color: "black",
//                     height: "30px",
//                 }}
//                 >
//                 {suggestion.name + " " + suggestion.surname}
//                 </Col>
//                 <Col></Col>
//             </Row>
//             </Container>
//         );
//     }
  
//     render() {
//       if(this.state.users === null){
//           return null;
//       }
    
//       const { suggestions } = this.state;
//       const value = this.props.value;
  
//       const inputProps = {
//         placeholder: "Enter a person's name",
//         value,
//         onChange: this.onChange,
//       };
  
//       return (
//         <Autosuggest
//           suggestions={suggestions}
//           onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
//           onSuggestionsClearRequested={this.onSuggestionsClearRequested}
//           getSuggestionValue={this.getSuggestionValue}
//           renderSuggestion={this.renderSuggestion}
//           inputProps={inputProps}
//         />
//       );
//     }
//   }

// export default AddProjectManager;

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
        <View style={{padding: 5, paddingTop: 15}}>
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

              <View style={{flex: 9}}>
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
      'http://10.0.2.2:5000/people/getAllProjectMembers',
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
      'http://10.0.2.2:5000/people/addProjectManager',
      {
          method: 'POST',
          headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          },
          body: data,
      },
    );

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
            <TouchableHighlight
              style={[styles.SelectedButtonStyle, {alignSelf: 'center'}]}
              onPress={() => this.setState({searchValue: null})}>
              <Text style={styles.SelectedTextStyle}>
                {this.state.searchValue.name}
              </Text>
            </TouchableHighlight>

            <View styles={{padding: 10}}>
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
    backgroundColor: '#184D47',
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
    color: 'white',
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
    height: '100%',
    width: '100%',
  },
  createButton: {
    backgroundColor: '#184D47',
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    borderColor: '#EEBB4D',
    borderWidth: 2,
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
  },
  hideButton: {
    flex: 0.5,
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