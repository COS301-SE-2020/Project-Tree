import React, { Component } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View, TouchableHighlight, Switch } from "react-native";
import { useNavigation } from '@react-navigation/native';

function GoToHome() {
    const navigation = useNavigation();
  
    return (
		<View style={{paddingTop:20}}>
			<TouchableHighlight onPress={()=>{navigation.navigate("Home")}} style={{
				backgroundColor:'#184D47',
				alignItems:'center',
				justifyContent:'center',
				height:45,
				width:120,
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
				<Text style={{color:'white', fontSize:17, padding:7}}>
					Project Info
				</Text>
			</TouchableHighlight>
		</View>
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
				<View style={{flex:1, backgroundColor:"#303030", paddingBottom:60, alignItems:'center'}}>
					<View>
						<Text style={{color:"white", fontSize:35}}>
							Project Options
						</Text>
					</View>
					<View style={{backgroundColor: '#EEBB4D', height: 2, width: "70%", marginBottom:30}}></View>
                    <View style={{alignItems:'center'}}>
                        <Text style={{color:'white', fontSize:28}}>{this.props.project.name}</Text>
                        <Text style={{color:'white', fontSize:17}}>{this.props.project.description}</Text>
						<GoToHome />
                    </View>
					<View style={{backgroundColor: 'white', height: 1, width: "50%", marginBottom:30, marginTop:30}}></View>
					<View style={{flexDirection:'row', alignItems:'center'}}>
						<Text style={{color:"white", fontSize:15, paddingRight:10}}>
							Switch Graph Direction
						</Text>
						<Switch
							trackColor={{ false: "#184D47", true: "#EEBB4D" }}
							thumbColor={isEnabled ? "#184D47" : "#EEBB4D"}
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

