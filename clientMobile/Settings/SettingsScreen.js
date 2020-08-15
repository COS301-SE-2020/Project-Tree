import React, { Component } from 'react';
import { Container, Header, Picker ,Textarea, Tab, Tabs, TabHeading, Label, Form, Item, Input, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, StyleProvider } from 'native-base';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput,
    Platform,
    StyleSheet ,
    StatusBar,
    Alert
} from 'react-native';
import * as Animatable from 'react-native-animatable';

export default class SettingsScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            loggedIn:null
        }
    }

    async componentDidMount(){
      
    }

   
        render() {
        return (
            <React.Fragment>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.text_header}>User Details</Text>
                    </View>
                    <Animatable.View 
                        animation="fadeInUp"
                        style={[styles.footer, {
                            backgroundColor: "white"
                        }]} >
                            <View style={styles.button}>
                                
                                <TouchableOpacity
                                    onPress={() => {this.props.handleLogout()}}
                                    style={[styles.signIn, {
                                        borderColor: '#DC143C',
                                        borderWidth: 2,
                                        marginTop: 65
                                    }]}>
                                    <Text style={[styles.textSign, {
                                        color: '#DC143C'
                                    }]}>Logout</Text>
                                </TouchableOpacity>
                            </View>           
                    </Animatable.View>
                </View>
            </React.Fragment>
            
            );
    }

}

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: '#184D47'
    },
    header: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: 10,
    },
    footer: {
        flex: 3,
        backgroundColor: '#fff',
        paddingTop: 50,
        // borderTopLeftRadius: 30,
        // borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 20
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: 'black',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    button: {
        alignItems: 'center',
        marginTop: 20
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    }
  });