import React, { Component } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    Dimensions,
    StyleSheet,
    StatusBar,
    Image
} from 'react-native';
import * as Animatable from 'react-native-animatable';

class SplashScreen extends Component {

    constructor(props)
    {
		super(props);
        
    }
    render(){
        return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#009387' barStyle="light-content"/>
            <View style={styles.header}>
                <Animatable.Image 
                    animation="rubberBand"
                    duraton="1500"
                source={require('../Images/pic2.png')}
                style={styles.logo}
                //resizeMode="stretch"
                />
            </View>
            <Animatable.View 
                style={[styles.footer, {
                    backgroundColor: "white"
                }]}
                animation="fadeInUpBig"
            >
                <Text style={[styles.title, {
                }]}>Welcome to Project Tree</Text>
                <Text style={styles.text}>Click to Login</Text>
                <View style={styles.button}>
                <TouchableOpacity
                        onPress={() => {this.props.switchScreen("Splash")}}
                            style={[styles.signIn, {
                                borderColor: '#05375a',
                                borderWidth: 1,
                                marginTop: 15
                            }]}
                        >
                            <Text style={[styles.textSign, {
                                color: 'black'
                            }]}>Sign In</Text>
                        </TouchableOpacity>
                </View>
            </Animatable.View>
        </View>
        );
    }
};

export default SplashScreen;

const {height} = Dimensions.get("screen");
const height_logo = height * 0.48;
const w_logo = height * 0.58;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#009387'
  },
  header: {
      flex: 2,
      justifyContent: 'center',
      alignItems: 'center'
  },
  footer: {
      flex: 1,
      backgroundColor: 'grey',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingVertical: 50,
      paddingHorizontal: 30
  },
  logo: {
      width: w_logo,
      height: height_logo
  },
  title: {
      color: '#05375a',
      fontSize: 30,
      fontWeight: 'bold'
  },
  text: {
      color: '#05375a',
      marginTop:5,
      fontSize: 15
  },
  button: {
      alignItems: 'flex-end',
      marginTop: 30
  },
  signIn: {
      width: 150,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 50,
      flexDirection: 'row'
  },
  button2: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
},
  textSign: {
      color: 'white',
      fontWeight: 'bold'
  }
});