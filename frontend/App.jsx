import { StyleSheet, Text, View, Pressable } from 'react-native';
import {NavigationContainer, Link, useNavigation} from "@react-navigation/native";
import {getHeaderTitle} from "@react-navigation/elements";
import { AuthProvider } from './context/AuthContext';
import Navigator from './Navigator';
import { ThemeProvider } from './context/ThemeContext';


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
export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Navigator />
      </ThemeProvider>
    </AuthProvider>
  );
}

