import { StyleSheet, View, Pressable,TextInput} from 'react-native';
import {NavigationContainer, Link, useNavigation} from "@react-navigation/native";
import { useAuth, useAuthDispatch } from '../context/AuthContext';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/Button';
import {A} from '../components/A';
import Text from '../components/Text';
import Input from '../components/Input';
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
          <Input.Text onChangeText={setEmail} placeholder="Email"></Input.Text>
          <Input.Text onChangeText={setPassword} placeholder="Password"></Input.Text>
          <Button onPress={handleLogin}>Submit</Button>
          <Text.P style={{ textAlign: "center" }}>- or -</Text.P>
          <Button.Google>Log In with Google</Button.Google>
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
      </View>
  );
}
const styles = StyleSheet.create({
  input: {
    padding: 10
  }
})
export default Login
