import { StyleSheet, View, Pressable, Image, Modal, Animated, Easing, TouchableWithoutFeedback} from "react-native";
import  {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    runOnJS,
    runOnUI,
} from "react-native-reanimated";
import  Constants  from "expo-constants";
import {
    NavigationContainer,
    Link,
    useNavigation,
} from "@react-navigation/native";
import { useState, useEffect, useRef } from "react";
import { useAuth, useAuthDispatch } from "../context/AuthContext";
import Text from "./Text";
import { useTheme } from "../context/ThemeContext";
import WebView from "react-native-webview";
import { baseUrl } from "../constants";
import * as Google from "expo-auth-session/providers/google";
import { useMessage } from "../context/MessageContext";

const Message = () => {
    const theme = useTheme();
	const messageObj = useMessage();
	const slideAnim = useRef(new Animated.Value(10)).current;
	const fadeAnim = useRef(new Animated.Value(1)).current;
	const [message, setMessage] = useState(messageObj.content);
	useEffect(()=>{
		//console.log("message changed", message);
		//console.log({message})
	},[message])
	const animation = useRef(Animated.sequence([
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 750,
                easing: Easing.bounce,
                useNativeDriver: false,
            }),
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 1000,
				delay: 5000,
                useNativeDriver: false,
            }),
        ])).current
		
	const reset = ({finished}) =>{
		//console.log("reset..",{finished})
		animation.reset();
		//console.log({slideAnim, fadeAnim})
		
		setMessage(null);
	}
	const colors = {
		success: "rgba(100, 215, 100, 0.9)",
		error: "rgba(215, 100, 100, 0.9)",
		warning: "rgba(215,200, 0, 0.9)"
	}
	useEffect(() => {
		//console.log("content changed!!1")
		setMessage(messageObj.content);
		animation.start(reset);
		return () =>{
			reset({finished: true});
		};
	},[messageObj]);
    return message ? (
        <TouchableWithoutFeedback onPress={reset}>
            <Animated.View
                style={{
                    ...styles.message,
                    backgroundColor: colors[messageObj.type],
                    top: slideAnim,
                    opacity: fadeAnim,
                }}
                onTouchStart={() => console.log("hello")}
            >
                <Text.H3 style={{ color: "rgba(10,10,10, 0.75)" }}>
                    {message}
                </Text.H3>
            </Animated.View>
        </TouchableWithoutFeedback>
    ) : null;
};
const styles = StyleSheet.create({
	message: {
		position: "absolute",
		paddingHorizontal: 20 ,
		paddingVertical: 12,
		paddingTop:  Constants.statusBarHeight + 12,
		width: "100%",
		zIndex: 1
	}
})

export default Message;