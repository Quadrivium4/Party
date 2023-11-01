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
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
import Loader from "../components/Loader";
const baseUri = "http://172.20.10.2:5000/protected/checkout/";


const MyParties= ({ route, navigation }) => {
    const [parties, setParties] = useState();
    const theme = useTheme();
    const styles = useMemo(()=> getStyles(theme), [theme]);
    const [loading, setLoading] = useState(false);
    console.log(route.params);
    useEffect(()=>{
         if (route.params?.reload || !parties) {
             navigation.setParams({ reload: false });
             setParties([])
             setLoading(true)
             getMyParties().then((res) => {
                 setParties(res);
                 console.log("it worked");
                 setLoading(false)
             });
         }
    },[route.params?.reload])
    return (
        <View style={{ flex: 1 }}>
            <Loader visible={loading} />
            <ScrollView
                style={styles.partiesBox}
                contentContainerStyle={{
                    gap: 10,
                    paddingBottom: 0,
                    position: "relative",
                }}
            >
                {parties?.map((party) => {
                    let date = new Date(party.date);
                    return (
                        <Pressable
                            key={party._id}
                            onPress={() => {
                                navigation.navigate("PartyManager", {});
                            }}
                        >
                            <View style={styles.partyBox}>
                                <View
                                    style={{
                                        flex: 1,
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <Text.H2>{party.name}</Text.H2>
                                    <Text.P>{getDateFormatted(date)}</Text.P>
                                </View>
                                <Text.P>{party.location}</Text.P>

                                {/* <Button type="outline">delete</Button> */}
                            </View>
                        </Pressable>
                    );
                })}
            </ScrollView>
            {/* <A to={"CreateParty"} style={{alignSelf: "center", position: "absolute", bottom: 0, backgroundColor: theme.strong, borderRadius: 50}}>
                <Icon
                    name="plus-circle-outline"
                    size={38}
                    color={theme.primary}
                ></Icon>
            </A> */}
            <AButton to={"CreateParty"} style={{marginBottom: 10}}>Create Party</AButton>
            {/* <Button
                onPress={() => {
                    navigation.navigate("MyParties", { reload: true });
                }}
            >
                hel
            </Button> */}
        </View>
    );
};
function getStyles (theme) {
    return StyleSheet.create({
        partiesBox: {
            
        },
        partyBox: {
            flex: 1,
            position: "relative",
            justifyContent: "center",
            borderColor: theme.light,
            borderWidth: 1,
            borderRadius: 3,
            padding: 20
        },
    })
}
export default MyParties;
