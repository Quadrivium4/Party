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
import { insertScriptHead, protectedCrossing } from "../utils";
import { buyTicket } from "../controllers/tickets";
import WebView from "react-native-webview";
import * as Constants from "expo-constants";
import { Linking } from "react-native";
import { baseUrl } from "../constants";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "../context/ThemeContext";
const baseUri = "http://172.20.10.2:5000/protected/checkout/";

const Carusel = ({ images, i = 0, closeModal }) => {
    console.log({ i });
    const [index, setIndex] = useState(i);
    const theme = useTheme();
    const [touch, setTouch] = useState({x: 0, y: 0});
    let t = {
        x: 0,
        y: 0
    }
    const carusel = useRef();
    const scrollLeft = () =>{
        if (!index > 0) return;
        carusel.current.scrollToIndex({
            index: index - 1,
        });
        setIndex(index - 1);
    }
    const scrollRight = () =>{
        if (!index < images.length - 1) return;
        carusel.current.scrollToIndex({
            index: index + 1,
        });
        setIndex(index + 1);
    }
    return (
        <TouchableWithoutFeedback onPress={()=>{

            closeModal()
            }}>
            <View
                style={{
                    ...styles.centeredView,
                    height: "100%",
                    backgroundColor: "rgba(0,0,0, 0.5)",
                }}
            >
                <TouchableWithoutFeedback>
                    <View style={{ backgroundColor: "red", justifyContent: "center" }} 
                    onTouchStart={(e)=>{
                        console.log(t)
                        t.x = e.nativeEvent.pageX;
                        console.log("touch start", t.x)
                        }
                    }
                    onTouchEnd={(e)=>{
                        console.log(t);
                        let x = e.nativeEvent.pageX;
                        console.log("touch end", t.x - x);
                        if(t.x - x > 20) {
                            console.log("left")
                            scrollRight()
                        }
                        if (t.x - x < -20) {
                            console.log("right");
                            scrollLeft()
                        }
                    }}>
                        <FlatList
                            ref={carusel}
                            horizontal={true}
                            keyExtractor={(item) => item}
                            //onLayout={()=> carusel.current.scrollToIndex({index: i})}
                            initialScrollIndex={i}
                            getItemLayout={(data, index) => {
                                return {
                                    length: Dimensions.get("window").width,
                                    offset:
                                        Dimensions.get("window").width * index,
                                    index,
                                };
                            }}
                            data={images}
                            style={{
                                height: "auto",
                                backgroundColor: "red",
                                flexGrow: 0,
                            }}
                            renderItem={({ item, index }) => {
                                return (
                                    <Image
                                        source={{
                                            uri: baseUrl + "/file/" + item,
                                        }}
                                        style={{
                                            width: Dimensions.get("window")
                                                .width,
                                            height: "auto",
                                            aspectRatio: 3 / 3,
                                        }}
                                    ></Image>
                                );
                            }}
                        ></FlatList>
                        <Pressable
                            onPress={scrollLeft}
                            style={{
                                position: "absolute",
                                alignSelf: "flex-start",
                            }}
                        >
                            <Icon
                                name="arrow-left-drop-circle-outline"
                                size={60}
                                color={index > 0 ? "black" : "gray"}
                            />
                        </Pressable>
                        <Pressable
                            onPress={scrollRight}
                            style={{
                                position: "absolute",
                                alignSelf: "flex-end",
                            }}
                        >
                            <Icon
                                name="arrow-right-drop-circle-outline"
                                size={60}
                                color={
                                    index < images.length - 1 ? "black" : "gray"
                                }
                            />
                        </Pressable>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </TouchableWithoutFeedback>
    );
};
const Party = ({ route }) => {
    const { token } = useAuth();
    console.log({ token });
    const [party, setParty] = useState();
    const theme = useTheme();
    const [uri, setUri] = useState();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [webViewLoading, setWebViewLoading] = useState(true);
    const [imageModal, setImageModal] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);
    const { id } = route.params;
    console.log({ party });
    useEffect(() => {
        if (party) return;
        getParty(id).then((res) => {
            //setUri("http://172.20.10.2:5000/checkout");
            setParty(res);
            setUri(baseUri + res._id);
        });
    }, []);
    return (
        <ScrollView>
            {party ? (
                <View>
                    <Text.H1>{party.name}</Text.H1>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            height: 40,
                            width: "100%",
                            backgroundColor: theme.medium,
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Text.P>{party.location}</Text.P>
                        <View
                            style={{
                                flex: 1,
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 5,
                                width: 30,
                                flexBasis: 70,
                                flexGrow: 0,
                            }}
                        >
                            <Icon
                                name="account-group-outline"
                                size={30}
                                color={theme.foreground}
                            ></Icon>
                            <Text.P>
                                {party.people.length}/{party.capacity}
                            </Text.P>
                        </View>
                    </View>
                    <Text.P>{party.description}</Text.P>
                    <View style={{ flex: 1, flexDirection: "row" }}>
                        {party.images.length > 0
                            ? party.images.map((image, i) => {
                                  console.log(i);
                                  return (
                                      <Pressable
                                          key={i}
                                          onPress={() => {
                                              setImageModal(true);
                                              setImageIndex(i);
                                              //imageIndex = i;
                                          }}
                                      >
                                          <Image
                                              source={{
                                                  uri:
                                                      baseUrl +
                                                      "/file/" +
                                                      image,
                                              }}
                                              style={{
                                                  width: 100,
                                                  height: 100,
                                              }}
                                          ></Image>
                                      </Pressable>
                                  );
                              })
                            : null}
                    </View>
                    <Modal visible={imageModal} transparent={true}>
                        <Carusel
                            images={party.images}
                            i={imageIndex}
                            closeModal={() => setImageModal(false)}
                        />
                    </Modal>
                    <Button
                        onPress={() => {
                            /*buyTicket(party._id).then(res =>{
                        console.log(res)
                        setUri(res.link)
                    })*/
                            setIsModalVisible(true);
                        }}
                    >
                        Buy €{party.price}
                    </Button>

                    {
                        <Modal
                            animationType="slide"
                            visible={isModalVisible}
                            transparent={true}
                        >
                            <View
                                style={{
                                    height: "100%",
                                    ...styles.centeredView,
                                }}
                            >
                                <View
                                    style={{
                                        height: 480,
                                        borderRadius: 10,
                                        padding: 20,
                                    }}
                                >
                                    <Pressable
                                        onPress={() => {
                                            console.log("hi");
                                            setIsModalVisible(false);
                                        }}
                                    >
                                        <Icon
                                            name="close-box-outline"
                                            size={30}
                                            color={theme.foreground}
                                            style={{
                                                alignSelf: "flex-end",
                                                zIndex: 10,
                                            }}
                                        ></Icon>
                                    </Pressable>

                                    <WebView
                                        style={{
                                            width: Dimensions.get("window")
                                                .width,
                                            alignSelf: "center",
                                            borderRadius: 10,
                                        }}
                                        onMessage={(msg) => {
                                            const message =
                                                msg.nativeEvent.data;
                                            console.log("message: ", message);
                                            if (message === "loaded")
                                                setWebViewLoading(false);
                                            if (message[0] === "{") {
                                                json = JSON.parse(message);
                                                console.log(json);
                                                if (json.error) {
                                                    setWebViewLoading(false);
                                                    setIsModalVisible(false);
                                                    alert(json.error);
                                                }
                                                if (json.link)
                                                    Linking.openURL(json.link);
                                            } else console.log(message);
                                        }}
                                        source={{
                                            uri,
                                            headers: {
                                                Authorization:
                                                    "Bearer " + token,
                                            },
                                        }}
                                    ></WebView>
                                    {webViewLoading ? (
                                        <ActivityIndicator
                                            style={{
                                                position: "absolute",
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                top: 0,
                                            }}
                                            size="large"
                                        />
                                    ) : null}
                                </View>
                            </View>
                        </Modal>
                    }
                </View>
            ) : (
                <Text.P>Loading...</Text.P>
            )}
        </ScrollView>
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
export default Party;
