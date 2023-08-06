import { StyleSheet,View, Pressable, Image, Modal} from 'react-native';
import {NavigationContainer, Link, useNavigation} from "@react-navigation/native";
import {useState, useEffect} from "react";
import { useAuth, useAuthDispatch } from '../context/AuthContext';
import Text from './Text';
import { useTheme } from '../context/ThemeContext';
import WebView from 'react-native-webview';
import { baseUrl } from '../constants';
import * as Google from "expo-auth-session/providers/google";

const Button = ({onPress = ()=>{}, children, disabled = false}) =>{
    console.log(disabled)
    const [opacity , setOpacity]= useState(disabled? 0.5: 1);
    useEffect(()=>{
        setOpacity(disabled? 0.5: 1)
    },[disabled])
    const theme = useTheme()
    const initialStyles = {
        backgroundColor: theme.primary,
        alignItems: "center",
        justifyContent: "center",
        padding: 5,
        color: "white"
    };
    const handlePress = () =>{
        setOpacity(0.75)
        setTimeout(()=>{
            setOpacity(1)
        },100)
        onPress();
    }
    return (
        <Pressable onPress={handlePress} style={{...initialStyles, opacity}} disabled={disabled} >
            <Text.P style={{color: initialStyles.color,  textTransform: 'uppercase', fontWeight: "400"}}>{children}</Text.P>
        </Pressable>
    )
    }
Button.Google = ({ onPress = () => {}, children, disabled = false }) => {
    console.log(disabled);
    const [opacity, setOpacity] = useState(disabled ? 0.5 : 1);
    const { loginWithGoogle } = useAuth();
    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId:
            "393787719844-185b743u4n9ae2hqb8crlar6n9mskfus.apps.googleusercontent.com",
        androidClientId:
            "393787719844-j28bsa1oskog48bmjc9lgqg1i600b5pa.apps.googleusercontent.com",
        iosClientId:
            "393787719844-55mvcokfl5vj25e8gthkg44h5up3fo8u.apps.googleusercontent.com ",
    });
            
    useEffect(() => {
        //handleSignInWithGoogle();
    }, [response]);
    useEffect(() => {
        setOpacity(disabled ? 0.5 : 1);
    }, [disabled]);
    async function handleSignInWithGoogle() {
        if (response.type === "success") {
            loginWithGoogle(response.authentication.accessToken);
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
        onPress();
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
                <View style={{ display: "inline-block", flexDirection: "row" }}>
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