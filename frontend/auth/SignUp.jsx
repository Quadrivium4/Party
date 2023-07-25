import { StyleSheet,  View, Pressable, TextInput} from 'react-native';
import { useAuthDispatch, useAuth } from '../context/AuthContext';
import {NavigationContainer, Link, useNavigation} from "@react-navigation/native";
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/Button';
import A from '../components/A';
import Text from '../components/Text';

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
  <View>
    <TextInput onChangeText={setName} placeholder='Name' placeholderTextColor={theme.medium} style={{...styles.input, color: theme.foreground}}></TextInput>
    <TextInput onChangeText={setEmail} placeholder='Email' placeholderTextColor={theme.medium} style={{...styles.input, color: theme.foreground}}></TextInput>
    <TextInput onChangeText={setPassword} placeholder='Password' placeholderTextColor={theme.medium} style={{...styles.input, color: theme.foreground}}></TextInput>
    <Button onPress={handleRegister} >Submit</Button>
    <Text.P style={{textAlign: "center"}}>- or -</Text.P>
    <A to="Login">log in</A>
  </View >)
}
const styles = StyleSheet.create({
  input: {
    padding: 10
  }
})
export default SignUp
