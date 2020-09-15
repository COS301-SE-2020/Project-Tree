import React, {Component} from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Icon} from 'native-base';
import DeleteDependency from './DeleteDependency';
import UpdateDependency from './UpdateDependency';
import ms from 'ms';

class DependencyModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayDependencyModal: true,
      displayUpdateModal: false,
      displayProgressModal: false,
    };
    this.toggleVisibility = this.toggleVisibility.bind(this);
  }

  toggleVisibility(dependencyModal, updateModal, selectedDependency) {
    if (selectedDependency !== undefined) {
      this.setState({
        displayDependencyModal: dependencyModal,
        displayUpdateModal: updateModal,
      });
      this.props.displayTaskDependency(null, null);
    }

    this.setState({
      displayDependencyModal: dependencyModal,
      displayUpdateModal: updateModal,
    });
  }

  CalcDiff(sd, ed) {
    let startDate = new Date(sd);
    let endDate = new Date(ed);
    return ms(endDate.getTime() - startDate.getTime(), {long: true});
  }

  render() {
    if (this.props.selectedDependency === null) return null;

    let name =
      this.props.getName(this.props.selectedDependency.source) +
      '→' +
      this.props.getName(this.props.selectedDependency.target);
    return (
      <React.Fragment>
        <UpdateDependency
          dependency={this.props.selectedDependency}
          modalVisibility={this.state.displayUpdateModal}
          toggleVisibility={this.toggleVisibility}
          getProjectInfo={this.props.getProjectInfo}
          setProjectInfo={this.props.setProjectInfo}
          displayTaskDependency={this.props.displayTaskDependency}
          name={name}
        />
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.displayDependencyModal}
          onRequestClose={() => this.props.displayTaskDependency(null, null)}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={styles.hideButton}
                onPress={() => this.props.displayTaskDependency(null, null)}>
                <Icon type="FontAwesome" name="close" />
              </TouchableOpacity>
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Text
                  style={{fontSize: 30, color: '#184D47', textAlign: 'center'}}>
                  {name}
                </Text>
              </View>
              <Text style={styles.modalText}>
                {this.props.selectedDependency.relationshipType === 'fs'
                  ? 'Finish→Start'
                  : 'Start→Start'}
              </Text>
              <Text style={styles.modalText}>
                {'Duration: ' +
                  this.CalcDiff(
                    this.props.selectedDependency.startDate,
                    this.props.selectedDependency.endDate,
                  )}
              </Text>
              <View style={{flexDirection: 'row'}}>
                {this.props.userPermissions['update'] === true ? (
                  <View style={{flex: 1}}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => this.toggleVisibility(false, true)}>
                      <Icon
                        type="AntDesign"
                        name="edit"
                        style={{color: 'white'}}>
                        <Text>&nbsp;Edit</Text>
                      </Icon>
                    </TouchableOpacity>
                  </View>
                ) : null}

                {this.props.userPermissions['delete'] === true ? (
                  <View style={{flex: 1}}>
                    <DeleteDependency
                      dependency={this.props.selectedDependency}
                      sourceViewId={this.props.sourceViewId}
                      targetViewId={this.props.targetViewId}
                      toggleVisibility={this.toggleVisibility}
                      getProjectInfo={this.props.getProjectInfo}
                      setProjectInfo={this.props.setProjectInfo}
                      name={name}
                    />
                  </View>
                ) : null}
              </View>
            </View>
          </View>
        </Modal>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
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
    width: 350,
  },
  hideButton: {
    backgroundColor: '#fff',
    alignItems: 'flex-end',
    marginRight: 10,
    marginTop: 10,
  },
  editButton: {
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
    margin: 3,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
  },
  floatinBtn: {
    backgroundColor: 'lightgreen',
    width: 45,
    height: 45,
    borderRadius: 45,
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
  container: {flex: 1, paddingTop: 30, backgroundColor: '#fff', width: '100%'},
  head: {height: 40, backgroundColor: '#f1f8ff', width: 200},
  wrapper: {flexDirection: 'row'},
  title: {flex: 1, backgroundColor: '#f6f8fa'},
  row: {height: 40},
  text: {margin: 6, textAlign: 'center'},
});

export default DependencyModal;
