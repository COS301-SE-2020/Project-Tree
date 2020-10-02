import React from "react";
import {Spinner, Icon} from "native-base";
import {View, Text, Image, TouchableHighlight, TouchableOpacity, ScrollView, Dimensions, StyleSheet} from "react-native";

class JoinProject extends React.Component {
    constructor() {
        super();
        this.state = {users: null};
        this.setUsers = this.setUsers.bind(this);
    }

    setUsers(){
        let users = [...this.state.users]
        users.shift();
        this.setState({users:users})
    }

    async componentDidMount(){
        const response = await fetch(
            'http://10.0.2.2:5000/people/getpendingmembers',
            {
                method: 'POST',
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ projId: this.props.project.id }),
            },
        );
        const body = await response.json();
        this.setState({users: body.users});
    }

    render() {
        if(this.state.users === null){
					return(
						<View style={{justifyContent: 'center', alignItems: 'center', alignContent: 'center'}}>
							<Spinner />
						</View>
					)
        }

        else if(this.state.users.length === 0){
					return(null)
        }

        return (
            <React.Fragment>
							<PendingMember users={this.state.users} project={this.props.project} setUsers={this.setUsers}/>
            </React.Fragment>
        );
    }
}

class PendingMember extends React.Component{
	constructor(){
		super()
		this.state = {}
	}

	async handleClick(value){
		let data={
			user: this.props.user.id,
			project: this.props.project.id,
			check: value
		}

		data = JSON.stringify(data);

		const response = await fetch(
			'http://10.0.2.2:5000/people/authorisemember',
			{
				method: 'POST',
				headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				},
				body: data,
			},
		);
		this.props.setUsers();
	}

	pendingMemberViews(user, index){
		let pfp='https://i.ibb.co/MRpbpHN/default.png';
		if(user.profilePicture !== 'undefined'){
			pfp = user.profilePicture;
		}
		return(
			<View style={{ width: 150, justifyContent: 'center', alignItems: 'center', alignContent: 'center', marginRight:10 }} key={index}>
				<Image style={styles.logo} source={{uri: pfp}} />
				<Text style={{fontSize:16}}>{user.name + " " + user.surname}</Text>
				<View style={{flexDirection:"row"}}>
					<TouchableOpacity
						style={styles.acceptButton}
						onPress={() => {this.handleClick(true)}}>
						<Icon
							type="FontAwesome"
							name="check"
							style={{color: 'white', textAlign: 'center'}}/>
						</TouchableOpacity>
						<TouchableOpacity
						style={styles.declineButton}
						onPress={() => {this.handleClick(false)}}>
						<Icon
							type="FontAwesome"
							name="remove"
							style={{color: 'white', textAlign: 'center'}}/>
					</TouchableOpacity>
				</View>
			</View>
		)
	}

	render(){
		return(
			<View>
				<View style={{justifyContent: 'center', alignItems: 'center', alignContent: 'center'}}>
					<Text style={{fontSize:18,fontWeight:'bold'}}>Pending Members</Text>
				</View>
				<View style={styles.container}>
					<ScrollView
						contentContainerStyle={styles.scrollViewContainerStyle}
						horizontal
						showsHorizontalScrollIndicator={false}
					>
						<View style={{ flexDirection: 'row' }}>
						{this.props.users.map((user, index) => (
							this.pendingMemberViews(user, index)
						))}
						{this.props.users.map((user, index) => (
							this.pendingMemberViews(user, index)
						))}
						</View>
					</ScrollView>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		alignContent: 'center',
		backgroundColor: '#FFFFFF',
		marginTop:10
	},
	scrollViewContainerStyle: {
		alignContent: 'center',
		justifyContent: 'center',
		alignItems: 'center',
	},
	logo: {
		width: 80,
		height: 80,
		borderRadius: 100,
		marginBottom: 5,
	},
	acceptButton: {
		width:60,
		height:40,
		justifyContent: 'center',
		alignItems: 'center',
		alignContent: 'center',
		margin:5,
		backgroundColor: 'green',
		borderRadius: 5,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 0.1,
		},
		shadowOpacity: 0.8,
		shadowRadius: 2,
			elevation: 1,
	},
	declineButton: {
		width:60,
		height:40,
		justifyContent: 'center',
		alignItems: 'center',
		alignContent: 'center',
		margin:5,
		backgroundColor: 'red',
		borderRadius: 5,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 0.1,
		},
		shadowOpacity: 0.8,
		shadowRadius: 2,
		elevation: 1,
	},
});  

export default JoinProject;