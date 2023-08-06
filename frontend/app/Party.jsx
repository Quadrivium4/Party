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
import { useMessage } from "../context/MessageContext";
import Loader from "../components/Loader";
import Carusel from "../components/Carusel";
const baseUri = "http://172.20.10.2:5000/protected/checkout/";

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
    const {message} = useMessage();
    const { id } = route.params;
    console.log({ party });
    useEffect(()=>{
        if(isModalVisible === false) setWebViewLoading(true);
    },[isModalVisible])
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
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            width: "100%",
                            backgroundColor: theme.medium,
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Text.P>{party.location}</Text.P>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 5,
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
                                            
                                            setIsModalVisible(false);
                                            message.warning("Order canceled!")
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
                                            console.log(msg)
                                            const data = JSON.parse(msg.nativeEvent.data);
                                            
                                            console.log("data: ", data);

                                            switch (data.type) {
                                                case "loaded":
                                                    setWebViewLoading(false);
                                                    break;
                                                case "loading":
                                                    setWebViewLoading(true);
                                                    break;
                                                case "success": 
                                                    setIsModalVisible(false);
                                                    message.success(data.message);
                                                    break;
                                                case "error":
                                                    setIsModalVisible(false);
                                                    message.error(data.message);
                                                case "canceled": 
                                                    message.warning(data.message);
                                                    break
                                                default:
                                                    break;
                                            }
                                            //Linking.openURL(json.link);
                                        }}
                                        source={{
                                            uri,
                                            headers: {
                                                Authorization:
                                                    "Bearer " + token,
                                            },
                                        }}
                                    ></WebView>
                                    <Loader visible={webViewLoading} />
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
