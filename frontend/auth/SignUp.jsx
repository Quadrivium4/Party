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
            <TextInput
                onChangeText={setName}
                placeholder="Name"
                placeholderTextColor={theme.medium}
                style={{ ...styles.input, color: theme.foreground }}
            ></TextInput>
            <TextInput
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor={theme.medium}
                style={{ ...styles.input, color: theme.foreground }}
            ></TextInput>
            <TextInput
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor={theme.medium}
                style={{ ...styles.input, color: theme.foreground }}
            ></TextInput>
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
                    flex: 10,
                    flexDirection: "row",
                    flexGrow: 1,
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
