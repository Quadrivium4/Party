import { StyleSheet,View, Pressable} from 'react-native';
import {NavigationContainer, Link, useNavigation} from "@react-navigation/native";
import {useState, useEffect} from "react";
import { useAuth, useAuthDispatch } from '../context/AuthContext';
import Text from './Text';
import { useTheme } from '../context/ThemeContext';

const Button = ({onPress = ()=>{}, children}) =>{
    const [opacity , setOpacity]= useState(1);
    const theme = useTheme()
    const initialStyles = {
        backgroundColor: theme.primary,
        alignItems: "center",
        justifyContent: "center",
        padding: 5,
        color: "white"
    };
    const handlePress = () =>{
        setOpacity(0.75)
        setTimeout(()=>{
            setOpacity(1)
        },100)
        onPress();
    }
    return (
        <Pressable onPress={handlePress} style={{...initialStyles, opacity}}>
            <Text.P style={{color: initialStyles.color,  textTransform: 'uppercase', fontWeight: "400"}}>{children}</Text.P>
        </Pressable>
    )
}
export default Button