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
import { getParties, getParty, postParty } from "../controllers/party";
import { insertScriptHead, protectedCrossing } from "../utils";
import { buyTicket } from "../controllers/tickets";
import WebView from "react-native-webview";
import * as Constants from "expo-constants";
import { Linking } from "react-native";
import { baseUrl } from "../constants";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "../context/ThemeContext";
const baseUri = "http://172.20.10.2:5000/protected/checkout/";


const MyParties= ({ route }) => {
    const { token } = useAuth();
    console.log({ token });
    const [party, setParty] = useState();
    const theme = useTheme();

    console.log({ party });
    useEffect(() => {
        if (party) return;
        getParties().then((res) => {
            //setUri("http://172.20.10.2:5000/checkout");
            //setParty(res);
            //setUri(baseUri + res._id);
        });
    }, []);
    return (
		<View>
			<Text.H1>My Parties</Text.H1>
		</View>
    );
};
const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: Constants.default.statusBarHeight,
    },
});
export default MyParties;
