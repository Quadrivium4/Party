import { StyleSheet,  View, Pressable, TextInput} from 'react-native';
import { useAuthDispatch, useAuth } from '../context/AuthContext';
import {NavigationContainer, Link, useNavigation} from "@react-navigation/native";
import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/Button';
import{ A, AButton} from '../components/A';
import Text from '../components/Text';
import * as Google from "expo-auth-session/providers/google"
import { signInWithGoogle } from '../controllers/auth';
import Input from '../components/Input';

const SignUp = () =>{
    const dispatch = useAuthDispatch();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const {register} = useAuth();
    const theme = useTheme();
    const handleRegister= async() =>{
        const user = await register(name, email, password);
    }

    return (
        <View style={{ flex: 1 }}>
            <Input.Text onChangeText={setName} placeholder="Name"></Input.Text>
            <Input.Text onChangeText={setEmail} placeholder="Email"></Input.Text>
            <Input.Text onChangeText={setPassword} placeholder="Password"></Input.Text>

            <Button onPress={handleRegister}>Submit</Button>
            <Text.P
                style={{
                    textAlign: "center",
                }}
            >
                - or -
            </Text.P>
            <Button.Google>Sign Up with Google</Button.Google>
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
