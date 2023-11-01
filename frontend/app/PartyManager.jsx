import {
    StyleSheet,
    View,
    ScrollView,
    KeyboardAvoidingView,
    TextInput,
    SafeAreaView,
    Keyboard,
    Modal,
    ActivityIndicator,
    Dimensions,
    Image,
    Pressable,
    FlatList,
    TouchableWithoutFeedback,
    TouchableOpacity,
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
import { getParty, postParty } from "../controllers/party";
import {
    getDateFormatted,
    insertScriptHead,
    protectedCrossing,
} from "../utils";
import { buyTicket } from "../controllers/tickets";
import WebView from "react-native-webview";
import * as Constants from "expo-constants";
import { Linking } from "react-native";
import { baseUrl } from "../constants";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "../context/ThemeContext";
import { useMessage } from "../context/MessageContext";
import Loader from "../components/Loader";
import Carusel from "../components/Carusel";

const PartyManager = ({route}) => {
    const {params} = route;
    const { token } = useAuth();
    //console.log({ token });
    const [party, setParty] = useState();
    return (
        <View>
            
        </View>
    )
};

export default PartyManager;
