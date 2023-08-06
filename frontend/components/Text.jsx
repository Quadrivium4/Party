import { StyleSheet, Text as DefaultText, View, Pressable, Button} from 'react-native';
import {NavigationContainer, Link, useNavigation} from "@react-navigation/native";
import {useState, useEffect} from "react";
import { useAuth, useAuthDispatch } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
const Text = ({children, style}) => {
        return <>{children}</>;
}



const H1 = ({children, style}) =>{
        const theme = useTheme();
        return (<DefaultText style={{color: theme.foreground, fontSize: 26, fontWeight: "700", ...style}}>{children}</DefaultText>)
    }
const H2 = ({children, style}) =>{
        const theme = useTheme();
        return (<DefaultText style={{color: theme.foreground,fontSize: 22, fontWeight: "600", ...style}}>{children}</DefaultText>)
}
const H3 = ({children, style}) =>{
        const theme = useTheme();
        return (<DefaultText style={{color: theme.foreground,fontSize: 18, fontWeight: "600" , ...style}}>{children}</DefaultText>)
}
const P =  ({children, style}) =>{
        const theme = useTheme();
        return (<DefaultText style={{color: theme.foreground, fontSize: 16, fontWeight: "300", ...style}}>{children}</DefaultText>)
}
Text.H1 = H1;
Text.H2 = H2;
Text.H3 = H3;
Text.P = P;

export default Text