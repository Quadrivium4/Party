import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, Button } from 'react-native';
import {NavigationContainer, Link, useNavigation} from "@react-navigation/native";
import {useState, useEffect} from "react";
import {getHeaderTitle} from "@react-navigation/elements";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Home from './app/Home';
import CreateParty from './app/CreateParty';
import { useAuth, useAuthDispatch } from './context/AuthContext';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/AntDesign';
import Settings from './app/Settings';
import { useTheme } from './context/ThemeContext';


const AppStackTab = createBottomTabNavigator();
const Screens = {
    Home: {
        icon: "home",
        component: Home
    },
    CreateParty: {
        icon: "pluscircleo",
        component: CreateParty
    },
    Settings: {
        icon: "setting",
        component: Settings
    },
}

const AppNavigator = () =>{
    const theme = useTheme();
    return (
        <AppStackTab.Navigator sceneContainerStyle={{backgroundColor: theme.background}} screenOptions={({route})=>({
            headerShown: true,
            headerStyle: {
                backgroundColor: theme.strong,
                borderBottomWidth: 1,
                borderBottomColor: theme.medium,
                shadowColor: 'transparent', // this covers iOS
                elevation: 0
            },
            headerTitleStyle: {
                color: theme.foreground
            },
            tabBarStyle: {
                backgroundColor: theme.strong,
                borderTopWidth: 1,
                borderTopColor: theme.medium
            },
            tabBarActiveTintColor: theme.primary_contrast,
            tabBarInactiveTintColor:theme.contrast,
            tabBarIcon: ({focused, color, size}) =>{
                //console.log({route})
                let iconName = Screens[route.name].icon;
                //console.log({iconName})
                return <Icon name={iconName} size={size} color={color} />;
            }
            })}>
            {
                Object.entries(Screens).map(([key, value])=>{
                    //console.log({key, value})
                    return <AppStackTab.Screen key={key} name={key} component={value.component} />
                })
                }
        </AppStackTab.Navigator>
    )
}
export default AppNavigator