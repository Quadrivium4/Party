
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Login from './auth/Login';
import SignUp from './auth/SignUp';
import Verify from "./auth/Verify";
import { useTheme } from "./context/ThemeContext";
import Header from "./components/Header";

const AuthStack = createNativeStackNavigator();
const AuthNavigator = () =>{
    const theme = useTheme()
    //console.log(theme)
    return (
        <AuthStack.Navigator
            screenOptions={({ route }) => ({
                header: (props) => <Header {...props} />,
                contentStyle: {
                    backgroundColor: theme.strong,
                },
            })}
        >
            <AuthStack.Screen name="SignUp" component={SignUp} />
            <AuthStack.Screen name="Login" component={Login} />

            <AuthStack.Screen name="Verify" component={Verify} />
        </AuthStack.Navigator>
    );
}
export default AuthNavigator