import { StyleSheet, Text, View, Pressable, TextInput, Button} from 'react-native';
import { useAuthDispatch, useAuth } from '../context/AuthContext';
import {NavigationContainer, Link, useNavigation} from "@react-navigation/native";
import { useState } from 'react';

const SignUp = () =>{
  const dispatch = useAuthDispatch();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const {register} = useAuth();
  const handleRegister= async() =>{
      const user = await register(name, email, password);
  }
  return (
  <View>
    <TextInput onChangeText={setName} placeholder='Name'></TextInput>
    <TextInput onChangeText={setEmail} placeholder='Email'></TextInput>
    <TextInput onChangeText={setPassword} placeholder='Password'></TextInput>
    <Button title="Log in" onPress={handleRegister} />
    <Link to={{screen: "Login"}}>Login</Link>
  </View >)
}
export default SignUp
