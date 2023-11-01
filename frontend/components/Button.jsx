import { StyleSheet,View, Pressable, Image, Modal} from 'react-native';
import {NavigationContainer, Link, useNavigation} from "@react-navigation/native";
import {useState, useEffect} from "react";
import { useAuth, useAuthDispatch } from '../context/AuthContext';
import Text from './Text';
import { useTheme } from '../context/ThemeContext';
import WebView from 'react-native-webview';
import { baseUrl } from '../constants';
import * as Google from "expo-auth-session/providers/google";
import Icon from "react-native-vector-icons/AntDesign"

const Button = ({onPress = ()=>{}, children, type="default", disabled = false, style = {}}) =>{
    //console.log(disabled)
    const [timeoutOpacity,setTimeoutOpacity ] = useState();
    const [opacity , setOpacity]= useState(disabled? 0.5: 1);
    useEffect(()=>{
        //console.log("inside button", {disabled})
        let currentOpacity = disabled ? 0.5 : 1;
        //console.log({currentOpacity, opacity, timeoutOpacity})
        if(timeoutOpacity) clearTimeout(timeoutOpacity);
        
        setOpacity(currentOpacity)
    },[disabled])
    const theme = useTheme()
    const defaultStyles = {
        backgroundColor: theme.primary,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        padding: 5,
        
        color: "white",
    };
    const outlineStyles = {
        borderColor: theme.light ,
        backgroundColor: theme.transparent.light,
        borderWidth: 1,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        padding: 5,
        color: theme.primary,
    };
    const initialStyles = type == "outline"? outlineStyles : defaultStyles
    const handlePress = () =>{
        let previousOpacity = opacity;
        setOpacity(0.75)
        
        let timeout = setTimeout(()=>{
            //console.log("inside timout" , {disabled})
            setOpacity(previousOpacity)
        },100)
        setTimeoutOpacity(timeout)
        //console.log("outside timout", { disabled });
        onPress();
    }
    return (
        <Pressable onPress={handlePress} style={{...initialStyles, opacity, ...style}} disabled={disabled} >
            <Text.P style={{color: initialStyles.color,  textTransform: 'uppercase', fontWeight: "400"}}>{children}</Text.P>
        </Pressable>
    )
    }
Button.Arrow = ({ onPress = () => {}, children, disabled = false, arrow = "left" }) => {
    //console.log(disabled)
    const [timeoutOpacity, setTimeoutOpacity] = useState();
    const [opacity, setOpacity] = useState(disabled ? 0.5 : 1);
    useEffect(() => {
       console.log("inside button", { disabled });
        let currentOpacity = disabled ? 0.5 : 1;
        //console.log({ currentOpacity, opacity, timeoutOpacity });
        if (timeoutOpacity) clearTimeout(timeoutOpacity);

        setOpacity(currentOpacity);
    }, [disabled]);
    const theme = useTheme();
    const initialStyles = {

        alignItems: "center",
        justifyContent: "center",
        padding: 5,
        color: theme.primary,
    };
    const handlePress = () => {
        let previousOpacity = opacity;
        setOpacity(0.75);

        let timeout = setTimeout(() => {
            console.log("inside timout", { disabled });
            setOpacity(previousOpacity);
        }, 100);
        setTimeoutOpacity(timeout);
        console.log("outside timout", { disabled });
        onPress();
    };
    return (
        <Pressable
            onPress={handlePress}
            style={{ ...initialStyles, opacity }}
            disabled={disabled}
        >
            <View style={{ flexDirection: arrow === "right"? "row-reverse" : "row", alignItems: "center", justifyContent:"center" }}>
                <Icon name={arrow} size={15} color={theme.primary} />
                <Text.P
                    style={{
                        color: initialStyles.color,
                        textTransform: "uppercase",
                        fontWeight: "400",
                    }}
                >
                    {children}
                </Text.P>
            </View>
        </Pressable>
    );
};
Button.Google = ({ onSelectedUserAccount = async(token) =>{}, children, disabled = false }) => {
    //console.log(disabled);
    const [opacity, setOpacity] = useState(disabled ? 0.5 : 1);

    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId:
            "393787719844-185b743u4n9ae2hqb8crlar6n9mskfus.apps.googleusercontent.com",
        androidClientId:
            "393787719844-j28bsa1oskog48bmjc9lgqg1i600b5pa.apps.googleusercontent.com",
        iosClientId:
            "393787719844-55mvcokfl5vj25e8gthkg44h5up3fo8u.apps.googleusercontent.com ",
    });
            
    useEffect(() => {
            handleSignInWithGoogle().catch(err=>
                console.log(err))
        
    }, [response]);
    useEffect(() => {
        setOpacity(disabled ? 0.5 : 1);
    }, [disabled]);
    async function handleSignInWithGoogle() {
        if (response.type === "success") {
            onSelectedUserAccount(response.authentication.accessToken);
        }
    }


    const initialStyles = {
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
        padding: 5,
        color: "black",
    };
   const handlePress = () => {
        setOpacity(0.75);
        setTimeout(() => {
            setOpacity(1);
        }, 100);
    };
    return (
        <>
            <Pressable
                onPress={()=>{
                    handlePress();
                    promptAsync();
                }
                }
                style={{ ...initialStyles, opacity }}
                disabled={disabled}
            >
                <View style={{  flexDirection: "row" }}>
                    <Image
                        source={require("../assets/google-logo.png")}
                        style={{ width: 20, height: 20, marginRight: 10 }}
                    ></Image>
                    <Text.P
                        style={{
                            color: initialStyles.color,
                            fontWeight: "400",
                        }}
                    >
                        {children}
                    </Text.P>
                </View>
            </Pressable>
        </>
    );
};
export default Button