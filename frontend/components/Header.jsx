import {
    StyleSheet,
    View,
    ScrollView,

    Modal,
    ActivityIndicator,
    Dimensions,
    Image,
    Pressable,
    FlatList,
    TouchableWithoutFeedback,

} from "react-native";
import {
    NavigationContainer,
    Link,
    useNavigation,
} from "@react-navigation/native";
import { useState, useEffect, useRef } from "react";
import { useAuth, useAuthDispatch } from "../context/AuthContext";
import Text from "../components/Text";
import Button from "../components/Button";
import Input from "../components/Input";
import ShiftingView from "../components/ShiftingView";
import { getMyParties, getParty, postParty } from "../controllers/party";
import { getDateFormatted, insertScriptHead, protectedCrossing } from "../utils";
import { buyTicket } from "../controllers/tickets";
import WebView from "react-native-webview";
import * as Constants from "expo-constants";
import { Linking } from "react-native";
import { baseUrl } from "../constants";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import IconAnt from "react-native-vector-icons/AntDesign"
import { useTheme } from "../context/ThemeContext";
import { A } from "./A";
import Bar from "./Bar";
import { useStatusBar } from "../context/StatusBarContext";

const Header = ({navigation, route}) =>{
	const theme = useTheme();
	const {logged} = useAuth();
	const {index, total} = useStatusBar();
	//console.log({navigation, route})
	return (
        <View style={{ backgroundColor: theme.background }}>
            <View
                style={{
                    paddingTop: 5 + Constants.default.statusBarHeight,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingHorizontal: 10,
                    paddingBottom: 5,
                    height: 80,
                }}
            >
                {(navigation.canGoBack() && (route.name === "Settings" || route.name === "ChatRoom")) ||
                route.name === "Party" || route.name === "PartyManager"? (
                    <Pressable
                        onPress={navigation.goBack}
                        style={{ flexDirection: "row" }}
                    >
                        <IconAnt
                            size={20}
                            name="caretleft"
                            color={theme.primary}
                        ></IconAnt>
                        <Text.P>Back</Text.P>
                    </Pressable>
                ) : (
                    <Image
                        source={require("../assets/party-logo.png")}
                        style={{
                            width: 50,
                            height: "auto",
                            aspectRatio: 3 / 3,
                        }}
                    ></Image>
                )}
                <Text.H3 style={{textTransform: "uppercase"}}>{route.name}</Text.H3>
                {logged ? (
                    <A
                        to={"Settings"}
                        style={{
                            width: 50,
                            justifyContent: "flex-end",
                            flexDirection: "row",
                        }}
                    >
                        <Icon
                            name="account-outline"
                            size={30}
                            color={theme.foreground}
                        ></Icon>
                    </A>
                ) : (
                    <View
                        style={{
                            width: 50,
                        }}
                    ></View>
                )}
            </View>
            <Bar index={index} total={total}></Bar>
        </View>
    );
}

export default Header