import React from 'react';
import {
  View,
  TouchableHighlight,
  Text,
  StyleSheet,
  TextInput,
  Modal,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import {Icon} from 'native-base';
import {ScrollView} from 'react-native-gesture-handler';

export default class FilterModal extends React.Component {
  render() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.filterVisibility}
        onRequestClose={() => this.props.setFilterVisibility(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{flex: 1}}>
              <TouchableOpacity
                style={styles.hideButton}
                onPress={() => this.props.setFilterVisibility(false)}>
                <Icon type="FontAwesome" name="close" />
              </TouchableOpacity>
            </View>

            <View style={{alignItems: 'center', flex: 1}}>
              <Text style={{fontSize: 25, color: '#184D47'}}>Search Tasks</Text>
              <View
                style={{
                  backgroundColor: '#EEBB4D',
                  height: 1,
                  width: '80%',
                  marginBottom: 10,
                }}></View>
            </View>

            <View style={{flex: 9}}>
              <FilterComponent
                nodes={this.props.nodes}
                users={this.props.users}
                setProjectInfo={this.props.setProjectInfo}
                links={this.props.links}
                filterOn={this.props.filterOn}
                setFilterOn={this.props.setFilterOn}
                user={this.props.user}
                setFilterVisibility={this.props.setFilterVisibility}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

class FilterComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterMode: 'highlight',
      filterTaskOption: 'taskAll',
      filterPeopleOption: null,
      searchValue: null,
      error: false,
      onFocus: false,
      showingSuggestions: false,
    };
    this.setSearchValue = this.setSearchValue.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.filterTasks = this.filterTasks.bind(this);
    this.highlightTasks = this.highlightTasks.bind(this);
    this.filterPeople = this.filterPeople.bind(this);
    this.highlightPeople = this.highlightPeople.bind(this);
    this.quickSearch = this.quickSearch.bind(this);
    this.keyboardDidShow = this.keyboardDidShow.bind(this);
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardDidShow,
    );
    this.setOnFocus = this.setOnFocus.bind(this);
  }

  keyboardDidShow() {
    this.setState({onFocus: true});
  }

  setOnFocus(value) {
    this.setState({onFocus: value});
  }

  setSearchValue(value) {
    this.setState({searchValue: value, error: false, onFocus: false});
  }

  checkDependency(tasks, dependency) {
    for (var x = 0; x < tasks.length; x++) {
      if (tasks[x].id === dependency) {
        return true;
      }
    }

    return false;
  }

  filterDependencies(tasks, dependencies) {
    dependencies = dependencies.filter((dependency) => {
      return (
        this.checkDependency(tasks, dependency.source) &&
        this.checkDependency(tasks, dependency.target)
      );
    });

    return dependencies;
  }

  filterTasks(searchValue) {
    let tasks = [...this.props.nodes];

    if (this.state.filterTaskOption === 'taskComplete') {
      tasks = tasks.filter((task) => {
        return task.type === 'Complete';
      });
    } else if (this.state.filterTaskOption === 'taskIncomplete') {
      tasks = tasks.filter((task) => {
        return task.type === 'Incomplete' || task.type === 'Issue';
      });
    } else if (this.state.filterTaskOption === 'taskIssue') {
      tasks = tasks.filter((task) => {
        return task.type === 'Issue';
      });
    }

    if (searchValue !== null) {
      tasks = tasks.filter((task) => {
        return task.id === searchValue.id;
      });
    }

    if (tasks.length === 0) {
      this.setState({searchValue: null, tempSearchValue: '', error: true});
      return;
    }

    this.props.setProjectInfo(
      tasks,
      this.filterDependencies(tasks, [...this.props.links]),
    );
    this.props.setFilterOn(true);
    this.props.setFilterVisibility(false);
  }

  highlightTasks(searchValue) {
    let tempTasks = [...this.props.nodes];
    let tasks = [...this.props.nodes];

    if (this.state.filterTaskOption === 'taskComplete') {
      tempTasks = tempTasks.filter((task) => {
        return task.type === 'Complete';
      });
    } else if (this.state.filterTaskOption === 'taskIncomplete') {
      tempTasks = tempTasks.filter((task) => {
        return task.type === 'Incomplete' || task.type === 'Issue';
      });
    } else if (this.state.filterTaskOption === 'taskIssue') {
      tempTasks = tempTasks.filter((task) => {
        return task.type === 'Issue';
      });
    }

    if (searchValue !== null) {
      tempTasks = tempTasks.filter((task) => {
        return task.id === searchValue.id;
      });
    }

    let searchCheck = false;
    for (var y = 0; y < tempTasks.length; y++) {
      for (var z = 0; z < tasks.length; z++) {
        if (tempTasks[y].id === tasks[z].id) {
          tasks[z].highlighted = true;
          searchCheck = true;
        }
      }
    }

    if (!searchCheck) {
      this.setState({searchValue: null, tempSearchValue: '', error: true});
      return;
    }

    this.props.setProjectInfo(
      tasks,
      this.filterDependencies(tasks, [...this.props.links]),
    );
    this.props.setFilterOn(true);
    this.props.setFilterVisibility(false);
  }

  filterPeople(searchValue) {
    if (searchValue === null) {
      alert('Please enter the name of a person');
      return;
    }

    let userId = searchValue.id;
    let filterType = this.state.filterPeopleOption;
    let filteredUsers = [];
    let users = [...this.props.users];
    let tasks = [];

    if (filterType === 'peoplePackMan') {
      for (var x = 0; x < users.length; x++) {
        if (users[x][1].type === 'PACKAGE_MANAGER') {
          filteredUsers.push(users[x]);
        }
      }
    } else if (filterType === 'peopleResPer') {
      for (var y = 0; y < users.length; y++) {
        if (users[y][1].type === 'RESPONSIBLE_PERSON') {
          filteredUsers.push(users[y]);
        }
      }
    } else if (filterType === 'peopleResources') {
      for (var z = 0; z < users.length; z++) {
        if (users[z][1].type === 'RESOURCE') {
          filteredUsers.push(users[z]);
        }
      }
    } else filteredUsers = users;

    filteredUsers = filteredUsers.filter((user) => {
      return user[0].id === userId;
    });

    for (x = 0; x < filteredUsers.length; x++) {
      for (y = 0; y < this.props.nodes.length; y++) {
        if (filteredUsers[x][1].end === this.props.nodes[y].id) {
          tasks.push(JSON.parse(JSON.stringify(this.props.nodes[y])));
        }
      }
    }

    if (tasks.length === 0) {
      this.setState({searchValue: null, tempSearchValue: '', error: true});
      return;
    }

    this.props.setProjectInfo(
      tasks,
      this.filterDependencies(tasks, [...this.props.links]),
    );
    this.props.setFilterOn(true);
    this.props.setFilterVisibility(false);
  }

  highlightPeople(searchValue) {
    if (searchValue === null) {
      alert('Please enter the name of a person');
      return;
    }

    let userId = searchValue.id;
    let filterType = this.state.filterPeopleOption;
    let filteredUsers = [];
    let users = [...this.props.users];
    let tasks = [...this.props.nodes];

    if (filterType === 'peoplePackMan') {
      for (var x = 0; x < users.length; x++) {
        if (users[x][1].type === 'PACKAGE_MANAGER') {
          filteredUsers.push(users[x]);
        }
      }
    } else if (filterType === 'peopleResPer') {
      for (var y = 0; y < users.length; y++) {
        if (users[y][1].type === 'RESPONSIBLE_PERSON') {
          filteredUsers.push(users[y]);
        }
      }
    } else if (filterType === 'peopleResources') {
      for (var z = 0; z < users.length; z++) {
        if (users[z][1].type === 'RESOURCE') {
          filteredUsers.push(users[z]);
        }
      }
    } else filteredUsers = users;

    filteredUsers = filteredUsers.filter((user) => {
      return user[0].id === userId;
    });

    let searchCheck = false;
    for (x = 0; x < filteredUsers.length; x++) {
      for (y = 0; y < tasks.length; y++) {
        if (filteredUsers[x][1].end === tasks[y].id) {
          tasks[y].highlighted = true;
          searchCheck = true;
        }
      }
    }

    if (!searchCheck) {
      this.setState({searchValue: null, tempSearchValue: '', error: true});
      return;
    }

    this.props.setProjectInfo(
      tasks,
      this.filterDependencies(tasks, [...this.props.links]),
    );
    this.props.setFilterOn(true);
    this.props.setFilterVisibility(false);
  }

  quickSearch(mode) {
    if (mode === 'filter') {
      this.filterPeople(this.props.user);
    } else {
      this.highlightPeople(this.props.user);
    }
  }

  handleSearch() {
    let searchValue = this.state.searchValue;

    if (this.state.filterTaskOption !== null) {
      if (this.state.filterMode === 'filter') this.filterTasks(searchValue);
      else this.highlightTasks(searchValue);
    } else {
      if (this.state.filterMode === 'filter') this.filterPeople(searchValue);
      else this.highlightPeople(searchValue);
    }
  }

  render() {
    let searchFlex = this.state.onFocus ? 4 : 1;
    return (
      <View style={{alignItems: 'center', flex: 1}}>
        {this.state.onFocus === false ? (
          <View style={{flex: 1, width: '100%'}}>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1, alignItems: 'center'}}>
                <TouchableHighlight
                  style={
                    this.state.filterMode === 'filter'
                      ? styles.SelectedButtonStyle
                      : styles.ButtonStyle
                  }
                  onPress={() =>
                    this.setState({filterMode: 'filter', error: false})
                  }>
                  <Text
                    style={
                      this.state.filterMode === 'filter'
                        ? styles.SelectedTextStyle
                        : styles.TextStyle
                    }>
                    Filter
                  </Text>
                </TouchableHighlight>
              </View>

              <View style={{flex: 1, alignItems: 'center'}}>
                <TouchableHighlight
                  style={
                    this.state.filterMode === 'highlight'
                      ? styles.SelectedButtonStyle
                      : styles.ButtonStyle
                  }
                  onPress={() =>
                    this.setState({filterMode: 'highlight', error: false})
                  }>
                  <Text
                    style={
                      this.state.filterMode === 'highlight'
                        ? styles.SelectedTextStyle
                        : styles.TextStyle
                    }>
                    Highlight
                  </Text>
                </TouchableHighlight>
              </View>
            </View>
            <View
              style={{
                backgroundColor: '#184D47',
                height: 1,
                width: '70%',
                marginBottom: 10,
                alignSelf: 'center',
              }}></View>
          </View>
        ) : null}

        {this.state.onFocus === false ? (
          <React.Fragment>
            <View style={{flex: 4, width: '100%', alignItems: 'center'}}>
              <View style={{flexDirection: 'row'}}>
                <View>
                  <Text style={{textAlign: 'center'}}>Task Options</Text>
                  <TouchableHighlight
                    style={
                      this.state.filterTaskOption === 'taskAll'
                        ? styles.SelectedButtonStyle
                        : styles.ButtonStyle
                    }
                    onPress={() =>
                      this.setState({
                        filterTaskOption: 'taskAll',
                        filterPeopleOption: null,
                        error: false,
                      })
                    }>
                    <Text
                      style={
                        this.state.filterTaskOption === 'taskAll'
                          ? styles.SelectedTextStyle
                          : styles.TextStyle
                      }>
                      All
                    </Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    style={
                      this.state.filterTaskOption === 'taskComplete'
                        ? styles.SelectedButtonStyle
                        : styles.ButtonStyle
                    }
                    onPress={() =>
                      this.setState({
                        filterTaskOption: 'taskComplete',
                        filterPeopleOption: null,
                        error: false,
                      })
                    }>
                    <Text
                      style={
                        this.state.filterTaskOption === 'taskComplete'
                          ? styles.SelectedTextStyle
                          : styles.TextStyle
                      }>
                      Complete
                    </Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    style={
                      this.state.filterTaskOption === 'taskIncomplete'
                        ? styles.SelectedButtonStyle
                        : styles.ButtonStyle
                    }
                    onPress={() =>
                      this.setState({
                        filterTaskOption: 'taskIncomplete',
                        filterPeopleOption: null,
                        error: false,
                      })
                    }>
                    <Text
                      style={
                        this.state.filterTaskOption === 'taskIncomplete'
                          ? styles.SelectedTextStyle
                          : styles.TextStyle
                      }>
                      Incomplete
                    </Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    style={
                      this.state.filterTaskOption === 'taskIssue'
                        ? styles.SelectedButtonStyle
                        : styles.ButtonStyle
                    }
                    onPress={() =>
                      this.setState({
                        filterTaskOption: 'taskIssue',
                        filterPeopleOption: null,
                        error: false,
                      })
                    }>
                    <Text
                      style={
                        this.state.filterTaskOption === 'taskIssue'
                          ? styles.SelectedTextStyle
                          : styles.TextStyle
                      }>
                      Issues
                    </Text>
                  </TouchableHighlight>
                </View>

                <View>
                  <Text style={{textAlign: 'center'}}>People Options</Text>
                  <TouchableHighlight
                    style={
                      this.state.filterPeopleOption === 'peopleAll'
                        ? styles.SelectedButtonStyle
                        : styles.ButtonStyle
                    }
                    onPress={() =>
                      this.setState({
                        filterTaskOption: null,
                        filterPeopleOption: 'peopleAll',
                        error: false,
                      })
                    }>
                    <Text
                      style={
                        this.state.filterPeopleOption === 'peopleAll'
                          ? styles.SelectedTextStyle
                          : styles.TextStyle
                      }>
                      All
                    </Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    style={
                      this.state.filterPeopleOption === 'peoplePackMan'
                        ? styles.SelectedButtonStyle
                        : styles.ButtonStyle
                    }
                    onPress={() =>
                      this.setState({
                        filterTaskOption: null,
                        filterPeopleOption: 'peoplePackMan',
                        error: false,
                      })
                    }>
                    <Text
                      style={
                        this.state.filterPeopleOption === 'peoplePackMan'
                          ? styles.SelectedTextStyle
                          : styles.TextStyle
                      }>
                      Package Manager
                    </Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    style={
                      this.state.filterPeopleOption === 'peopleResPer'
                        ? styles.SelectedButtonStyle
                        : styles.ButtonStyle
                    }
                    onPress={() =>
                      this.setState({
                        filterTaskOption: null,
                        filterPeopleOption: 'peopleResPer',
                        error: false,
                      })
                    }>
                    <Text
                      style={
                        this.state.filterPeopleOption === 'peopleResPer'
                          ? styles.SelectedTextStyle
                          : styles.TextStyle
                      }>
                      Responsible Person
                    </Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    style={
                      this.state.filterPeopleOption === 'peopleResources'
                        ? styles.SelectedButtonStyle
                        : styles.ButtonStyle
                    }
                    onPress={() =>
                      this.setState({
                        filterTaskOption: null,
                        filterPeopleOption: 'peopleResources',
                        error: false,
                      })
                    }>
                    <Text
                      style={
                        this.state.filterPeopleOption === 'peopleResources'
                          ? styles.SelectedTextStyle
                          : styles.TextStyle
                      }>
                      Resources
                    </Text>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </React.Fragment>
        ) : null}

        <View style={{flex: searchFlex, width: '100%', alignItems: 'center'}}>
          {this.state.searchValue !== null ? (
            <TouchableHighlight
              style={[styles.SelectedButtonStyle, {alignSelf: 'center'}]}
              onPress={() => this.setState({searchValue: null})}>
              <Text style={styles.SelectedTextStyle}>
                {this.state.searchValue.name}
              </Text>
            </TouchableHighlight>
          ) : (
            <Searchbar
              users={this.props.users}
              filterTaskOption={this.state.filterTaskOption}
              nodes={this.props.nodes}
              setSearchValue={this.setSearchValue}
              onFocus={this.state.onFocus}
            />
          )}
        </View>

        {this.state.onFocus ? (
          <View style={{flex: 1, width: '100%', alignItems: 'center'}}>
            <TouchableHighlight
              style={styles.SelectedButtonStyle}
              onPress={() => {
                this.setState({onFocus: false});
                Keyboard.dismiss();
              }}>
              <Text style={styles.SelectedTextStyle}>Cancel</Text>
            </TouchableHighlight>
          </View>
        ) : (
          <View style={{flex: 1, width: '100%', alignItems: 'center'}}>
            <View>
              <TouchableHighlight
                style={styles.SelectedButtonStyle}
                onPress={() => this.handleSearch()}>
                <Text style={styles.SelectedTextStyle}>Go!</Text>
              </TouchableHighlight>
            </View>
            {this.state.error ? (
              <Text style={{textAlign: 'center', color: 'red'}}>
                Nothing matches your search
              </Text>
            ) : null}
          </View>
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

    let tempUsers = [];
    let users = [];
    for (var x = 0; x < this.props.users.length; x++) {
      tempUsers.push(JSON.parse(JSON.stringify(this.props.users[x][0])));
    }

    let check = true;
    for (var y = 0; y < tempUsers.length; y++) {
      for (var z = 0; z < users.length; z++) {
        if (tempUsers[y].id === users[z].id) check = false;
      }

      if (check) users.push(tempUsers[y]);
      else check = true;
    }

    this.setState({users: users});
  }

  updateSearch(value, mode) {
    let suggestions = [];

    if (mode === 'tasks') {
      if (parseInt(value)) {
        for (var x = 0; x < this.props.nodes.length; x++) {
          if (this.props.nodes[x].id.toString().indexOf(value) !== -1) {
            suggestions.push(this.props.nodes[x]);
          }
        }
      } else {
        for (var x = 0; x < this.props.nodes.length; x++) {
          if (
            this.props.nodes[x].name
              .toLowerCase()
              .indexOf(value.toLowerCase()) !== -1
          ) {
            suggestions.push(this.props.nodes[x]);
          }
        }
      }
    } else {
      let name = '';
      for (var x = 0; x < this.state.users.length; x++) {
        name = this.state.users[x].name + ' ' + this.state.users[x].surname;
        if (name.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
          suggestions.push(this.state.users[x]);
        }
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
            {this.props.filterTaskOption !== null ? (
              <Text style={styles.TextStyle}>
                {suggestion.name}&nbsp;{suggestion.id}
              </Text>
            ) : (
              <Text style={styles.TextStyle}>
                {suggestion.name}&nbsp;{suggestion.surname}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      );
    });

    return suggestionComponents;
  }

  render() {
    if (this.props.filterTaskOption !== null) {
      return (
        <View style={{marginTop: 10}}>
          <TextInput
            style={{
              height: 40,
              borderColor: 'gray',
              borderWidth: 1,
              width: 200,
              borderRadius: 5,
            }}
            onChangeText={(value) => this.updateSearch(value, 'tasks')}
            value={this.state.searchTerm}
            placeholder="Enter the name or id of task"
          />
          {this.props.onFocus ? (
            <ScrollView>
              {this.state.searchTerm.length > 1
                ? this.getSuggestions(this.state.suggestions)
                : null}
            </ScrollView>
          ) : null}
        </View>
      );
    } else {
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
          {this.props.onFocus ? (
            <ScrollView>
              {this.state.searchTerm.length > 1
                ? this.getSuggestions(this.state.suggestions)
                : null}
            </ScrollView>
          ) : null}
        </View>
      );
    }
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
