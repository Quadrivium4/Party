import { StyleSheet, View, Pressable,TextInput, Keyboard} from 'react-native';
import {NavigationContainer, Link, useNavigation} from "@react-navigation/native";
import { useAuth } from '../context/AuthContext';
import { useEffect, useReducer, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/Button';
import {A} from '../components/A';
import Text from '../components/Text';
import Input from '../components/Input';
import { useMessage } from '../context/MessageContext';
import Loader from '../components/Loader';
import Page from '../components/Page';
import { useKeyboardDismiss } from '../context/TouchContext';

const ERROR_CODES = {
    INVALID_CREDENTIALS: 1001,
    INVALID_EMAIL: 1002,
    INVALID_PASSWORD: 1003
}
const Login = () =>{
    const [form, setForm] = useState({
        email: "",
        password: ""
    })
    const {login, loginWithGoogle} = useAuth();
    const {message} = useMessage();
    const [loading, setLoading] = useState(false);
    const theme = useTheme();
    const [errorCode, setErrorCode]= useState<number | null>(null)
    const emailError = (errorCode === ERROR_CODES.INVALID_EMAIL || errorCode === ERROR_CODES.INVALID_CREDENTIALS);
    const passwordError =
        errorCode === ERROR_CODES.INVALID_PASSWORD ||
        errorCode === ERROR_CODES.INVALID_CREDENTIALS;
    console.log(errorCode, ERROR_CODES.INVALID_CREDENTIALS)
    console.log({emailError, passwordError})
    useKeyboardDismiss()
    const handleChange = (name: string, value: string) =>{
        setForm({...form, [name]: value})
        setErrorCode(null)
    }
    //const [state, dispatch] =useReducer()
    const handleLogin = async() =>{
        Keyboard.dismiss()
        console.log(form)
        setLoading(true);
        try {
            await login(form)
        } catch (err: any) {
            if(err)
            console.log("error in login", err)
            setErrorCode(err.errorCode)
            message.error(err.message);
        }
         setLoading(false);
    }
    const handleGoogleLogin = async(token: string) =>{
        setLoading(true)
        try {
            await loginWithGoogle(token);
        } catch (error) {
            
        }
        
        setLoading(false)
    }
    return (
        <Page>
            <Loader fullscreen={true} visible={loading} />
            <Input.Text
                onChangeText={(text) =>handleChange("email", text )}
                placeholder="Email"
                error={emailError}
            ></Input.Text>
            <Input.Text
                onChangeText={(text) =>handleChange("password", text )}
                placeholder="Password"
                error={passwordError}
            ></Input.Text>
            <Button onPress={handleLogin} style={{ marginTop: 10 }}>
                Submit
            </Button>
            <Text.P style={{ textAlign: "center" }}>- or -</Text.P>
            <Button.Google onSelectedUserAccount={handleGoogleLogin}>Log In with Google</Button.Google>
            <View
                style={{
                    marginTop: 8,
                    flexDirection: "row",
                    justifyContent: "center",
                }}
            >
                <Text.P
                    style={{
                        textAlign: "center",
                    }}
                >
                    Don't have an account?
                </Text.P>
                <A to={"SignUp"} style={{ marginLeft: 5 }}>
                    Sign up
                </A>
            </View>
        </Page>
    );
}
const styles = StyleSheet.create({
  input: {
    padding: 10
  }
})
export default Login
