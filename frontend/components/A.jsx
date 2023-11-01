import { StyleSheet,View, Pressable} from 'react-native';
import {NavigationContainer, Link, useNavigation} from "@react-navigation/native";
import {useState, useEffect} from "react";
import { useAuth, useAuthDispatch } from '../context/AuthContext';
import Text from './Text';
import Button from './Button';
const initialStyles = {
        alignItems: "center",
        justifyContent: "center",
    };
const A = ({children, to, style}) =>{
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
        <Pressable onPress={handlePress} style={{ opacity, ...style }}>
            <Text.P style={{color: "rgb(100, 150,255)"}}>{children}</Text.P>
        </Pressable>
    );
}
const AButton = ({ children, to, params, ...props }) => {
    const [opacity, setOpacity] = useState(1);
    const navigation = useNavigation();
    const handlePress = () => {
        setOpacity(0.75);
        setTimeout(() => {
            setOpacity(1);
        }, 100);
        navigation.navigate(to,params);
    };
    return (
        <Button onPress={handlePress} style={{ ...initialStyles, opacity }} {...props}>
            {children}
        </Button>
    );
};
export {
    A, 
    AButton
} 