import { StyleSheet,View, ScrollView, FlatList, KeyboardAvoidingView, TextInput, SafeAreaView, Platform, Pressable, Keyboard, TouchableWithoutFeedback } from 'react-native';
import {NavigationContainer, Link, useNavigation} from "@react-navigation/native";
import {useState, useEffect} from "react";
import { useAuth, useAuthDispatch } from '../context/AuthContext';
import Text from "../components/Text";
import Button from '../components/Button';
import Input from '../components/Input';
import ShiftingView from '../components/ShiftingView';
import { getParties, postParty } from '../controllers/party';
import * as Location from "expo-location" 
import A from '../components/A';
import { useTheme } from '../context/ThemeContext';

const getUserLocation = async()=>{
    const permission = await Location.requestForegroundPermissionsAsync();
    console.log(permission)
    if(!permission.granted) return console.log('Permision not allowed');

    let location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Lowest,
        })
    return location;
}
const Home = () =>{
    const {logout, user} = useAuth();
    const [parties, setParties] = useState();
    const [radius, setRadius] = useState(50);
    const [coords, setCoords] = useState();
    const navigation = useNavigation();
    const theme = useTheme();
    useEffect(()=>{
        console.log("home mounted")
        const fetchParties = async() =>{
            //console.log("Started to fetch")
            let {coords: {latitude, longitude}} = await getUserLocation();
            
            //console.log("User location setted")
            if(!coords){
                setCoords({x: longitude, y: latitude});
            }
            if(coords){
                getParties(coords.x, coords.y, radius).then(res=>{
                    //console.log("Parties setted")
                    setParties(res);
                })
            }
        } 
        
        fetchParties();
    },[radius, coords])
    return (
        
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ marginTop: 0}}>
                    <Input.Maps onChangeText={(e) =>setCoords(e.coords)} defaultValue={"Your Position"}></Input.Maps>
                    <Input.Number style={{marginTop: 0}}defaultValue={50} onChangeText={setRadius}></Input.Number>
                    <FlatList 
                        style={{padding: parties?.length > 0? 10: 0}}
                        data={parties}
                        renderItem={({item: party}) => {
                            console.log(party)
                            return (<Pressable onPress={()=>navigation.navigate("Party", {id: party._id})}>
                                <View style={{borderBottomColor: theme.foreground, borderBottomWidth: 1, padding: 5}}>
                                    <Text.H3>{party.name}</Text.H3>
                                    <Text.P>{party.location}</Text.P>
                                </View>
                            </Pressable>)
                            }}
                        keyExtractor={item => item._id}
                        >
                    </FlatList>

                    <A to="Party">Create Party</A>
                    <Button onPress={theme.toggleTheme}>toggle</Button>
            </View>
            </TouchableWithoutFeedback>
        
    )
}
const styles = StyleSheet.create({
    view: {
        flex: 1, justifyContent: "flex-end"
    }
})
export default Home