import { StyleSheet,  View, Pressable, TextInput, Keyboard} from 'react-native';
import {  useAuth, TRegisterForm } from '../context/AuthContext';
import {NavigationContainer, Link, useNavigation} from "@react-navigation/native";
import { useEffect, useState, useReducer, Reducer} from 'react';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/Button';
import{ A, AButton} from '../components/A';
import Text from '../components/Text';
import * as Google from "expo-auth-session/providers/google"
import { signInWithGoogle } from '../controllers/auth';
import Input from '../components/Input';
import Loader from '../components/Loader';
import { validateEmail } from '../utils';
import { useMessage } from '../context/MessageContext';
const checkCredentials = ({name, email, password}: TRegisterForm) =>{
    name = name.trim();
    email = email.trim();
    password = password.trim();
    if(name.length < 1) return {message: "name cannot be empty", field: "name"}
    if(email.length < 1) return {message: "email cannot be empty", field: "email"}
    if(!validateEmail(email)) return {message: "invalid email", field: "email"}
    if(password.length < 1) return {message: "password cannot be empty", field: "password"}
    if(password.length < 5) return {message: "password must be more than 5 characters long", field: "password"}
    if(password.length > 30) return {message: "password too long, it must be less than 30 character long", field: "password"}
}

type TReducerFormState = {
    fields: TRegisterForm,
    errors: {
        name: boolean,
        email: boolean,
        password: boolean
    }
}
type TReducerActions = {
    type: "error" | "updateField",
    payload: any
}
const initialFormState: TReducerFormState ={
    fields: {
        name: "",
        email: "",
        password: ""
    },
    errors: {
        name: false,
        email: false,
        password: false
    }
}
const reducer:Reducer<TReducerFormState, TReducerActions> = (state, action) =>{
    switch(action.type) {
        case "updateField": {
            return {fields: {...state.fields, [action.payload.field]: action.payload.value}, errors: {...state.errors, [action.payload.field]: false}}
        }
        case "error": 
            return {...state, errors: {...state.errors, [action.payload.field]: true }}
        default: 
            return state
    }
}
const SignUp = () =>{
    const [form, dispatch] = useReducer(reducer, initialFormState)
    const {register, loginWithGoogle} = useAuth();
    const {message} = useMessage()
    const [loading, setLoading] = useState(false);
    const theme = useTheme();
    const handleRegister= async() =>{
        Keyboard.dismiss()
        console.log(form.fields)
        const error = checkCredentials(form.fields);
        console.log({error})
        if(error) {
            message.error(error.message)
            return dispatch({type: "error", payload: {field: error.field }})
        } 
        setLoading(true)
        try {
             const user = await register(form.fields);
        } catch (error: any) {
            message.error(error.message)
            console.log(error)
        }
       
        setLoading(false)
    }
    const handleGoogleRegister = async(token: string) =>{
        setLoading(true)
        try {
            await loginWithGoogle(token);
        } catch (error) {
            
        }
        
        setLoading(false)
    }
    const handleInput = (name: string, value: string) =>{
        dispatch({type: "updateField", payload: {field: name, value}})
    }
    return (
        <View style={{ flex: 1 }}>
            <Loader fullscreen={true} visible={loading} />
            <Input.Text onChangeText={(text) =>handleInput("name", text)} placeholder="Name" error={form.errors.name}></Input.Text>
            <Input.Text onChangeText={(text) =>handleInput("email", text)} placeholder="Email" error={form.errors.email}></Input.Text>
            <Input.Text onChangeText={(text) =>handleInput("password", text)} placeholder="Password" error={form.errors.password}></Input.Text> 

            <Button onPress={handleRegister}>Submit</Button>
            <Text.P
                style={{
                    textAlign: "center",
                }}
            >
                - or -
            </Text.P>
            <Button.Google onSelectedUserAccount={handleGoogleRegister}>Sign Up with Google</Button.Google>
            <View
                style={{
                    marginTop: 8,
                    flexDirection: "row",
                    justifyContent: "center"
                }}
            >
                <Text.P
                    style={{
                        textAlign: "center",
                    }}
                >
                    Already have an account?{" "}
                </Text.P>
                <A to={"Login"} style={{ marginLeft: 5 }}>
                    Log in
                </A>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
  input: {
    padding: 10
  }
})
export default SignUp
