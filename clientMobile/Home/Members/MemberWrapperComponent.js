import React from "react";
import AddProjectManager from "./AddProjectManager"
import GetAccessCode from "./GetAccessCode"
import AuthoriseMembers from "./AuthoriseMembers"
import {View} from 'react-native';

class MemberWrapperComponent extends React.Component {
    constructor() {
        super();
        this.state = {users: null};
    }

    render() {
        return (
            <View>
                <View style={{flexDirection:'row'}}>
                    <View>
                        {/* <GetAccessCode project={this.props.project}/> */}
                    </View>
                    <View>
                        {/* <AddProjectManager project={this.props.project}/> */}
                    </View>
                </View>
                <View>
                    <AuthoriseMembers project={this.props.project} />
                </View>
            </View>
        );
    }
}

export default MemberWrapperComponent;