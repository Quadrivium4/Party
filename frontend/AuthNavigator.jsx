
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Login from './auth/Login';
import SignUp from './auth/SignUp';
import Verify from "./auth/Verify";

const AuthStack = createNativeStackNavigator();
const AuthNavigator = () =>{
    return (
        <AuthStack.Navigator>
            <AuthStack.Screen name='Login' component={Login} />
            <AuthStack.Screen name='SignUp' component={SignUp} />
            <AuthStack.Screen name='Verify' component={Verify} />
        </AuthStack.Navigator>
    )
}
export default AuthNavigator