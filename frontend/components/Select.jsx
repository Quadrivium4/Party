import { StyleSheet,View, Pressable, TextInput, Keyboard, Platform, ScrollView} from 'react-native';
import {NavigationContainer, Link, useNavigation} from "@react-navigation/native";
import {useState, useEffect} from "react";
import { useAuth, useAuthDispatch } from '../context/AuthContext';
import {GeoapifyGeocoderAutocomplete, GeoapifyContext} from  "@geoapify/react-geocoder-autocomplete"
import { crossing } from '../utils';
const initialStyles = {
        backgroundColor: "red",
        padding: 5,
        color: "black",
   
    }
const Select = ({children}) =>{
    const [text, setText] = useState("");
    const [styles , setStyles]= useState(initialStyles);
    console.log(children)
    return (
        <ScrollView style={styles}>
            {children}
        </ScrollView>
        

    )
}
export default Select