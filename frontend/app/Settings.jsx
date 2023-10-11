import { StyleSheet,View, ScrollView, KeyboardAvoidingView, TextInput, SafeAreaView, Keyboard, } from 'react-native';
import {NavigationContainer, Link, useNavigation} from "@react-navigation/native";
import {useState, useEffect} from "react";
import { useAuth, useAuthDispatch } from '../context/AuthContext';
import Text from "../components/Text";
import Button from '../components/Button';
import Input from '../components/Input';
import ShiftingView from '../components/ShiftingView';
import { postParty } from '../controllers/party';
import { useTheme } from '../context/ThemeContext';

const Settings = () =>{
    const {logout, user, deleteAccount} = useAuth();
    const theme = useTheme();
    return (
        <View>
            <Text.H1>{user.name}</Text.H1>
            <Text.P>{user.email}</Text.P>
            
            <Button onPress={logout}>Log out</Button>
            <Button onPress={deleteAccount}>Delete Account</Button>
            <Button onPress={theme.toggleTheme}>Toggle theme</Button>
        </View>
    );
}
export default Settings