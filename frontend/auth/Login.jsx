import { StyleSheet, View, Pressable,TextInput} from 'react-native';
import {NavigationContainer, Link, useNavigation} from "@react-navigation/native";
import { useAuth, useAuthDispatch } from '../context/AuthContext';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/Button';
import A from '../components/A';
import Text from '../components/Text';
const Login = () =>{
  const dispatch = useAuthDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {login} = useAuth();
  const theme = useTheme();
  const handleLogin = async() =>{
      const user = await login(email, password);
  }
  return (
  <View>
    <TextInput onChangeText={setEmail} placeholder='Email' placeholderTextColor={theme.medium} style={{...styles.input, color: theme.foreground}}></TextInput>
    <TextInput onChangeText={setPassword} placeholderTextColor={theme.medium} style={{...styles.input, color: theme.foreground}} placeholder='Password'></TextInput>
    <Button onPress={handleLogin}>Submit</Button>
    <Text.P style={{textAlign: "center"}}>- or -</Text.P>
    <A to="SignUp">sign up</A>
  </View >)
}
const styles = StyleSheet.create({
  input: {
    padding: 10
  }
})
export default Login
