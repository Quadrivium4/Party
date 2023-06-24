import { StyleSheet, Text, View, Pressable, Button, TextInput} from 'react-native';
import {NavigationContainer, Link, useNavigation} from "@react-navigation/native";
import { useAuth, useAuthDispatch } from '../context/AuthContext';
import { useState } from 'react';
const Login = () =>{
  const dispatch = useAuthDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {login} = useAuth();
  const handleLogin = async() =>{
      const user = await login(email, password);
  }
  return (
  <View>
    <TextInput onChangeText={setEmail} placeholder='Email'></TextInput>
    <TextInput onChangeText={setPassword} placeholder='Password'></TextInput>
    <Button title="Log in" onPress={handleLogin} />
    <Link to={{screen: "SignUp"}}>sign up</Link>
  </View >)
}
export default Login
