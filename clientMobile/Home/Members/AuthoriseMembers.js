import React from "react";
import {Spinner} from "native-base";
import {View, Text, TouchableHighlight} from "react-native";

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
                <Spinner />
            )
        }

        else if(this.state.users.length === 0){
            return(
                <Text>No pending members</Text>
            )
        }

        return (
            <React.Fragment>
                <PendingMember user={this.state.users[0]} project={this.props.project} setUsers={this.setUsers}/>
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

    render(){
        return(
            <View>
                <View>
                    <Text>Pending Members</Text>
                </View>
                <View>
                    {/* <img
                        class="circular"
                        src={this.props.user.profilePicture}
                        alt="user"
                        width="70"
                        height="70"
                    /> */}
                </View>
                <View>
                    <Text>{this.props.user.name + " " + this.props.user.surname}</Text>
                </View>
                <View style={{flexDirection:"row"}}>
                    <TouchableHighlight onPress={()=>this.handleClick(true)}>
                        <Text>Accept</Text>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={()=>this.handleClick(false)}>
                        <Text>Decline</Text>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
}

export default JoinProject;