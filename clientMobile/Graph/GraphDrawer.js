import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TouchableHighlight,
  Switch,
} from 'react-native';
import {Tooltip} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import IconEntypo from 'react-native-vector-icons/Entypo';

function GoToHome() {
  const navigation = useNavigation();

  return (
    <View style={{paddingTop: 20}}>
      <TouchableHighlight
        onPress={() => {
          navigation.navigate('Home');
        }}
        style={{
          backgroundColor: '#184D47',
          alignItems: 'center',
          justifyContent: 'center',
          height: 45,
          width: 120,
          borderRadius: 5,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.8,
          shadowRadius: 2,
          elevation: 3,
        }}>
        <Text style={{color: 'white', fontSize: 17, padding: 7}}>
          Project Info
        </Text>
      </TouchableHighlight>
    </View>
  );
}

export default class GraphDrawer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let isEnabled = this.props.direction === 'TB' ? true : false;
    return (
      <ScrollView>
        <View
          style={{
            flex: 1,
            backgroundColor: '#303030',
            paddingBottom: 60,
            alignItems: 'center',
          }}>
          <View>
            <Text style={{color: 'white', fontSize: 35}}>Project Options</Text>
          </View>
          <View
            style={{
              backgroundColor: '#EEBB4D',
              height: 2,
              width: '70%',
              marginBottom: 30,
            }}></View>
          <View style={{alignItems: 'center'}}>
            <Text style={{color: 'white', fontSize: 28, textAlign: 'center'}}>
              {this.props.project.name}
            </Text>
            <Text style={{color: 'white', fontSize: 17, textAlign: 'center'}}>
              {this.props.project.description}
            </Text>
            <GoToHome />
          </View>
          <View
            style={{
              backgroundColor: 'white',
              height: 1,
              width: '50%',
              marginBottom: 30,
              marginTop: 30,
            }}></View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                color: 'white',
                fontSize: 15,
                width: 200,
                paddingRight: 10,
              }}>
              Switch Graph Direction
            </Text>
            <Switch
              trackColor={{false: '#184D47', true: '#EEBB4D'}}
              thumbColor={isEnabled ? '#184D47' : '#EEBB4D'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={this.props.toggleDirection}
              value={isEnabled}
            />
          </View>

          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
            <Text
              style={{
                color: 'white',
                fontSize: 15,
                width: 200,
                paddingRight: 10,
              }}>
              Toggle Critical Path
            </Text>
            <Switch
              trackColor={{false: '#767577', true: '#EEBB4D'}}
              thumbColor={isEnabled ? '#184D47' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={this.props.toggleCriticalPath}
              value={this.props.displayCriticalPath}
            />
          </View>

          <View style={styles.tooltipView}>
            <Tooltip
              popover={
                <Text style={{color: 'white'}}>
                  Create a task by pressing the + button (bottom right).{'\n\n'}
                  Create a dependency by pressing and holding on a task for 2
                  seconds, releasing and then pressing and holding on the second
                  task for 2 seconds.
                </Text>
              }
              height={150}
              width={250}
              skipAndroidStatusBar={true}
              backgroundColor={'rgba(0, 0, 0, 1)'}>
              <View style={styles.tooltipButton}>
                <IconEntypo name="help" size={25} />
              </View>
            </Tooltip>
          </View>
          <View style={styles.keyView}>
            <Text
              style={[
                styles.modalText,
                {color: '#f0ffff', fontWeight: 'bold'},
              ]}>
              {' '}
              Task Progress Key{' '}
            </Text>
            <View style={styles.button}>
              <TouchableOpacity
                style={[styles.signIn, {backgroundColor: 'white'}]}>
                <Text style={styles.textSign}>Incomplete</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.button}>
              <TouchableOpacity
                style={[styles.signIn, {backgroundColor: 'green'}]}>
                <Text style={[styles.textSign, {color: 'white'}]}>
                  Complete
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.button}>
              <TouchableOpacity
                style={[styles.signIn, {backgroundColor: 'orange'}]}>
                <Text style={styles.textSign}>Issue</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.button}>
              <TouchableOpacity
                style={[styles.signIn, {backgroundColor: 'red'}]}>
                <Text style={[styles.textSign]}>Overdue</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.button}>
              <TouchableOpacity
                style={[
                  styles.signIn,
                  {
                    backgroundColor: 'white',
                    borderColor: '#0275D8',
                    borderWidth: 3,
                  },
                ]}>
                <Text style={[styles.textSign, {color: 'black'}]}>
                  Critical Path
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.button}>
              <TouchableOpacity
                style={[
                  styles.signIn,
                  {
                    backgroundColor: 'white',
                    borderColor: '#009999',
                    borderWidth: 3,
                  },
                ]}>
                <Text
                  style={[
                    styles.textSign,
                    {color: 'black', textAlign: 'center'},
                  ]}>
                  Highlighted Task
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  keyView: {
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
  },
  tooltipView: {
    marginTop: 25,
  },
  textSign: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    padding: 35,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 2,
    marginTop: 8,
  },
  modalView: {
    margin: 20,
    backgroundColor: '#184D47',
    borderColor: 'yellow',
    borderWidth: 5,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: 'white',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  button: {
    alignItems: 'center',
    marginTop: 15,
    paddingBottom: 4,
    height: 50,
    width: 200,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
    color: 'white',
  },
  floatinBtn: {
    height: 50,
    width: 50,
    borderRadius: 200,
    position: 'absolute',
    bottom: 72,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#96BB7C',
  },
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  head: {
    height: 40,
    backgroundColor: '#f1f8ff',
    width: 200,
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
  tooltipButton: {
    width: 35,
    height: 35,
    borderRadius: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEBB4D',
  },
  buttonShadow: {
    borderColor: '#009999',
    borderWidth: 3,
    borderRadius: 10,
  },
});
