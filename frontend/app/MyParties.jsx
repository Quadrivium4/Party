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
import { useTheme } from "../context/ThemeContext";
const baseUri = "http://172.20.10.2:5000/protected/checkout/";


const MyParties= ({ route }) => {
    const [parties, setParties] = useState();
    const theme = useTheme();

    useEffect(() => {
        if (parties) return;
        getMyParties().then((res) => {
            setParties(res);
            //setUri("http://172.20.10.2:5000/checkout");
            //setParty(res);
            //setUri(baseUri + res._id);
        });
    }, []);
    return (
        <View>
            <Text.H1>My Parties</Text.H1>
            <ScrollView style={{padding: 10}}>
                {parties?.map((party) => {
                    console.log(party.date);
                    let date = new Date(party.date);
                    console.log(date.getMonth());
                    return (
                        <View key={party._id}>
                            <Text.H2>{party.name}</Text.H2>
                            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between"}}>
                                <Text.P>{party.location}</Text.P>
                                <Text.P>{getDateFormatted(date)}</Text.P>
                            </View>

                            <Button>delete</Button>
                        </View>
                    );
                })}
            </ScrollView>
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
