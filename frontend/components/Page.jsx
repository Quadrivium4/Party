import {
    StyleSheet,
    View,
    ScrollView,
    FlatList,
    KeyboardAvoidingView,
    TextInput,
    SafeAreaView,
    Platform,
    Pressable,
    Keyboard,
    TouchableWithoutFeedback,
    Dimensions,
} from "react-native";
import {
    NavigationContainer,
    Link,
    useNavigation,
} from "@react-navigation/native";
import { useState, useEffect} from "react";
import { useAuth, useAuthDispatch } from "../context/AuthContext";
import Text from "../components/Text";
import Button from "../components/Button";
import Input from "../components/Input";
import ShiftingView from "../components/ShiftingView";
import { getNearParties, postParty } from "../controllers/party";
import * as Location from "expo-location";
import A from "../components/A";
import { useTheme } from "../context/ThemeContext";
import WebView from "react-native-webview";
import { useMessage } from "../context/MessageContext";
import Pop from "../components/Pop";
import { useTouch } from "../context/TouchContext";

const Page = ({children}) => {
	const {handleTouch } = useTouch();

    return (
        <TouchableWithoutFeedback
            onPress={(e) => {
				handleTouch(e)
            }}
			
        >
            <View
                style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    right: 0,
                    left: 0,
                }}
            >
                <View>{children}</View>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default Page;
