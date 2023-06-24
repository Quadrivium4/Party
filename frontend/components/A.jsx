import { StyleSheet,View, Pressable} from 'react-native';
import {NavigationContainer, Link, useNavigation} from "@react-navigation/native";
import {useState, useEffect} from "react";
import { useAuth, useAuthDispatch } from '../context/AuthContext';
import Text from './Text';
import Button from './Button';
const initialStyles = {
        backgroundColor: "rgb(255, 190, 0)",
        alignItems: "center",
        justifyContent: "center",
        padding: 5,
        height: 50,
        width: 100,
        color: "white"
    };
const A = ({children, to}) =>{
    const [opacity , setOpacity]= useState(1)
    const navigation = useNavigation();
    const handlePress = () =>{
        setOpacity(0.75)
        setTimeout(()=>{
            setOpacity(1)
        },100)
        navigation.navigate(to);
    }
    return (
        <Button onPress={handlePress} style={{...initialStyles, opacity}}>{children}</Button>
    )
}
export default A