import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  StatusBar,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

class SplashScreen extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#009387" barStyle="light-content" />
        <View style={styles.header}>
          <Animatable.Image
            animation="rubberBand"
            duraton="1500"
            source={require('../Images/pic2.png')}
            style={styles.logo}
          />
        </View>
        <Animatable.View
          style={[
            styles.footer,
            {
              backgroundColor: 'white',
            },
          ]}
          animation="fadeInUpBig">
          <Text style={[styles.title, {}]}>Welcome to Project Tree</Text>
          <Text style={styles.underText}>Click to Login</Text>
          <View style={styles.button}>
            <TouchableOpacity
              onPress={() => {
                this.props.switchScreen('Splash');
              }}
              style={[
                styles.logger,
                {
                  borderColor: '#05375a',
                  borderWidth: 1,
                  marginTop: 15,
                },
              ]}>
              <Text
                style={[
                  styles.textSign,
                  {
                    color: 'black',
                  },
                ]}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </View>
    );
  }
}

export default SplashScreen;

const {height} = Dimensions.get('screen');
const height_logo = height * 0.48;
const w_logo = height * 0.58;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#009387',
  },
  header: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    backgroundColor: 'silver',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingVertical: 50,
    paddingHorizontal: 30,
    flex: 1,
  },
  logo: {
    width: w_logo,
    height: height_logo,
  },
  title: {
    color: 'black',
    fontSize: 30,
    fontWeight: 'bold',
  },
  underText: {
    color: '#05375a',
    marginTop: 6.6,
    fontSize: 16,
  },
  button: {
    alignItems: 'flex-end',
    marginTop: 40,
  },
  logger: {
    width: 150,
    height: 40,
    borderRadius: 46,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textSign: {
    color: 'white',
    fontWeight: 'bold',
  },
});
