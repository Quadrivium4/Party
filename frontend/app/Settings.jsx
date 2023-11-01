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
import { useTouch } from '../context/TouchContext';
import Loader from '../components/Loader';

const Settings = () =>{
    const {logout, user, deleteAccount} = useAuth();
    const [loading, setLoading] = useState(false);
    const theme = useTheme();
    const {logSubscribers} = useTouch();
    const handleLogout = async() =>{
        setLoading(true)
        await logout();
        setLoading(false)
    }
    return (
        <View>
            <Loader fullscreen={true} visible={loading} />
            <Text.H1>{user.name}</Text.H1>
            <Text.P>{user.email}</Text.P>
            
            <Button onPress={handleLogout}>Log out</Button>
            <Button onPress={deleteAccount}>Delete Account</Button>
            <Button onPress={theme.toggleTheme}>Toggle theme</Button>
            <Button onPress={logSubscribers}>log subscribers</Button>
        </View>
    );
}
export default Settings