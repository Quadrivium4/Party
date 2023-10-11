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
import { getDateFormatted, insertScriptHead, protectedCrossing } from "../utils";
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
const MyImage = ({ image, width = undefined, height = undefined }) => {
    const [loading, setLoading] = useState(true);
    return (
        <>
            <Image
                source={{
                    uri: baseUrl + "/file/" + image.id,
                }}
                onLoad={() => setLoading(false)}
                style={{
                    width: width,
                    height: height,
                    aspectRatio: image.aspectRatio,
                }}
            ></Image>
            {loading ? <Loader visible={loading}></Loader> : null}
        </>
    );
};
const Party = ({ route }) => {
    const { token } = useAuth();
    //console.log({ token });
    const [party, setParty] = useState();
    const [imageIds, setImageIds] = useState([]);
    const theme = useTheme();
    const [uri, setUri] = useState();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [webViewLoading, setWebViewLoading] = useState(true);
    const [imageModal, setImageModal] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);
    const {message} = useMessage();
    const { id } = route.params;
    //console.log({ party });
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
    const getDateAndHour = (d) => {
         let date = new Date(d);
         let minutes = date.getHours() + ":" + (date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes());
         const string = date
             .toLocaleDateString("en-EN", {
                 weekday: "short",
                 day: "numeric",
                 month: "short",
             })
             .replace();
         return {date: string, hour: minutes};
    }
    
    return (
        <View style={{}}>
            {party ? (
                <View style={{paddingBottom: 30}}>
                <ScrollView>
                    <View
                        style={{
                            alignItems: "center",
                            paddingVertical: 10,
                            position: "relative",
                            flexDirection: "row",
                            //justifyContent: "center",
                        }}
                    >
                        <Text.H1>{party.name}</Text.H1>
                        <Text.H3
                            style={{
                                color: theme.transparent.medium,
                                position: "absolute",
                                right: 0,
                            }}
                        >
                            {/* {new Date(party.date).getFullYear()} */}
                        </Text.H3>
                    </View>
                    <ScrollView
                        horizontal={true}
                        style={{ flex: 1, flexDirection: "row", height: 180 }}
                    >
                        {party.images.length > 0
                            ? party.images.map((image, i) => {
                                  let words = [
                                      "hey",
                                      "comfoojffdfdofjd",
                                      "hello",
                                  ];
                                  //console.log(i);
                                  return (
                                      <Pressable
                                          key={i}
                                          onPress={() => {
                                              setImageModal(true);
                                              setImageIndex(i);
                                              //imageIndex = i;
                                          }}
                                      >
                                          <MyImage
                                              height={180}
                                              image={image}
                                          ></MyImage>
                                      </Pressable>
                                  );
                              })
                            : null}
                    </ScrollView>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            width: "100%",
                            //backgroundColor: theme.medium,
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <Icon
                                name="calendar"
                                size={22}
                                color={theme.primary}
                            ></Icon>
                            <Text.P style={{ marginLeft: 2 }}>
                                {getDateAndHour(party.date).date}
                            </Text.P>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <Icon
                                name="clock-outline"
                                size={22}
                                color={theme.primary}
                            ></Icon>
                            <Text.P style={{ marginLeft: 2 }}>
                                {getDateAndHour(party.date).hour}
                            </Text.P>
                        </View>

                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 5,
                            }}
                        >
                            <Icon
                                name="account-group-outline"
                                size={22}
                                color={theme.primary}
                            ></Icon>
                            <Text.P>
                                {party.people.length}/{party.capacity}
                            </Text.P>
                        </View>
                    </View>
                    <View
                        style={{
                            backgroundColor: theme.transparent.light,
                            padding: 10,
                        }}
                    >
                        <Text.P>{party.description}</Text.P>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 5,
                        }}
                    >
                        <Icon
                            name="map-marker-outline"
                            size={30}
                            color={theme.primary}
                        ></Icon>
                        <Text.P>{party.location}</Text.P>
                    </View>

                    <Modal visible={imageModal} transparent={true}>
                        <Carusel
                            images={party.images}
                            i={imageIndex}
                            closeModal={() => setImageModal(false)}
                        />
                    </Modal>
                   
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
                                            message.warning("Order canceled!");
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
                                            console.log(msg);
                                            const data = JSON.parse(
                                                msg.nativeEvent.data
                                            );

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
                                                    message.success(
                                                        data.message
                                                    );
                                                    break;
                                                case "error":
                                                    setIsModalVisible(false);
                                                    message.error(data.message);
                                                case "canceled":
                                                    message.warning(
                                                        data.message
                                                    );
                                                    break;
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
                </ScrollView>
                 <View style={{position: "absolute", bottom: 0, flex: 1, width: "100%"}}>
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
                    </View>
            </View>
            ) : (
                <Text.P>Loading...</Text.P>
            )}
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
export default Party;
