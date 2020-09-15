import React, {Component} from 'react';
import {Modal, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Table, TableWrapper, Row, Rows} from 'react-native-table-component';
import {Icon} from 'native-base';
import DeleteProject from './DeleteProject';

class ProjectModal extends Component {
  render() {
    const tableData = [];
    const tempData = [
      'Package Managers',
      null,
      null,
      null,
      'Responsible Persons',
      null,
      null,
      null,
      'Resources',
      null,
      null,
      null,
    ];
    const tempArr = [];
    for (let x = 0; x < this.props.project.permissions.length; x++) {
      if (this.props.project.permissions[x] === true) {
        tempArr.push('x');
      } else {
        tempArr.push('');
      }
    }

    let tempIndex = 0;
    for (let x = 0; x < tempData.length; x++) {
      if (tempData[x] === null) {
        tempData[x] = tempArr[tempIndex];
        tempIndex++;
      }
    }

    while (tempData.length) tableData.push(tempData.splice(0, 4));

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.props.modalVisible}
        onRequestClose={() =>
          this.props.setModalVisible(!this.props.modalVisible)
        }>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.hideButton}
              onPress={() => this.props.setModalVisible(false)}>
              <Icon type="FontAwesome" name="close" />
            </TouchableOpacity>
            <Text style={styles.modalText}>{this.props.project.name}</Text>
            <Text style={styles.modalText}>
              {this.props.project.description}
            </Text>
            <View style={styles.container}>
              <Table borderStyle={{borderWidth: 1}}>
                <Row
                  data={['', 'Create', 'Delete', 'Update']}
                  flexArr={[2, 1, 1, 1]}
                  style={styles.head}
                  textStyle={styles.text}
                />
                <TableWrapper style={styles.wrapper}>
                  <Rows
                    data={tableData}
                    flexArr={[2, 1, 1, 1]}
                    style={styles.row}
                    textStyle={styles.text}
                  />
                </TableWrapper>
              </Table>
            </View>
            <TouchableOpacity
              style={styles.viewButton}
              onPress={() => {
                this.props.setModalVisible(!this.props.modalVisible);
                this.props.setCurrentProject(this.props.project);
              }}>
              <Icon type="FontAwesome" name="eye">
                <Text>&nbsp;View</Text>
              </Icon>
            </TouchableOpacity>
            <DeleteProject
              project={this.props.project}
              setProjectInfo={this.props.setProjectInfo}
              modalVisible={this.props.modalVisible}
              setModalVisible={this.props.setModalVisible}
            />
            <TouchableOpacity
              style={styles.editButton}
              onPress={() =>
                this.props.setModalVisible(!this.props.modalVisible, true)
              }>
              <Icon type="FontAwesome" name="edit">
                <Text>&nbsp;Edit</Text>
              </Icon>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    height: 650,
    width: 350,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  head: {
    height: 40,
    backgroundColor: '#96BB7C',
  },
  wrapper: {
    flexDirection: 'row',
  },
  title: {
    flex: 1,
    backgroundColor: '#f6f8fa',
  },
  row: {
    height: 40,
  },
  text: {
    margin: 6,
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: '#fff',
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
  },
  whiteText: {
    color: '#fff',
  },
  blackText: {
    color: '#000',
  },
  hideButton: {
    flex: 0.15,
    backgroundColor: '#fff',
    alignItems: 'flex-end',
    marginRight: 10,
    marginTop: 10,
  },
  viewButton: {
    backgroundColor: '#96BB7C',
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    borderColor: '#EEBB4D',
    borderWidth: 2,
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
  editButton: {
    backgroundColor: '#96BB7C',
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    borderColor: '#EEBB4D',
    borderWidth: 2,
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
});

export default ProjectModal;
