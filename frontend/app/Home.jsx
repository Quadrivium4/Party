import { StyleSheet,View, ScrollView, KeyboardAvoidingView, TextInput, SafeAreaView, Platform, } from 'react-native';
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
        <View>
            <Input.Maps onChangeText={(e) =>{
                setCoords(e.coords);
                }} defaultValue={"Your Position"}></Input.Maps>
            <Input.Number defaultValue={50} onChangeText={setRadius}></Input.Number>
            {parties?.map(party=>{
                return (
                <View key={party._id}>
                    <Text.H3>{party.name}</Text.H3>
                    <Text.P>{party.location}</Text.P>
                </View>)
            })}
            <A to="Party">Create Party</A>
            <Button onPress={theme.toggleTheme}>toggle</Button>
        </View>
    )
}
const styles = StyleSheet.create({
    view: {
        flex: 1, justifyContent: "flex-end"
    }
})
export default Home