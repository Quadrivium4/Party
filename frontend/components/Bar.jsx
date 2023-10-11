
import {
    StyleSheet,
    View,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    TextInput,
    SafeAreaView,
    Keyboard,
    Linking,
    Pressable,
    ImageBackground,
    Dimensions,
    Animated,
    Easing,
    Modal,
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
import Icon from "react-native-vector-icons/";
import { postParty } from "../controllers/party";
import { getOnboardingLink } from "../controllers/payment";
import * as ImagePicker from "expo-image-picker";
import { baseUrl } from "../constants";
import { useTheme } from "../context/ThemeContext";
const Bar = ({ index , total }) => {
    const slideAnim = useRef(new Animated.Value(0)).current;
    const theme = useTheme();
    const getWidth = () => {
        return (Dimensions.get("window").width / total) * (index + 1);
    };
    useEffect(() => {
        let animation = Animated.timing(slideAnim, {
                toValue: getWidth(),
                duration: 750,
                useNativeDriver: false,
            });
		if(index !== false){
			console.log({index, total})
			animation.start();
			//return () => animation.reset();
		}else{
			animation.reset()
		}
        
    }, [index]);
    return (
        <Animated.View
            style={{
                width: slideAnim,
                height: 5,
                backgroundColor: theme.primary,
                justifyContent: "center",
            }}
        >
            <View
                style={{
                    width: Dimensions.get("window").width,
                    height: 1,
                    backgroundColor: theme.primary,
                    marginTop: 1,
                }}
            ></View>
        </Animated.View>
    );
};
export default Bar