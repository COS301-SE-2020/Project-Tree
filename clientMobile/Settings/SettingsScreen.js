import React, { Component } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput,
    Platform,
    StyleSheet ,
    ScrollView,
    StatusBar,
    Alert
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-community/async-storage';
// import Feather from 'react-native-vector-icons/Feather';
// import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import UserAvatar from 'react-native-user-avatar';

export default class SettingsScreen extends Component {
    constructor(props){
        super(props);
        this.state = {profile: ''};

    }

    async componentDidMount()
    {
        let token = null
            await AsyncStorage.getItem('sessionToken')
            .then(async (value) => {
                token = JSON.parse(value);
                this.setState({token: token})
                const response = await fetch('http://10.0.2.2:5000/user/get',{
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({token: token}),
                });
                const body = await response.json();
                console.log(body)     
                this.setState ({
                   profile: body.user.name + " " + body.user.sname})
                console.log("X  ",    this.state.profile) 
            });
    }

   
        render() {
        return (
            <View style={styles.container}>
                    <StatusBar backgroundColor='#008656' barStyle="light-content"/>
                <View style={styles.header}>
                    {/* <UserAvatar size={80} name={this.state.profile} bgColors={['#ccc', '#fafafa', '#ccaabb']}/> */}
                    <Text style={styles.text_header}>User Details</Text>
                </View>
                <Animatable.View 
                    animation="rubberBand"
                    style={[styles.footer, {
                        backgroundColor: "white"
                    }]} >
                        <View style={styles.button}>  
                            <TouchableOpacity
                                onPress={() => {this.props.userScreen(true)}}
                                style={[styles.signIn, {
                                    borderColor: '#184D47',
                                    borderWidth: 2,
                                    marginTop: 185
                                }]}>
                                <Text style={[styles.textSign, {
                                    color: '#008656'
                                }]}>Edit User Settings</Text>
                            </TouchableOpacity>
                        </View> 
                        <View style={styles.button}>                            
                            <TouchableOpacity
                                onPress={() => {this.props.handleLogout()}}
                                style={[styles.signIn, {
                                    borderColor: '#184D47',
                                    borderWidth: 2,
                                    marginTop: 20
                                }]}>
                                <Text style={[styles.textSign, {
                                    color: '#008656'
                                }]}>Logout</Text>
                            </TouchableOpacity>
                        </View>           
                </Animatable.View>
                
            </View>
            );
    }

}

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: '#008656'
    },
    header: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: 50,
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