import { StyleSheet,View, ScrollView, FlatList, KeyboardAvoidingView, TextInput, SafeAreaView, Platform, Pressable, Keyboard, TouchableWithoutFeedback, Dimensions } from 'react-native';
import {NavigationContainer, Link, useNavigation} from "@react-navigation/native";
import {useState, useEffect} from "react";
import { useAuth, useAuthDispatch } from '../context/AuthContext';
import Text from "../components/Text";
import Button from '../components/Button';
import Input from '../components/Input';
import ShiftingView from '../components/ShiftingView';
import { getNearParties, postParty } from '../controllers/party';
import * as Location from "expo-location" 
import A from '../components/A';
import { useTheme } from '../context/ThemeContext';
import WebView from 'react-native-webview';
import { useMessage } from '../context/MessageContext';
import Pop from '../components/Pop';
import Loader from '../components/Loader';

const getUserLocation = async()=>{
    const permission = await Location.requestForegroundPermissionsAsync();
    //console.log(permission)
    if(!permission.granted) return console.log('Permision not allowed');

    let location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Lowest,
        })
    return location;
}
const Home = ({route, navigation}) =>{
    //console.log({route, navigation})
    const {logout, user} = useAuth();
    const [parties, setParties] = useState();
    const [radius, setRadius] = useState(5000);
    const [coords, setCoords] = useState();
    const {message, content} = useMessage()
    const [popVisible, setPopVisible] = useState(false);
    const [loading, setLoading] = useState(true)
   // const navigation = useNavigation();
    const theme = useTheme();
    useEffect(()=>{
        //message.error("hellfro")
        //console.log("home mounted")
        const fetchParties = async() =>{
            //console.log("Started to fetch")
            let {coords: {latitude, longitude}} = await getUserLocation();
            
            //console.log("User location setted")
            if(!coords){
                setCoords({x: longitude, y: latitude});
            }
            if(coords){
                getNearParties(coords.x, coords.y, radius).then(res=>{
                    //console.log("Parties setted")
                    //console.log(res)
                    setParties(res);
                })
            }
            setLoading(false)
        } 
        
        fetchParties();
    },[radius, coords])
    return (
      
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ marginTop: 0, flex: 1 }}>
                <Input.Maps
                    onChangeText={(e) => setCoords(e.coords)}
                    defaultValue={"Your Position"}
                ></Input.Maps>
                <Input.Number
                    style={{ marginTop: 0 }}
                    defaultValue={50000}
                    onChangeText={setRadius}
                ></Input.Number>
                {parties && parties.length> 0 ? <FlatList
                    style={{ padding: parties?.length > 0 ? 10 : 0 }}
                    data={parties}
                    renderItem={({ item: party }) => {
                        return (
                            <Pressable
                                onPress={() =>
                                    navigation.navigate("Party", {
                                        id: party._id,
                                    })
                                }
                            >
                                <View
                                    style={{
                                        borderBottomColor: theme.foreground,
                                        borderBottomWidth: 1,
                                        padding: 5,
                                    }}
                                >
                                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between"}}>
                                        <Text.H3>{party.name}</Text.H3> 
                                        <Text.P style={{color: party.pdfList || party.capacity == party.people.length? "red" : "green"}}>{ party.pdfList? "closed" :  party.capacity == party.people.length? "full"  : "open"}</Text.P>
                                    </View>
                                    <Text.P>{party.location}</Text.P>
                                    <Text.P>owner: {party.owner.name}</Text.P>
                                </View>
                            </Pressable>
                        );
                    }}
                    keyExtractor={(item) => item._id}
                ></FlatList> : !parties && loading? <Loader visible={loading}></Loader> : <Text.P>No parties found</Text.P>
                }
                
                <Pop visible={popVisible} toggle={() => setPopVisible(false)}>
                    <Text.H1>Hello</Text.H1>
                    <Text.P>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Nulla euismod accumsan tellus, id commodo ligula
                        consequat quis. Nunc sit amet augue elit. Morbi posuere
                        risus sollicitudin lorem placerat placerat. Sed sed
                        sapien purus. Class aptent taciti sociosqu ad litora
                        torquent per conubia nostra, per inceptos himenaeos.
                        Proin vulputate sed tellus ut dapibus. Pellentesque
                        dolor nisl, pretium vitae laoreet a, tincidunt vulputate
                        lacus. Donec laoreet volutpat fringilla. Vivamus felis
                    </Text.P>
                    <Button onPress={() => setPopVisible(false)}>hey</Button>
                </Pop>
                <Button onPress={() => setPopVisible(true)}>press me</Button>
            </View>
        </TouchableWithoutFeedback>
    );
}
const styles = StyleSheet.create({
    view: {
        flex: 1, justifyContent: "flex-end"
    }
})
export default Home