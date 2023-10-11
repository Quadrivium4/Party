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
    useFocusEffect
} from "@react-navigation/native";
import { useState, useEffect, useRef, useCallback } from "react";
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
import { A, AButton } from "../components/A";
const baseUri = "http://172.20.10.2:5000/protected/checkout/";


const MyParties= ({ route, navigation }) => {
    const [parties, setParties] = useState();
    const theme = useTheme();
    console.log(route.params);
    useEffect(()=>{
        console.log("changed");
    },[route.params?.reload])
    if(route.params?.reload){
        navigation.setParams({ reload: false });
        getMyParties().then((res) => {
            setParties(res);
            console.log("it worked")
            //setUri("http://172.20.10.2:5000/checkout");
            //setParty(res);
            //setUri(baseUri + res._id);
        });
    }
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
            <ScrollView style={{padding: 10, maxHeight: 300}}>
                {parties?.map((party) => {
                    let date = new Date(party.date);
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
            <A to={"CreateParty"}><Icon name="plus-circle-outline" size={30} color={theme.primary}></Icon></A>
            <Button onPress={()=>{
                navigation.navigate("MyParties",{reload: true});
            }}>hello</Button>
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
