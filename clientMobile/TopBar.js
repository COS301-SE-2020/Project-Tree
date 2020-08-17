import React, { Component } from 'react';
import { Image, View, StatusBar, TouchableOpacity} from 'react-native';
import IconEntypo from 'react-native-vector-icons/Entypo'

export default class TopBar extends Component{
    render(){
        return(
            <View elevation={10} style={{
                backgroundColor:"#96BB7C", 
                width:'100%', 
                height:'8%',
                flexDirection: 'row',
                alignItems: 'center'
                }}
            >
                <StatusBar backgroundColor='#303030' barStyle="light-content"/>

                
                <View style={{width:"15%", height:"80%", justifyContent:'center'}}>
                    {this.props.useMenu === true ? 
                    <TouchableOpacity onPress={()=>{this.props.setDrawerVisible(true)}}>
                        <IconEntypo
                            name={"menu"}
                            color="#184D47"
                            size={50}
                        />
                    </TouchableOpacity> : null}
                </View>
                
                <View style={{alignItems:"center", width:"70%", height:"80%"}}>
                    <Image 
                        style={{resizeMode:'contain', height:'100%', width:'100%'}}
                        source={require('./Images/Logo2.png')}
                    />
                </View>
                
                <View style={{width:"15%", height:"80%"}}>
                    
                </View>
            </View>
        );
    }
}