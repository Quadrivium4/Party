
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Login from './auth/Login';
import SignUp from './auth/SignUp';
import Verify from "./auth/Verify";
import { useTheme } from "./context/ThemeContext";

const AuthStack = createNativeStackNavigator();
const AuthNavigator = () =>{
    const theme = useTheme()
    console.log(theme)
    return (
        <AuthStack.Navigator screenOptions={({route})=>({
            headerStyle: {
                backgroundColor: theme.strong,
                borderBottomWidth: 1,
                borderBottomColor: theme.medium,
                shadowColor: 'transparent', // this covers iOS
                elevation: 0
            },
            headerTitleStyle: {
                color: theme.foreground
            },
            headerTintColor: theme.foreground,
            contentStyle: theme.background
            })}>
            <AuthStack.Screen name='Login' component={Login} />
            <AuthStack.Screen name='SignUp' component={SignUp} />
            <AuthStack.Screen name='Verify' component={Verify} />
        </AuthStack.Navigator>
    )
}
export default AuthNavigator