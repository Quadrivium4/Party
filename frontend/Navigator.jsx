
import {Link, NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import AppNavigator from "./AppNavigator";
import AuthNavigator from "./AuthNavigator";
import { useAuth } from "./context/AuthContext";

import * as Linking from 'expo-linking';
import Verify from "./auth/Verify";
import { View } from "react-native";
import Text from "./components/Text";
import { useTheme } from "./context/ThemeContext";
const Home = () =>{
    return <View>

        <Text.H1>HOME</Text.H1>
        <Link to={"/verify"}>go to verify</Link>
        </View>
}
const Default = createNativeStackNavigator();
const prefix = Linking.createURL('/');
console.log(prefix)
const config = {
    screens: {
        Home: {
            path: "home"
        },
        Verify: 'verify/:id/:token',
    },
};

const linking = {
  prefixes: [prefix],
  config,
};

const Navigator = () =>{
    const {logged } = useAuth();
    const theme = useTheme()
    console.log({logged})
    return (
        <NavigationContainer 
        linking={linking} 
        theme={{
            colors: {
                background: theme.background
                }
            }}>
            {logged? <AppNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    )
}
export default Navigator