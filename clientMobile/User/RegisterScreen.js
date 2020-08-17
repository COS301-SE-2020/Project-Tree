import React, {Component} from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity,
    TextInput,
    Platform,
    StyleSheet,
    ScrollView,
    StatusBar
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';



class RegisterScreen extends Component{

    constructor(props){
		super(props);
        this.state =  {
        userName: '',
        sname: '',
        password: '',
        email: '',
        isValidUser: true,
        isValidSname: true,
        isValidPassword: true,
        isValidEmail: true,
        isValidPasswordConfirm: true,
        check_textInputChange: false,
        checkSname: false,
        secureTextEntry: true,
        confirm_secureTextEntry: true,
    };
    this.textInputChange = this.textInputChange.bind(this);
    this.emailInputChange = this.emailInputChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.updateSecureTextEntry = this.updateSecureTextEntry.bind(this);
    this.updateConfirmSecureTextEntry = this.updateConfirmSecureTextEntry.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.handleValidUser = this.handleValidUser.bind(this);
    this.snameInputChange = this.snameInputChange.bind(this);
    this.handleValidSname = this.handleValidSname.bind(this);
}

    handleValidUser(val){
        if( val.trim().length >= 2 ) {
            this.setState({
                isValidUser: true,
                check_textInputChange: true
            });
        } else {
            this.setState({
                isValidUser: false,
                check_textInputChange: false
            });
        }
    }

    textInputChange(val){
        if( val.length !== 0 ) {
            this.setState({
                userName: val,
            });
        } else {
            this.setState({
                userName: val,
            });
        }
    }

    handleValidSname(val){
        if( val.trim().length >= 2 ) {
            this.setState({
                isValidSname: true,
                checkSname: true
            });
        } else {
            this.setState({
                isValidSname: false,
                checkSname: false
            });
        }
    }

    snameInputChange(val)
    {
        if( val.length !== 0 ) {
            this.setState({
                sname: val,
            });
        } else {
            this.setState({
                sname: val,
            });
        }
    }

    emailInputChange(val){
        if( val.length !== 0 ) {
            this.setState({
                email: val,
                check_emailInputChange: true
            });
        } else {
            this.setState({
                emailInputChange: val,
                check_emailInputChange: false
            });
        }
    }

    handlePasswordChange(val)
    {
        if( val.trim().length >= 8 ) {
            this.setState({
                password: val,
                isValidPassword: true
            });
        } else {
            this.setState({
                password: val,
                isValidPassword: false
            });
        }
    }

    //  handleConfirmPasswordChange(pass){
    //     if( pass != this.state.password) {
    //         this.setState({
    //             //password: null,
    //             isValidPasswordConfirm: false
    //         });
    //     } else {
    //         this.setState({
    //             password: pass,
    //             isValidPasswordConfirm: true
    //         });
    //     }
    // }

     updateSecureTextEntry(){
        this.setState({
            secureTextEntry: !this.state.secureTextEntry
        });
    }

     updateConfirmSecureTextEntry(){
        this.setState({
            confirm_secureTextEntry: !this.state.confirm_secureTextEntry
        });
    }

    async handleRegister(userName, password, email, sname){
        if(userName.trim().length <1){
            alert("Please enter a username");
           // return;
        }

        if(sname.trim().length <1){
            alert("Please enter a Surname");
           // return;
        }
        
        if(sname.trim().length <1){
            alert("Please enter a password of at least 8 characters");
            //return;
        }

        if(email == null){
            alert("Please enter a valid email address");
            //return;
        }

        if( this.state.isValidUser &&
            this.state.isValidPassword &&
            this.state.isValidEmail &&
            this.state.isValidPasswordConfirm)
            {
                let data = {
                    name : userName,
                    email : this.state.email,
                    password: this.state.password,
                    sname: this.state.sname,
                    um_date: "  "
                }        
                data = JSON.stringify(data);
                console.log(data)

                const response = await fetch('http://projecttree.herokuapp.com/register', {
                method: 'POST',
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                },
                    body: data
                });
                const body = await response.json();
                console.log(body)
                this.props.handleLogin(body)
            }
            else
            {
                alert("Please ensure all entered information is valid");
            }      
    }

render(){
    return (
      <View style={styles.container}>
          <StatusBar backgroundColor='grey' barStyle="light-content"/>
        <View style={styles.header}>
            <Text style={styles.text_header}>Register</Text>
        </View>
        <Animatable.View 
            animation="fadeInUp"
            style={styles.footer}>
            <ScrollView>
            <Text style={styles.text_footer}>Username</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="user-o"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Username"
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => this.textInputChange(val)}
                    onEndEditing={(val)=>this.handleValidUser(this.state.userName)}
                />
                {this.state.check_textInputChange ? 
                <Animatable.View
                    animation="rubberBand">
                    <Feather 
                        name="check-circle"
                        color="green"
                        size={20}
                    />
                </Animatable.View>
                : null}
            </View>
            { this.state.isValidUser ? null : 
            <Animatable.View animation="rubberBand" duration={400}> 
            <Text style={styles.errorMsg}>Username must be at least be longer than 1 character.</Text>
            </Animatable.View>
            }
            <Text style={[styles.text_footer, {
                marginTop: 35
            }]}>Surname</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="user-o"
                    color="#05375a"
                    size={20}
                />
             <TextInput 
                    placeholder="Surname"
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => this.snameInputChange(val)}
                    onEndEditing={(val)=>this.handleValidSname(this.state.sname)}                
            />
            </View>
            {this.state.checkSname ? 
            <Animatable.View animation="rubberBand">
            <Feather 
                name="check-circle"
                color="green"
                size={20}
            />
            </Animatable.View>
            : null} 
            { this.state.isValidSname ? null : 
                <Animatable.View animation="rubberBand" duration={400}> 
                <Text style={styles.errorMsg}>Surname must be at least be longer than 1 character.</Text>
                </Animatable.View>
            }
            <Text style={[styles.text_footer, {
                marginTop: 35
            }]}>Password</Text>
            <View style={styles.action}>
                <Feather 
                    name="lock"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Password"
                    secureTextEntry={this.state.secureTextEntry ? true : false}
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => this.handlePasswordChange(val)}
                />
                <TouchableOpacity onPress={this.updateSecureTextEntry}>
                    {this.state.secureTextEntry ? 
                    <Feather 
                        name="eye-off"
                        color="grey"
                        size={20}/>
                    :<Feather 
                        name="eye"
                        color="grey"
                        size={20}/>}
                </TouchableOpacity>
            </View>
            { this.state.isValidPassword ? null : 
            <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>Password must be 8 characters long.</Text>
            </Animatable.View>}
            <Text style={[styles.text_footer, {marginTop: 35}]}>Email</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="paper-plane"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Email"
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => this.emailInputChange(val)}
                />
                {this.state.check_emailInputChange ? 
                <Animatable.View animation="pulse">
                    <Feather 
                        name="check-circle"
                        color="#296d98"
                        size={20}/></Animatable.View>: null}  
            </View>
            <View style={styles.textPrivate}>
                <Text style={styles.color_textPrivate}>
                    Please read our 
                </Text>
                <Text style={[styles.color_textPrivate, {fontWeight: 'bold'}]}>{" "}Terms of service</Text>
                <Text style={styles.color_textPrivate}>
                    before clicking the Create Account button below  
                </Text>    
            </View>
            <View style={styles.button}>    
                    <TouchableOpacity
                    onPress={() => {this.props.switchScreen("Login")}}
                    style={[styles.signIn, {
                            borderColor: '#296d98',
                            borderWidth: 2,
                            marginTop: 40
                        }]}>
                        <Text style={[styles.textSign, {
                            color: '#296d98'
                        }]}>Already have an account? Sign in now</Text>
                    </TouchableOpacity>
                </View>
            <View style={styles.button}>
                <TouchableOpacity
                    onPress={() => {this.handleRegister( this.state.userName, this.state.password, this.state.email, this.state.sname )}}
                    style={
                        [styles.signIn, {
                        borderColor: '#296d98',
                        borderWidth: 2,
                        marginTop: 8
                    }]}>
                    <Text style={[styles.textSign, {
                        color: '#296d98'
                    }]}>Create Account</Text>
                </TouchableOpacity>
                </View>
            </ScrollView>
        </Animatable.View>
      </View>
    );
};}

export default RegisterScreen;

styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: '#EEBB4D',
      alignItems: 'center',
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 80
    },
    footer: {
        flex: Platform.OS === 'ios' ? 3 : 5,
        backgroundColor: '#fff',
        // borderTopLeftRadius: 30,
        // borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 40,
        fontFamily: 'sans-serif-medium'
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
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
    },
    textPrivate: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20
    },
    color_textPrivate: {
        color: 'grey'
    }
  });