import Text from "../components/Text"
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
	LayoutAnimation,
    TouchableWithoutFeedback,
    Dimensions,
	Easing,
    VirtualizedList
} from "react-native";
import {
    NavigationContainer,
    Link,
    useNavigation,
} from "@react-navigation/native";
import { useState, useEffect, useRef } from "react";
import { useAuth, useAuthDispatch } from "../context/AuthContext";
import Animated, {useSharedValue, withTiming, useAnimatedStyle, runOnJS, runOnUI} from "react-native-reanimated";
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
import socket from "../controllers/socket";
import * as Crypto from "expo-crypto";
import { getDateDifference, getDateFormatted } from "../utils";

const ChatRoom = ({route}) =>{
	const [messageToSend, setMessageToSend] = useState("")
	const [messages, setMessages] = useState();
	const inputTranslateY = useSharedValue(0)
    const chatBodyHeight = useSharedValue(500)
	const [keyboardOffset, setKeyboardOffset] = useState("100%");
    const [flatListContentHeight, setFlatListContentHeight] = useState(0);
    const [flatListHeight, setFlatListHeight] = useState(0);
	const keyboardDidShowListener = useRef();
    const keyboardDidHideListener = useRef();
	const inputAnimation = useRef()
    const [viewHeight, setViewHeight] = useState(0);
	const {user} = useAuth();
	const theme = useTheme();
	const chatBody = useRef();
    const animatedStyles = useAnimatedStyle(()=>{
        return {
            height: chatBodyHeight.value
        }
    })
    const animatedStyles1 = useAnimatedStyle(() => {
        return {
            transform: [{translateY: inputTranslateY.value}],
        };
    });
	let previousMessage;
	let duration = 300;
	//console.log(route.params)
    useEffect(()=>{
        console.log({timing: Animated.timing})
        console.log({flatListContentHeight, flatListHeight})
        keyboardDidShowListener.current = Keyboard.addListener(
            "keyboardWillShow",
            (event) => {
                const value = viewHeight -(event.endCoordinates.height + 10)
                setKeyboardOffset(value);
                inputTranslateY.value = withTiming(
                    -event.endCoordinates.height, {
                        duration: event.duration
                    }
                );
                chatBodyHeight.value = withTiming(value, {
                    duration: event.duration
                },

                   () =>{
                    runOnJS(chatBody.current.scrollToEnd)()
                }
            );
                
            }
        );
        return () => {
            keyboardDidShowListener.current.remove();
        };
    },[flatListContentHeight, flatListHeight])
	useEffect(()=>{
		console.log("joining room...")
		socket.emit("joinRoom",route.params.chatId);
		socket.on("joinedRoom", (roomMessages) => {
            console.log("room joined");
            if(roomMessages.length < 1){
                // to do service message

                //return setMessages([{}])
            }
            setMessages(roomMessages);
        });
		Keyboard.scheduleLayoutAnimation({duration: 1000})
		
		
		keyboardDidHideListener.current = Keyboard.addListener("keyboardWillHide", (event) => {

              inputTranslateY.value = withTiming(0, {
                  duration: event.duration,
                
              });
              chatBodyHeight.value = withTiming(500, {
                  duration: event.duration,
              }, ()=>{
                
              })
               
        });
		return () =>{
			socket.off("joinedRoom")
			keyboardDidHideListener.current.remove();
		}
	},[])
	useEffect(()=>{
		//console.log(messages)
		socket.on("message", (message) => {
			//console.log(Platform.OS, message)
            setMessages([...messages, message]);
            //console.log({ messages });
        });
		return () => socket.off("message")
	},[messages, socket])
	const handleSubmit = () =>{
		
		const message = {
			id: Crypto.randomUUID(),
			date: new Date(),
			username: user.name,
			user: user._id,
			content: messageToSend,
			room: route.params.chatId
		}
		socket.emit("message", {
            room: route.params.chatId,
            message: message,
        });
		
		setMessages([...messages, message])
		
		setMessageToSend("");
		
	}
    function getDifference(){
        
        console.log({flatListContentHeight, flatListHeight})
        return (flatListHeight -flatListContentHeight)
    }
	console.log("new message")
	return (
        <SafeAreaView
            style={{
                flex: 1,
                flexGrow: 1,
                paddingHorizontal: 10,
            }}
        >
            <View
                style={{ flexGrow: 1, flex: 1 }}
                onLayout={(event) => {
                    setViewHeight(event.nativeEvent.layout.height)

                }}
            >
                <Animated.FlatList
                
                    onContentSizeChange={() => {
                        console.log("content changed");
                        messages ? chatBody.current.scrollToEnd() : null;
                    }}
                    onLayout={(event) => {

                    }}
                    style={[{
                        //height,
                        flexGrow: 0,
                        //backgroundColor: "green",
                    },animatedStyles]}
                    scrollEnabled={true}
                    ref={chatBody}
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item: message, index }) => {
                        const areYou = message.user === user._id;
                        let borderRadius = 8;
                        //console.log(message.user, previousMessage?.user);
                        let headerVisible = previousMessage
                            ? getDateDifference(
                                  message.date,
                                  previousMessage.date
                              ) >
                                  100 * 60 * 60 &&
                              previousMessage?.user == message.user
                            : true;
                        let header =
                            previousMessage?.user == message.user
                                ? ""
                                : areYou
                                ? "You"
                                : message.username;
                        previousMessage = message;
                        //console.log(theme.transparent);
                        //console.log(message.user, user._id)
                        return (
                            <View
                                onLayout={(event) => {
                                    const { x, y, width, height } =
                                        event.nativeEvent.layout;
                                    console.log(event.nativeEvent.layout);
                                    setFlatListContentHeight(height + 5);
                                }}
                                key={message.id}
                                style={{
                                    width: "80%",
                                    backgroundColor: areYou
                                        ? theme.transparent.primary
                                        : theme.transparent.light,
                                    padding: 15,
                                    marginBottom: 5,
                                    borderRadius: borderRadius,
                                    borderTopLeftRadius: areYou
                                        ? borderRadius
                                        : 0,
                                    borderTopRightRadius: areYou
                                        ? 0
                                        : borderRadius,
                                    alignSelf: areYou
                                        ? "flex-end"
                                        : "flex-start",
                                }}
                            >
                                {headerVisible ? (
                                    <View
                                        style={{
                                            flexDirection: areYou
                                                ? "row-reverse"
                                                : "row",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Text.H3>{header}</Text.H3>
                                        <Text.P>
                                            {getDateFormatted(message.date)}
                                        </Text.P>
                                    </View>
                                ) : null}

                                <Text.P>{message.content}</Text.P>
                            </View>
                        );
                    }}
                ></Animated.FlatList>
            </View>
            {/* <ScrollView style={{
				bottom: keyboardOffset
				//bottom: keyboardOffsetAnim
			}}  ref={chatBody} onScroll={(ev)=>console.log(ev.nativeEvent)}>
                    {messages.map((message) => {
                        const areYou = message.user === user._id;
                        let borderRadius = 5;
                        let header =
                            previousMessageUser == message.user
                                ? ""
                                : areYou
                                ? "You"
                                : message.username;
                        previousMessageUser = message.user;
                        //console.log(message.user, user._id)
                        return (
                            <View
                                key={message.id}
                                style={{
                                    width: "80%",
                                    backgroundColor: theme.transparent.light,
                                    padding: 15,
                                    marginBottom: 5,
                                    borderRadius: borderRadius,
                                    borderTopLeftRadius: areYou
                                        ? borderRadius
                                        : 0,
                                    borderTopRightRadius: areYou
                                        ? 0
                                        : borderRadius,
                                    alignSelf: areYou
                                        ? "flex-end"
                                        : "flex-start",
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: areYou
                                            ? "row-reverse"
                                            : "row",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Text.H3>{header}</Text.H3>
                                    <Text.P>
                                        {getDateFormatted(message.date)}
                                    </Text.P>
                                </View>

                                <Text.P>{message.content}</Text.P>
                            </View>
                        );
                    })}
            </ScrollView> */}
            <Animated.View
                style={[{
                    flexDirection: "row",
                    backgroundColor: "transparent"
                }, animatedStyles1]}
            >
                <View
                    style={{
                        backgroundColor: theme.background,
                        width: "70%",
                        justifyContent: "center",
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                    }}
                >
                    <TextInput
                        keyboardAppearance="dark"
                        onChangeText={setMessageToSend}
                        value={messageToSend}
                        multiline={true}
                        style={{ color: theme.foreground, fontSize: 16 }}
                    ></TextInput>
                </View>
                <Button onPress={handleSubmit}>send</Button>
            </Animated.View>
        </SafeAreaView>
    );
}
export default ChatRoom;