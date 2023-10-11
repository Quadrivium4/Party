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
    FlatList,
    Platform,
} from "react-native";
import {
    NavigationContainer,
    Link,
    useFocusEffect,
    useNavigation,
} from "@react-navigation/native";
import { useState, useEffect, useRef, useCallback, memo} from "react";
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
import { useTheme } from "../context/ThemeContext";
import Bar from "../components/Bar"
import { useStatusBar } from "../context/StatusBarContext";
import Page from "../components/Page";
import Loader from "../components/Loader";
import { useMessage } from "../context/MessageContext";
console.log(Button.Arrow)
const emptyParty = {
    name: "",
    description: "",
    location: "",
    date: Date.now(),
    purchaseDeadline: Date.now(),
    x: 0,
    y: 0,
    price: "",
    capacity: 0,
};
const InnerPage = ({onSubmit, children, style}) =>{
    return (
    <ShiftingView style={style}>
        {children}
    </ShiftingView>)
}
const First = ({onReady, setDisabled, onStatusChange}) => {

    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [coords, setCoords] = useState({})
    const [images, setImages] = useState([]);

    useEffect(() => {
        isCompleted();
    }, [name, location, coords, images]);
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled)  setImages([...images, ...result.assets]);
    };

    const isCompleted = () =>{
        const result = Boolean(images.length > 0 && Object.keys(coords).length > 0 && name.length > 0 && location);
        console.log("-------- IS COMPLETED?  1:  ", result)
        console.log(images, coords, name, location)
        if(result){
            setDisabled(false);
            onReady({images, ...coords, name, location});
        }else{
            onStatusChange(false)
            setDisabled(true);
        }
        
    }
    return (
        
        <InnerPage>
            <View style={{gap: 10}}>
                <View>
                    <Text.H3>Name</Text.H3>
                    <Input.Text onChangeText={setName}></Input.Text>
                </View>

                <View
                    onStartShouldSetResponder={() => true}
                    style={{
                        flex: 1,
                        flexDirection: "row",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {images?.map((image, i) => {
                        console.log(i);
                        return (
                            <Image
                                key={i}
                                source={{ uri: image.uri }}
                                //onLoadStart={()=>(console.log("------START------"))}
                                //onLoadEnd={()=>console.log("---------END------")}
                                style={{ aspectRatio: image.width/image.height, height: 100, width: undefined }}
                            ></Image>
                        );
                    })}
                    <Pressable
                        onPress={pickImage}
                        style={{
                            flex: 1,
                            flexBasis: 100,
                            height: 100,
                            backgroundColor: "rgba(255,255,255,0.2)",
                            alignItems: "center",
                        }}
                    >
                        <ImageBackground
                            source={require("../assets/image-icon.png")}
                            style={{
                                flex: 1,
                                alignItems: "center",
                                justifyContent: "center",
                                aspectRatio: 3 / 3,
                            }}
                        >
                            <Image
                                source={require("../assets/plus-icon.png")}
                                style={{
                                    width: 30,
                                    height: 30,
                                    backgroundColor: "rgba(255,255,255, 0.2)",
                                    borderRadius: 50,
                                    borderColor: "black",
                                    borderWidth: 2,
                                }}
                            ></Image>
                        </ImageBackground>
                    </Pressable>
                </View>
                 <View>
                    <Text.H3>Location</Text.H3>
                    <Input.Maps
                        onChangeText={(location) => {
                            console.log({ location });
                            setLocation(location.name);
                            setCoords(location.coords);
                        }}
                    ></Input.Maps>
                </View>
            </View>
        </InnerPage>
    );
};


const Second =  ({onReady, setDisabled, onStatusChange}) => {
    const [date, setDate] = useState();
    const [purchaseDeadline, setPurchaseDeadline] = useState();
    const [price, setPrice] = useState();

    useEffect(() => {
        isCompleted();
    }, [price, purchaseDeadline, date]);

    const isCompleted = () => {
        const result = Boolean(price &&date && purchaseDeadline && purchaseDeadline?.timestamp < date?.timestamp)
        console.log("------- IS COMPLETED?   2:  ", result);
        if(result)  {
            setDisabled(false);
            onReady({ price, date: date.date.toString(), purchaseDeadline: purchaseDeadline.date.toString()});
        } else {
            onStatusChange(false)
            setDisabled(true);
        }
    };
    return (
        <InnerPage>
            <View style={{ gap: 10 }}>
                <View>
                    <Text.H3>Price</Text.H3>
                    <Input.Number onChangeText={setPrice}></Input.Number>
                </View>
                <View>
                    <Text.H3>Date</Text.H3>
                    <Input.Date onChangeText={setDate}></Input.Date>
                </View>
                 <View>
                    <Text.H3>Purchase Deadline</Text.H3>
                    <Input.Date onChangeText={setPurchaseDeadline}></Input.Date>
                </View>
            </View>
        </InnerPage>
    );
}
const Third = ({ onReady, setDisabled, onStatusChange }) => {
const [capacity, setCapacity] = useState(0);
const [description, setDescription] = useState("");


useEffect(() => {
    isCompleted();
}, [description, capacity]);

const isCompleted = () => {
    const result = Boolean(description.length > 0 && capacity > 0);
    console.log( "---------- IS COMPLETED?  3:    ", result);
    if (description.length > 0 && capacity > 0) {
        setDisabled(false);
        onReady({ description, capacity });
    } else {
        onStatusChange(false)
        setDisabled(true);
    }
};
return (
    <InnerPage>
        <View style={{ gap: 10 }}>
            <View>
                <Text.H3>Capacity</Text.H3>
                <Input.Number onChangeText={setCapacity}></Input.Number>
            </View>
            <View>
                <Text.H3>Description</Text.H3>
                <Input.Textarea onChangeText={setDescription}></Input.Textarea>
            </View>
        </View>
    </InnerPage>
);
};

const pages = [First, Second, Third];
    

const CreateParty = ({navigation}) =>{
    const [index, setIndex] = useState(0)
    const [party, setParty] = useState(emptyParty);
    const [disabled, setDisabled] = useState(false);
    const carusel = useRef();
    const [pagesStatus, setPagesStatus] = useState(pages.map(()=>false));
    const [status, setStatus] = useState();
    const {message} = useMessage();
    const {setBar} = useStatusBar();
    useFocusEffect(
        useCallback(()=>{
            console.log("disabling.....")
            setBar(index, pages.length);
            scroll(index);
            if(pagesStatus[index]) setDisabled(false)
            else setDisabled(true)
            return ()=> {
                setBar(-1, 1);
                console.log("unmounted")
                
            }
    },[index]))

    const handlePressNext = () => {
        console.log("pressed");
        if (index < pages.length - 1) {
            setIndex(index + 1);
        } else {
            setStatus("loading");
            console.log(party);
            let form = new FormData();
            for(const [key, value] of Object.entries(party)){
                if(key== "images") {
                    party.images.forEach(image=>{
                        form.append("images", {
                            name: image.fileName,
                            type: image.type,
                            uri:
                                Platform.OS === "ios"
                                    ? image.uri.replace("file://", "")
                                    : image.uri,
                        });
                        form.append(
                            "imagesAspectRatio",
                            image.width / image.height
                        );
                    })
                    
                }else{
                    form.append(key, value);
                }
                
            }

            postParty(form).then(res=>{
                message.success("Party created succesfully!");
                navigation.navigate("MyParties", {reload: true})
            }).catch(err=>{
                message.error("Something went wrong: " + err.message);
            })
        }
    };
    const handlePressBack = () => {
        console.log("pressed");
        if (index > 0) {
            setIndex(index - 1);
        } else {
            navigation.navigate("MyParties")
            //postParty(form);
        }
    };
    const onPageSubmit = (values, index) =>{
         let currentPagesStatus = pagesStatus;
         currentPagesStatus[index] = true;
         setPagesStatus(currentPagesStatus);
        setParty({...party, ...values})
    }
    const onStatusChange = (status, index) =>{
        let currentPagesStatus = pagesStatus;
        currentPagesStatus[index] = status;
        setPagesStatus(currentPagesStatus)
    }
    const scroll = (i) =>{
        carusel.current.scrollToIndex({index: i})
    }
   
    return (
        <>
            <Loader visible={status == "loading"}></Loader>
            <Page>
                <FlatList
                    scrollEnabled={false}
                    ref={carusel}
                    horizontal={true}
                    //keyExtractor={(item) => Math.random()}
                    getItemLayout={(data, index) => {
                        return {
                            length: Dimensions.get("window").width,
                            offset: Dimensions.get("window").width * index,
                            index,
                        };
                    }}
                    renderItem={({ item, index }) => {
                        const Page = item;
                        return (
                            <View
                                style={{
                                    width: Dimensions.get("window").width,
                                }}
                            >
                                <Page
                                    setDisabled={setDisabled}
                                    onReady={(values) =>
                                        onPageSubmit(values, index)
                                    }
                                    onStatusChange={(status) =>
                                        onStatusChange(status, index)
                                    }
                                ></Page>
                            </View>
                        );
                    }}
                    data={pages}
                ></FlatList>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Button.Arrow onPress={handlePressBack}>
                        {index < 1 ? "Cancel" : "Back"}
                    </Button.Arrow>
                    <Button.Arrow
                        disabled={disabled}
                        onPress={handlePressNext}
                        arrow="right"
                    >
                        {index < pages.length - 1 ? "Next" : "Finish"}
                    </Button.Arrow>
                </View>
            </Page>
        </>
    );
}
const Party = ({ route }) => {
    const { logout, user } = useAuth();
    const dispatch = useAuthDispatch();
    const [onboardingLink, setOnbardingLink] = useState();
    console.log(route);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        setLoading(true);
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            aspect: [4, 3],
            quality: 1,
        });
        
        console.log(result);

        if (!result.canceled) {
            //console.log(result)
            console.log("setting...")
            
            setImages([...images, ...result.assets]);
            
        }
    };
    useEffect(()=>{
        console.log("setted!");
        setLoading(false)
    },[images])
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

                        mode="datetime"
                        onChangeText={(event) => {
                            console.log(event);
                            setParty({ ...party, purchaseDeadline: event.timestamp });
                        }}
                        value={new Date(party.purchaseDeadline)}
                        
                    ></Input.Date>
                    
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
export default CreateParty;
