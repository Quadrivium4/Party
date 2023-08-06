import { createContext, useContext, useEffect, useReducer } from "react";
import { crossing, protectedCrossing } from "../utils";
import { baseUrl, protectedUrl } from "../constants";
import * as SecureStore from 'expo-secure-store';
import { signInWithGoogle } from "../controllers/auth";

const AuthContext = createContext(null);
const AuthDispatchContext = createContext(null);
const authState = {
    logged: false,
    loading: true,
    token: null,
    user: null
}
const authReducer = (state, action) =>{
    console.log("dispatching...", action)
    switch (action.type) {
         case "SET_LOADING":
            return {...state, loading: action.value}
        case "SET_LOGGED":
            return {...state, logged: action.value}
        case "SET_TOKEN":
            return {...state, token: action.value}
        case "SET_USER":
            return {...state, user: action.value}
        default:
            console.log("ERROR: unknown action type: ", action.type)
            break;
    }
}
const AuthProvider = ({children}) =>{
    const [state, dispatch] = useReducer(authReducer, authState);
    useEffect(()=>{
        if(!state.logged){
            const isLogged = async() =>{
                
                const token= await SecureStore.getItemAsync("aToken");
                if(!token) return console.log("not logged", token);
                const user = await protectedCrossing(`${protectedUrl}/user`, "GET");
                if(!user) return;
                await dispatch({type: "SET_USER", value: user})
                dispatch({ type: "SET_TOKEN", value: token })
                dispatch({ type: "SET_LOGGED", value: true })
                
                console.log("is logged", token)
                
            }
            isLogged().then(()=> dispatch({ type: "SET_LOADING", value: false})).catch(err=>{
                console.log("error catched", err)
                dispatch({ type: "SET_LOADING", value: false });
            })
        }
        
        
    },[])
    const login = async(email, password) =>{
        const {user, aToken} = await crossing(`${baseUrl}/login`, "POST", {email, password});
        console.log({user, aToken});
        SecureStore.setItemAsync("aToken", aToken);
        //SecureStore.setItemAsync("aToken", aToken);
        dispatch({ type: "SET_TOKEN", value: aToken })
        await dispatch({type: "SET_USER", value: user})
        dispatch({ type: "SET_LOGGED", value: true })
        return {user, aToken}
    }
    const loginWithGoogle = async(accessToken) =>{
        const {user, aToken} = await signInWithGoogle(accessToken);
        console.log({ user, aToken });
        SecureStore.setItemAsync("aToken", aToken);
        //SecureStore.setItemAsync("aToken", aToken);
        dispatch({ type: "SET_TOKEN", value: aToken });
        await dispatch({ type: "SET_USER", value: user });
        dispatch({ type: "SET_LOGGED", value: true });
        return { user, aToken };
    }
    const register = async(name, email, password) =>{
        const {user} = await crossing(`${baseUrl}/register`, "POST", {name, email, password});
        console.log("successfully registered", user);
        return user
        //SecureStore.setItemAsync("aToken", aToken);
    }
    const logout = async() =>{
        console.log({state})
        await protectedCrossing(`${protectedUrl}/logout`, "GET");
        console.log("log out")
        SecureStore.deleteItemAsync("aToken");
        dispatch({ type: "SET_TOKEN", value: "" });
        dispatch({ type: "SET_LOGGED", value: false });
    }
    const verify = async(id, token) =>{
        const {user, aToken} = await crossing(`${baseUrl}/verify`, "POST", {token, id});
        console.log({user, aToken})
        SecureStore.setItemAsync("aToken", aToken);
        dispatch({ type: "SET_TOKEN", value: aToken })
        dispatch({type: "SET_USER", value: user})
        dispatch({ type: "SET_LOGGED", value: true })
    }
    const deleteAccount = async() =>{
        await crossing(`${protectedUrl}/user`, "DELETE");
        console.log("User delted succesfully");
        SecureStore.deleteItemAsync("aToken");
        dispatch({ type: "SET_TOKEN", value: "" });
        dispatch({ type: "SET_LOGGED", value: false });
    }
    return (
        <AuthContext.Provider value={{...state, login, register, logout, verify, deleteAccount, loginWithGoogle}}>
            <AuthDispatchContext.Provider value={dispatch}>
                {children}
            </AuthDispatchContext.Provider>
        </AuthContext.Provider>
    )
}
const useAuth = () =>{
    return useContext(AuthContext);
}
const useAuthDispatch = () =>{
    return useContext(AuthDispatchContext);
}
export {
    AuthProvider,
    useAuth,
    useAuthDispatch
}