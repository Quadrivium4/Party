import { StyleSheet,View, ScrollView, KeyboardAvoidingView, TextInput, SafeAreaView, Keyboard, Modal, ActivityIndicator, Dimensions, } from 'react-native';
import {NavigationContainer, Link, useNavigation} from "@react-navigation/native";
import {useState, useEffect} from "react";
import { useAuth, useAuthDispatch } from '../context/AuthContext';
import Text from "../components/Text";
import Button from '../components/Button';
import Input from '../components/Input';
import ShiftingView from '../components/ShiftingView';
import { getParty, postParty } from '../controllers/party';
import { insertScriptHead, protectedCrossing } from '../utils';
import { buyTicket } from '../controllers/tickets';
import WebView from 'react-native-webview';
import * as Constants from "expo-constants";
import { Linking } from 'react-native';
const baseUri = "http://172.20.10.2:5000/checkout/";
const Party = ({route}) =>{
    const [party, setParty] = useState();
    const [uri, setUri] = useState();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [webViewLoading, setWebViewLoading] = useState(true);
    const {id} = route.params;
    console.log({party});
    useEffect(()=>{
        if(party) return;
        getParty(id).then(res=> {
             setParty(res)
            setUri(baseUri + res._id)
        }
            );

    },[])
    return (
        <ScrollView>
            { party? 
            <View>
                <Text.H1>{party.name}</Text.H1>
                <Text.P>{party.location}</Text.P>
                <Button onPress={()=>{
                    /*buyTicket(party._id).then(res =>{
                        console.log(res)
                        setUri(res.link)
                    })*/
                    setIsModalVisible(true)
                    }}>Buy €{party.price}</Button>
                    {
                        <Modal 
                    animationType='slide'
                    visible={isModalVisible}
                    transparent={true}
                    >
                        <View style={{ height: "100%",...styles.centeredView}}>
                            <View style={{height: 480, borderRadius: 10, padding: 20}}>
                        <WebView
                            style={{width: Dimensions.get("window").width, alignSelf: "center",borderRadius: 10 }}
                            onMessage={(msg)=>{
                                console.log("message: ")
                                const message = msg.nativeEvent.data;
                                
                                if(message === "loaded") setWebViewLoading(false);
                                if(message[0] === "{") {
                                    json =JSON.parse(message);
                                    console.log(json)
                                    if(json.link) Linking.openURL(json.link);
                                }
                                else console.log(message)

                            }}
                            
                            source={{uri}}>
                            </WebView>
                            {webViewLoading? <ActivityIndicator
                                style={{      
                                    position: 'absolute',               
                                    left: 0,               
                                    right: 0,               
                                    bottom: 0,              
                                    top: 0,             
                                }}
                                size="large"
                                />: null}
                            </View>
                        
                        </View>
                        
                            
              
                        
                        
                        
                    </Modal>}
            </View> : <Text.P>Loading...</Text.P>
            }
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Constants.default.statusBarHeight
    },
})
export default Party