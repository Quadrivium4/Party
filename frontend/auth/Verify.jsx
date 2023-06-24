import { StyleSheet, View, Pressable,  TextInput} from 'react-native';
import {NavigationContainer, Link, useNavigation} from "@react-navigation/native";
import { useAuth, useAuthDispatch } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import Text from '../components/Text';
import * as Linking from 'expo-linking';
import Button from '../components/Button';
const Verify = ({route}) =>{
    const dipatch = useAuthDispatch();
    const {verify} = useAuth();
    const {id, token} = route.params;
    console.log({id, token})
    useEffect(()=>{
        verify(id, token)
    },[])
    return (
        <View>
            <Text.H1>Verifing...</Text.H1>
            <Link to={"/verify"}>go to verify</Link>
            <Link to={"/home"}>go to home</Link>
        </View >)
}
export default Verify
