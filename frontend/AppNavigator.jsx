import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, Button } from 'react-native';
import {NavigationContainer, Link, useNavigation, getFocusedRouteNameFromRoute} from "@react-navigation/native";
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
import Party from './app/Party';


const Tab = createBottomTabNavigator();
const AppStack = createNativeStackNavigator();
const TabScreens = {
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
const TabNavigator = () =>{
    const theme = useTheme();
    return (<Tab.Navigator sceneContainerStyle={{backgroundColor: theme.background}} screenOptions={({route})=>({
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
                let iconName = TabScreens[route.name].icon;
                //console.log({iconName})
                return <Icon name={iconName} size={size} color={color} />;
            }
            })}>
            {
                Object.entries(TabScreens).map(([key, value])=>{
                    //console.log({key, value})
                    return <Tab.Screen key={key} name={key} component={value.component} />
                })
                }
            </Tab.Navigator>)
}
const AppNavigator = () =>{
    const theme = useTheme();
    //console.log()
    return (
        <AppStack.Navigator 
        
         screenOptions={({route})=>({
            headerShown: route.name == "Home"? false: true,
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
            headerTintColor: theme.foreground,
            contentStyle: theme.background
            })}>
            <AppStack.Screen component={TabNavigator} name="Home" />
            <AppStack.Screen component={Party} name="Party" />
        </AppStack.Navigator>
        
    )
}
export default AppNavigator