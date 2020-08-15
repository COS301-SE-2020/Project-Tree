import React, { Component } from 'react';
import { Image, View, StatusBar, TouchableOpacity} from 'react-native';
import IconEntypo from 'react-native-vector-icons/Entypo'

export default class TopBar extends Component{
    render(){
        return(
            <View elevation={10} style={{
                backgroundColor:"#96BB7C", 
                width:'100%', 
                height:'11%',
                flexDirection: 'row',
                alignItems: 'center'
                }}
            >
                <StatusBar backgroundColor='#303030' barStyle="light-content"/>

                
                <View style={{width:50}}>
                {this.props.useMenu === true ? <TouchableOpacity onPress={()=>{this.props.setDrawerVisible(true)}}>
                        <IconEntypo
                            name={"menu"}
                            color="#184D47"
                            size={50}
                        />
                    </TouchableOpacity> : null}
                </View>
                
                <View style={{flex:1, alignItems:"center"}}>
                    <Image
                        style={{width:'50%', height:'100%'}}
                        source={require('./Images/Logo.png')}
                    />
                </View>
                
                <View style={{width:50}}>
                    
                </View>
            </View>
        );
    }
}