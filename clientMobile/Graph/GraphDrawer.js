import React, { Component } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View, TouchableHighlight, Switch } from "react-native";
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
		let isEnabled = this.props.direction === "TB" ? true : false
		return(
			<React.Fragment>
				<View style={{flex:1, backgroundColor:"#303030", paddingBottom:60}}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>{this.props.project.name}</Text>
                        <Text style={styles.modalText}>{this.props.project.description}</Text>
						<GoToHome />
                    </View>
					<View>
						<Switch
							trackColor={{ false: "#767577", true: "#81b0ff" }}
							thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
							ios_backgroundColor="#3e3e3e"
							onValueChange={this.props.toggleDirection}
							value={isEnabled}
						/>
					</View>
					
                </View>
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
		backgroundColor:'red'
	},
	modalView: {
		margin: 20,
		backgroundColor: "#184D47",
		borderColor:"#EEBB4D",
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
	textStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center"
	},
	modalText: {
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

