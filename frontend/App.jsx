import { StyleSheet, Text, View, Pressable, TouchableWithoutFeedback, LogBox } from 'react-native';
import {NavigationContainer, Link, useNavigation} from "@react-navigation/native";
import {getHeaderTitle} from "@react-navigation/elements";
import { AuthProvider } from './context/AuthContext';
import Navigator from './Navigator';
import { ThemeProvider } from './context/ThemeContext';
import { MessageProvider } from './context/MessageContext';
import Message from './components/Message';
import { StatusBarProvider } from './context/StatusBarContext';
import { TouchProvider } from './context/TouchContext';
import React from 'react';
import ChatRoom from './app/ChatRoom';

LogBox.ignoreAllLogs()

const Header = ({ navigation, route, options, back }) =>{
  const title = getHeaderTitle(options, route.name);

  
  return (
    <View style={{marginTop: 35, justifyContent: "center",  flexDirection: "row"}}>
      {back? <Pressable onPress={navigation.goBack}>
        <Text style={{ fontSize: 30 }}>{"<"}</Text>
      </Pressable> : null }
      <Text style={{fontSize: 22}}>{title}</Text>
    </View>
  )
}
const Sandbox = () =>{
  return (
    <View style={{}}>
      <View style={{
      backgroundColor: "red",
        flex: 1,
        flexShrink: 1,
        flexBasis: 100,
        width: 100,
        height: 100,
    }}>
      <Text>hello</Text>
    </View>
    </View>
    
  )
}
export default function App() {
  return (
      //<Checkout />
      //<Sandbox />
      <React.StrictMode>
          <AuthProvider>
              <ThemeProvider>
                  <MessageProvider>
                      <StatusBarProvider>
                          <TouchProvider>
                              <Message />
                              <Navigator />
                          </TouchProvider>
                      </StatusBarProvider>
                  </MessageProvider>
              </ThemeProvider>
          </AuthProvider>
      </React.StrictMode>
  );
}

