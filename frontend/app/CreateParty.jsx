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
} from "react-native";
import {
    NavigationContainer,
    Link,
    useNavigation,
} from "@react-navigation/native";
import { useState, useEffect } from "react";
import { useAuth, useAuthDispatch } from "../context/AuthContext";
import Text from "../components/Text";
import Button from "../components/Button";
import Input from "../components/Input";
import ShiftingView from "../components/ShiftingView";
import Icon from "react-native-vector-icons/"
import { postParty } from "../controllers/party";
import { getOnboardingLink } from "../controllers/payment";
import * as ImagePicker from "expo-image-picker";
import { baseUrl } from "../constants";

const Party = ({ route }) => {
    const { logout, user } = useAuth();
    const dispatch = useAuthDispatch();
    const [onboardingLink, setOnbardingLink] = useState();
    console.log(route);
    const [images, setImages] = useState([]);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            console.log(result)
            setImages([...images, result.assets[0]]);
        }
    };
    useEffect(() => {
        if (route.params?.paypalBusinessId && !user.paypalBusinessId)
            dispatch({
                type: "SET_USER",
                value: {
                    ...user,
                    paypalBusinessId: route.params.paypalBusinessId,
                },
            });
        if (user.paypalBusinessId || onboardingLink) return;
        getOnboardingLink().then((res) => {
            console.log(res);
            setOnbardingLink(res.link);
        });
    });
    const [party, setParty] = useState({
        name: "",
        description: "",
        location: "",
        date: Date.now(),
        purchaseDeadline: Date.now(),
        x: 0, 
        y: 0 ,
        price: "", 
        capacity: 0,
    });
    return (
        <ShiftingView>
            <Text.H1>Hello {user.name}! Create a new party!</Text.H1>
            {user.paypalBusinessId ? (
                <View>
                    <Text.H3>Name</Text.H3>
                    <Input.Text
                        onChangeText={(name) => setParty({ ...party, name })}
                    ></Input.Text>
                    <Text.H3>Location</Text.H3>
                    <Input.Maps
                        onChangeText={(location) => {
                            console.log(location);
                            setParty({
                                ...party,
                                location: location.name,
                                x: location.coords.x,
                                y: location.coords.y,
                            });
                        }}
                    ></Input.Maps>
                    <Text.H3>Description</Text.H3>
                    <Input.Textarea
                        onChangeText={(description) =>
                            setParty({ ...party, description })
                        }
                    ></Input.Textarea>
                    <Text.H3>Price</Text.H3>
                    <Input.Number
                        onChangeText={(price) => setParty({ ...party, price })}
                        placeholder="€"
                    ></Input.Number>
                    <Text.H3>Capacity</Text.H3>
                    <Input.Number
                        onChangeText={(capacity) =>
                            setParty({ ...party, capacity })
                        }
                        placeholder="e.g"
                    ></Input.Number>
                    <Text.H3>Date</Text.H3>
                    <Input.Date
                        onChangeText={(event) => {
                            console.log(event);
                            setParty({ ...party, date: event.timestamp });
                        }}
                        value={new Date(party.date)}
                    ></Input.Date>
                    <Text.H3>Purchase Deadline</Text.H3>
                    <Input.Date
                        onChangeText={(event) => {
                            console.log(event);
                            setParty({ ...party, purchaseDeadline: event.timestamp });
                        }}
                        value={new Date(party.purchaseDeadline)}
                    ></Input.Date>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            flexWrap: "wrap",
                        }}
                    >
                        {images.length > 0
                            ? images.map((image, i) => {
                                  console.log(i);
                                  return (
                                      <Image
                                          key={i}
                                          source={{ uri: image.uri }}
                                          style={{ width: 100, height: 100 }}
                                      ></Image>
                                  );
                              })
                            : null}
                        <Pressable onPress={pickImage}>
                            <ImageBackground
                                source={require("../assets/image-icon.png")}
                                style={{
                                    width: 100,
                                    height: 100,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Image
                                    source={require("../assets/plus-icon.png")}
                                    style={{
                                        width: 30,
                                        height: 30,
                                        backgroundColor:
                                            "rgba(255,255,255, 0.2)",
                                        borderRadius: 50,
                                        borderColor: "black",
                                        borderWidth: 2,
                                    }}
                                ></Image>
                            </ImageBackground>
                        </Pressable>
                    </View>

                    <Button
                        onPress={() => {
                            console.log(party);
                            Keyboard.dismiss();
                            const form = new FormData();
                            images.forEach((image, i) => {
                                form.append("file" + i, {
                                    name: "file" + i,
                                    uri: image.uri,
                                });
                            });
                            for (const [key, value] of Object.entries(party)) {
                                form.append(key, value);
                            }
                            console.log(form);
                            /*fetch(baseUrl+ "/upload", {
                                method: "POST",
                                body: form
                            })*/
                            postParty(form);
                        }}
                    >
                        create
                    </Button>
                </View>
            ) : (
                <Button
                    onPress={() => Linking.openURL(onboardingLink)}
                    disabled={!onboardingLink}
                >
                    {onboardingLink ? "onboard" : "loading..."}
                </Button>
            )}
        </ShiftingView>
    );
};
export default Party;
