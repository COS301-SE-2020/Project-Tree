import React, { Component } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View, ScrollView, TouchableHighlight } from "react-native";
import { useNavigation } from '@react-navigation/native';

function GoToHome() {
    const navigation = useNavigation();

    return (
        <TouchableHighlight onPress={()=>{navigation.navigate("Home")}} style={{
			backgroundColor:'#96BB7C',
			alignItems:'center',
			justifyContent:'center',
			height:45,
			borderRadius:5,
			shadowColor:'#000',
			shadowOffset:{
				width:0,
				height:1
			},
			shadowOpacity:0.8,
			shadowRadius:2,  
			elevation:3}}
		>
			<Text style={{color:'black', fontSize:15}}>
				View Project
			</Text>
		</TouchableHighlight>
    );
}

export default class GraphDrawer extends Component {
	constructor(props){
		super(props);
	}

	render(){
		return(
			<React.Fragment>
				<ScrollView>
				<View style={{flex:1, backgroundColor:"#303030", paddingBottom:60}}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>{this.props.project.name}</Text>
                        <Text style={styles.modalText}>{this.props.project.description}</Text>
						<GoToHome />
                    </View>
					<View style={styles.keyView}>
                        <Text style={[styles.modalText, {color: "#f0ffff", fontWeight: "bold"}]}> Task Progress Key </Text>
						<View style={styles.button}>
							<TouchableOpacity
								style={[styles.signIn, {backgroundColor: "white"}]}>
								<Text style={styles.textSign}>Incomplete</Text>
							</TouchableOpacity>
						</View>
						<View style={styles.button}>
							<TouchableOpacity
								style={[styles.signIn, {backgroundColor: "green"}]}>
								<Text style={[styles.textSign, {color: "white"}]}>Complete</Text>
							</TouchableOpacity>
						</View>
						<View style={styles.button}>
							<TouchableOpacity
								style={[styles.signIn, {backgroundColor: "orange"}]}>
								<Text style={styles.textSign}>Issue</Text>
							</TouchableOpacity>
						</View>
						<View style={styles.button}>
							<TouchableOpacity
								style={[styles.signIn, {backgroundColor: "red"} ]}>
								<Text style={[styles.textSign]}>Overdue</Text>
							</TouchableOpacity>
						</View>
						<View style={styles.button}>
							<TouchableOpacity
								style={[styles.signIn, {backgroundColor: "blue"}]}>
								<Text style={[styles.textSign, {color: "white"}]}>Overdue</Text>
							</TouchableOpacity>
						</View>
                    </View>
                </View>
 			</ScrollView>
		</React.Fragment>
		)
	}
}



const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 22,
	},
	keyView: {
		margin: 20,
		backgroundColor: "#660401",
		borderColor:"#f0ffff",
		borderWidth: 8,
		borderRadius: 20,
		padding: 35,
		alignItems: "center",
		shadowColor: "white",
		shadowOffset: {
		width: 0,
		height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 10
	},
	textSign: {	
		color: 'black',
        fontSize: 18,
		fontWeight: 'bold',
		padding: 35
    },
	signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
		borderRadius: 10,
		borderColor: "black",
		borderWidth: 2,
		marginTop: 8,
    },
	modalView: {
		margin: 20,
		backgroundColor: "#184D47",
		borderColor:"yellow",
		borderWidth: 5,
		borderRadius: 20,
		padding: 35,
		alignItems: "center",
		shadowColor: "white",
		shadowOffset: {
		width: 0,
		height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 10
	},
	openButton: {
		backgroundColor: "#F194FF",
		borderRadius: 20,
		padding: 10,
		elevation: 2
	},
	button: {
        alignItems: 'center',
        marginTop: 4,
        paddingBottom: 4
    },
	textStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center"
	},
	modalText: {
		fontSize: 18,
		marginBottom: 15,
		textAlign: "center",
		color: 'white'
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
		backgroundColor:'#96BB7C'
	},
	container:{
		flex:1,
		paddingTop:30,
		backgroundColor:'#fff'
	},
    head:{
		height:40,
		backgroundColor:'#f1f8ff',
		width:200
	},
    wrapper:{
		flexDirection:'row'
	},
    title:{
		flex:1,
		backgroundColor:'#f6f8fa'
	},
    row:{
		height:40
	},
    text:{
		margin:6,
		textAlign:'center'
	}
});

