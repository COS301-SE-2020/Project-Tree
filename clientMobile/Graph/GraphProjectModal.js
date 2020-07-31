import React, { Component } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View, TouchableHighlight } from "react-native";
import { Icon } from 'native-base';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

class GraphProjectModal extends Component {
	constructor(props){
		super(props);
		this.state = {modalVisible:false};
		this.setModalVisible = this.setModalVisible.bind(this)
	}

	setModalVisible(visible){
		this.setState({ modalVisible: visible });
	}

	render(){
		return(
			<React.Fragment>
				<GraphModal modalVisible={this.state.modalVisible} setModalVisible={this.setModalVisible} project={this.props.project} />
				<View style={{flex:1}}>
					<TouchableOpacity onPress={()=>this.setModalVisible(true)} style={styles.floatinBtn}>
						<Icon type="FontAwesome5" name="info" />
					</TouchableOpacity>
				</View>
			</React.Fragment>
		)
	}
}

class GraphModal extends Component{
    render(){
		const tableData = []
        const tempArr = []
        for(let x = 0; x < this.props.project.permissions.length; x++){
            if(this.props.project.permissions[x] === true){
                tempArr.push("x")
            }
            else{
                tempArr.push("")
            }
        }

        while(tempArr.length) tableData.push(tempArr.splice(0,3));
        return(
            <Modal animationType="slide" transparent={true} visible={this.props.modalVisible} onRequestClose={()=>this.props.setModalVisible(!this.props.modalVisible)}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>{this.props.project.name}</Text>
                        <Text style={styles.modalText}>{this.props.project.description}</Text>
                        <View style={styles.container}>
                            <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                                <Row data={["","Create","Delete","Update"]} style={styles.head} textStyle={styles.text}/>
                                <TableWrapper style={styles.wrapper}>
                                    <Col data={["Package Manager","Responsible Person","Resource"]} style={styles.title} heightArr={[40,40,40]} textStyle={styles.text}/>
                                    <Rows data={ tableData } flexArr={[1, 1, 1]} style={styles.row} textStyle={styles.text}/>
                                </TableWrapper>
                            </Table>
                        </View>
						<TouchableHighlight style={{ ...styles.openButton, backgroundColor: "#2196F3" }} onPress={() => this.props.setModalVisible(false)}>
                            <Text style={styles.textStyle}>Hide Modal</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 22
	},
	modalView: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 20,
		padding: 35,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
		width: 0,
		height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5
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
		textAlign: "center"
	},
    floatinBtn: {
        backgroundColor: 'lightgreen',
        width: 45,
        height: 45,
        borderRadius: 45,
        position: 'absolute',
        bottom: 12,
        right: 12,
	},
	container: { flex: 1, paddingTop: 30, backgroundColor: '#fff', width: "100%" },
    head: {  height: 40,  backgroundColor: '#f1f8ff', width: 200 },
    wrapper: { flexDirection: 'row' },
    title: { flex: 1, backgroundColor: '#f6f8fa' },
    row: {  height: 40  },
    text: { margin: 6, textAlign: 'center' }
});

export default GraphProjectModal;