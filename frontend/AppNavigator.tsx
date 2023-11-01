import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Pressable, Button, Image } from "react-native";
import {
    NavigationContainer,
    Link,
    useNavigation,
    getFocusedRouteNameFromRoute,
    
} from "@react-navigation/native";
import { useState, useEffect, ReactNode, FC } from "react";
import { getHeaderTitle } from "@react-navigation/elements";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./app/Home";
import CreateParty from "./app/CreateParty/CreateParty";
import { useAuth} from "./context/AuthContext";
import { createBottomTabNavigator, BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CummunityIcon from "react-native-vector-icons/AntDesign";
import Settings from "./app/Settings";
import { useTheme } from "./context/ThemeContext";
import Party from "./app/Party";
import Text from "./components/Text";
import Tickets from "./app/Tickets";
import { A } from "./components/A";
import MyParties from "./app/MyParties";
import Header from "./components/Header";
import ChatRoom from "./app/ChatRoom";
import PartyManager from "./app/PartyManager";

const Tab = createBottomTabNavigator();
const AppStack = createNativeStackNavigator();
const TabScreens: {
    [key: string]: {
        icon: string,
        component: any,
        title: string
    }
} = {
    Home: {
        icon: "home-outline",
        component: Home,
        title: "Search a Party",
    },

    MyParties: {
        icon: "party-popper",
        component: MyParties,
        title: "My Parties",
    },
    Tickets: {
        icon: "ticket-outline",
        component: Tickets,
        title: "My Tickets",
    },
};
export type TTabScreens = {
    Home: undefined,
    MyParties: {reload?: boolean} | undefined,
    Tickets: undefined
}
export type TBottomTabNavigator = BottomTabNavigationProp<TTabScreens>
const TabNavigator = () => {
    const theme = useTheme();
    return (
        <Tab.Navigator
            sceneContainerStyle={{ backgroundColor: theme.strong }}
            screenOptions={({ route }) => ({
                headerShown: true,

                header: (props) => <Header {...props} />,
                tabBarStyle: {
                    backgroundColor: theme.background,
                    borderTopWidth: 1,
                    borderTopColor: theme.primary,
                },
                tabBarActiveTintColor: theme.primary_contrast,
                tabBarInactiveTintColor: theme.contrast,
                tabBarLabel: route.name,
                tabBarIcon: ({ focused, color, size }) => {
                    //console.log({route})
                    let iconName = TabScreens[route.name].icon;
                    //console.log({iconName})
                    return <Icon name={iconName} size={size} color={color} />;
                },
            })}
        >
            {Object.entries(TabScreens).map(([key, value]) => {
                //console.log({key, value})
                return (
                    <Tab.Screen
                        key={key}
                        name={key}
                        component={value.component}
                        options={{ title: value.title }}
                    />
                );
            })}
        </Tab.Navigator>
    );
};
const Idiot = () => {
    return <Text.H1>Hello Idiot</Text.H1>;
};
const AppNavigator = () => {
    const theme = useTheme();
    //console.log()
    return (
        <AppStack.Navigator
            screenOptions={({ route }) => ({
                headerShown: route.name == "TabNavigator" ? false : true,
                header: (props) => <Header {...props} />,
                contentStyle: {
                    backgroundColor: theme.strong,
                },
            })}
        >
            <AppStack.Screen component={TabNavigator} name="TabNavigator" />
            <AppStack.Screen component={Party} name="Party" />
            <AppStack.Screen component={ChatRoom} name="ChatRoom" />
            <AppStack.Screen component={Settings} name="Settings" />
            <AppStack.Screen component={Idiot} name="Idiot" />
            
            <AppStack.Screen component={PartyManager} name="PartyManager" />
        </AppStack.Navigator>
    );
};

export default AppNavigator;
