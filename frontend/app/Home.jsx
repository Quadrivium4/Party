import { StyleSheet,View, ScrollView, FlatList, KeyboardAvoidingView, TextInput, SafeAreaView, Platform, Pressable, Keyboard, TouchableWithoutFeedback, Dimensions } from 'react-native';
import {NavigationContainer, Link, useNavigation, useFocusEffect} from "@react-navigation/native";
import {useState, useEffect, useCallback} from "react";
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
import Page from '../components/Page';
import { useTouch } from '../context/TouchContext';

const getUserLocation = async()=>{
    const permission = await Location.requestForegroundPermissionsAsync();
    //console.log(permission)
    if(!permission.granted) return console.log('Permision not allowed');

    let location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Lowest,
        })
    
    return {coords: location.coords};
}
const getUserAddress = async(latitude, longitude) =>{
    let address = await fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=3d65b7c6286c4cf5a7c0083a295de089`
    ).then((response) => response.json());
    //console.log(address.features[0]);
    return (address.features[0].properties || "no address found");
}
let a = () => {
    Keyboard.dismiss();
    //console.log("hello dismiss");
};
const Home = ({route, navigation}) =>{
    //console.log({route, navigation})
    const {logout, user} = useAuth();
    const {Touch, logSubscribers} = useTouch()
    const [userLocationAddress, setUserLocationAddress] = useState("");
    const [parties, setParties] = useState();
    const [radius, setRadius] = useState(100);
    const [coords, setCoords] = useState();
    const {message, content} = useMessage()
    const [popVisible, setPopVisible] = useState(false);
    const [loading, setLoading] = useState(true)
   // const navigation = useNavigation();
   
    const theme = useTheme();
    useFocusEffect(useCallback(()=>{
        Touch.subscribe(a);
        return () => Touch.unsubscribe(a);
    },[]))


    useEffect(()=>{
        //message.error("hellfro")
        //console.log("home mounted")
        const fetchParties = async() =>{
            //console.log("Started to fetch")
            
            
            //console.log("User location setted")
            if(!coords){
                let {
                    coords: { latitude, longitude },
                } = await getUserLocation();
                setCoords({x: longitude, y: latitude});
                let address = await getUserAddress(latitude, longitude);
                //console.log({address})
                setUserLocationAddress(address.city + ", " + address.country )
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
        <Page>
            <View style={{ marginTop: 0, flex: 1 }}>
                <Input.Maps
                    onChangeText={(e) => setCoords(e.coords)}
                    placeholder={
                        userLocationAddress
                            ? `${userLocationAddress}`
                            : "locating..."
                    }
                ></Input.Maps>
                <Input.Number
                    style={{ marginTop: 0 }}
                    defaultValue={radius}
                    onChangeText={setRadius}
                ></Input.Number>
                {parties && parties.length > 0 ? (
                    <FlatList
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
                                        <View
                                            style={{
                                                flex: 1,
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <Text.H3>{party.name}</Text.H3>
                                            <Text.P
                                                style={{
                                                    color:
                                                        party.pdfList ||
                                                        party.capacity ==
                                                            party.people.length
                                                            ? "red"
                                                            : "green",
                                                }}
                                            >
                                                {party.pdfList
                                                    ? "closed"
                                                    : party.capacity ==
                                                      party.people.length
                                                    ? "full"
                                                    : "open"}
                                            </Text.P>
                                        </View>
                                        <Text.P>{party.location}</Text.P>
                                        <Text.P>
                                            owner: {party.owner.name}
                                        </Text.P>
                                    </View>
                                </Pressable>
                            );
                        }}
                        keyExtractor={(item) => item._id}
                    ></FlatList>
                ) : !parties && loading ? (
                    <Loader visible={loading}></Loader>
                ) : (
                    <Text.P>No parties found</Text.P>
                )}

                {/* <Button onPress={() => logSubscribers()}>press me</Button> */}
                <Button type='outline' onPress={() => Touch.unsubscribe(a)} style={{marginBottom: 5}}>unsubscribe</Button>
            </View>
        </Page>
    );
}
const styles = StyleSheet.create({
    view: {
        flex: 1, justifyContent: "flex-end"
    }
})
export default Home