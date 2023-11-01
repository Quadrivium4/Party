
import {Link, NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import AppNavigator from "./AppNavigator";
import AuthNavigator from "./AuthNavigator";
import { useAuth } from "./context/AuthContext";

import * as Linking from 'expo-linking';
import Verify from "./auth/Verify";
import { ActivityIndicator, View } from "react-native";
import Text from "./components/Text";
import { useTheme } from "./context/ThemeContext";
import Loader from "./components/Loader";

const Home = () =>{
    return <View>

        <Text.H1>HOME</Text.H1>
        <Link to={"/verify"}>go to verify</Link>
        </View>
}
const Default = createNativeStackNavigator();
const prefix = Linking.createURL('/');
//console.log(prefix)
const config = {
    screens: {
        Home: {
            path: "home"
        },
        Verify: 'verify/:id/:token',
        TabNavigator: {
            path: "tab-navigator",
            screens: {
                Settings: "settings",
                CreateParty: "create-party/:paypalBusinessId?",
                Tickets: "tickets/:reload?"
            }
        }
    },
};

const linking = {
  prefixes: [prefix],
  config,
};

const Navigator = () =>{
    const {logged, loading } = useAuth();
    const theme = useTheme()
    //console.log({logged, loading})
    return (
        <NavigationContainer
            linking={linking}
            theme={{
                colors: {
                    background: theme.background,
                },
            }}
        >
            <View style={{flex: 1, backgroundColor: theme.background}}>
                {loading ? (
                    <Loader />
                ) : logged ? (
                    <AppNavigator />
                ) : (
                    <AuthNavigator />
                )}
            </View>
        </NavigationContainer>
    );
}
export default Navigator