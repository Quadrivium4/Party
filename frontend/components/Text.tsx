import { StyleSheet, Text as DefaultText, View, Pressable, Button, StyleSheetProperties, TextStyle} from 'react-native';
import {NavigationContainer, Link, useNavigation} from "@react-navigation/native";
import {useState, useEffect, ReactNode} from "react";
import { useAuth} from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
type TTextProps = {
        children: ReactNode | string,
        style?: TextStyle
}

const H1 = ({children, style}: TTextProps) =>{
        const theme = useTheme();
        return (<DefaultText style={{color: theme.primary, fontSize: 26, fontWeight: "700", ...style}}>{children}</DefaultText>)
    }
const H2 = ({children, style}: TTextProps) =>{
        const theme = useTheme();
        return (<DefaultText style={{color: theme.foreground,fontSize: 22, fontWeight: "600", ...style}}>{children}</DefaultText>)
}
const H3 = ({children, style}: TTextProps) =>{
        const theme = useTheme();
        return (<DefaultText style={{color: theme.foreground,fontSize: 18, fontWeight: "600" , ...style}}>{children}</DefaultText>)
}
const P =  ({children, style}:TTextProps) =>{
        const theme = useTheme();
        return (<DefaultText style={{color: theme.foreground, fontSize: 16, fontWeight: "300", ...style}}>{children}</DefaultText>)
}
const Text = {
        H1,
        H2,
        H3,
        P
}


export default Text