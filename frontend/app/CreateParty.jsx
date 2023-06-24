import { StyleSheet,View, ScrollView, KeyboardAvoidingView, TextInput, SafeAreaView, Keyboard, } from 'react-native';
import {NavigationContainer, Link, useNavigation} from "@react-navigation/native";
import {useState, useEffect} from "react";
import { useAuth, useAuthDispatch } from '../context/AuthContext';
import Text from "../components/Text";
import Button from '../components/Button';
import Input from '../components/Input';
import ShiftingView from '../components/ShiftingView';
import { postParty } from '../controllers/party';

const Party = () =>{
    const {logout, user} = useAuth();
    const [party, setParty] = useState({
        name: "",
        description: "",
        location: "",
        coords: {x: 0, y: 0},
        price: ""
    })
    return (

            <ShiftingView >
                <Text.H1>Hello {user.name}! Create a new party!</Text.H1>
                <Text.H3 >Name</Text.H3>
                <Input.Text onChangeText={(name)=>setParty({...party, name })}></Input.Text>
                <Text.H3>Location</Text.H3>
                <Input.Maps onChangeText={(location)=>setParty({...party, location: location.name, coords: {...location.coords} })}></Input.Maps>
                <Text.H3>Description</Text.H3>
                <Input.Textarea onChangeText={(description)=>setParty({...party, description })}></Input.Textarea>
                <Text.H3>Price</Text.H3>
                <Input.Number onChangeText={(price)=>setParty({...party, price })} placeholder="€"></Input.Number>
                <Button  onPress={()=>{
                    console.log(party);
                    Keyboard.dismiss()
                    //postParty(party)
                }
                    }>create</Button>
            </ShiftingView>
            
        
        
    )
}
export default Party