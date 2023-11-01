import { createContext, useContext, useEffect, useReducer, ReactNode, Reducer, ReducerWithoutAction } from "react";
import { crossing, protectedCrossing } from "../utils";
import { baseUrl, protectedUrl } from "../constants";
import * as SecureStore from 'expo-secure-store';
import { signInWithGoogle } from "../controllers/auth";

const AuthContext = createContext<ContextProps>(null);
const AuthDispatchContext = createContext(null);
type TAuthStateProps = {
    logged: boolean,
    loading: boolean,
    aToken: string | null,
    user: object | null
}
type TLoginForm = {
    email: string, 
    password: string
}
export type TRegisterForm = {
    name: string,
    email: string, 
    password: string,
}
export type TVerifyProps = {
    id: string,
    token: string
}
type ContextProps = TAuthStateProps & {
    login: (form: TLoginForm) =>Promise<void>, 
    register: (form: TRegisterForm) => Promise<void>,
    logout: () =>{}, 
    verify: (credentials: TVerifyProps) =>{}, 
    deleteAccount: () =>{}, 
    loginWithGoogle: (accessToken: string) => Promise<void>
} | null
type TActionProps = {
    type: "LOGIN" | "LOGGED_OUT" | "TOGGLE_LOADING" | "SET_LOADING", 
    payload?: any
}
const authState: TAuthStateProps = {
    logged: false,
    loading: true,
    aToken: null,
    user: null
}
const authReducer: Reducer<TAuthStateProps, TActionProps> =  (state, action) =>{
    console.log("dispatching...", action)
    switch (action.type) {
        case "LOGIN": 
            return  {...state, loading: false, logged: true, token: action.payload.aToken, user: action.payload.user}!
        case "LOGGED_OUT": 
            return {...authState, loading: false}
        case "TOGGLE_LOADING": 
            return {...state, loading: !state.loading}
        case "SET_LOADING":
            return {...state, loading: action.payload}
        default:
            return state
    }
    
}
const AuthProvider = ({children } : {children: ReactNode}) =>{
    const [state, dispatch] = useReducer(authReducer, authState)
    useEffect(()=>{
        //if(!state.logged && state.loading){
                isLogged()

        
        //}
        
        
    },[])
    const isLogged = async () => {
        const aToken =  await SecureStore.getItemAsync("aToken");
        if (!aToken) return dispatch({ type: "LOGGED_OUT" });
        try {
             const user = await protectedCrossing(
                `${protectedUrl}/user`,
                "GET"
            );
        console.log({user})
        if (!user) return dispatch({ type: "LOGGED_OUT" });
        //dispatch({type: "LOGGED_OUT"})
        dispatch({ type: "LOGIN", payload: { aToken, user } });
        } catch (error) {
            return dispatch({ type: "LOGGED_OUT" });
        }
        
    };
    const login = async({email, password}: TLoginForm) =>{
        try {
            const { user, aToken } = await crossing(
                `${baseUrl}/login`,
                "POST",
                { email, password }
            );
            console.log({ user, aToken });
            SecureStore.setItemAsync("aToken", aToken);
            dispatch({ type: "LOGIN", payload: { aToken, user } });
        } catch (err) {
            throw err
        }
    }
    const loginWithGoogle = async(accessToken: string) =>{
        const {user, aToken} = await signInWithGoogle(accessToken);
        console.log({ user, aToken });
        SecureStore.setItemAsync("aToken", aToken);
        dispatch({ type: "LOGIN", payload: { aToken, user } });
        //return { user, aToken };
    }
    const register = async({name, email, password}: TRegisterForm) =>{
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
        dispatch({type: "LOGGED_OUT"})
    }
    const verify = async({id, token}: TVerifyProps) =>{
        const {user, aToken} = await crossing(`${baseUrl}/verify`, "POST", {token, id});
        console.log({user, aToken})
        SecureStore.setItemAsync("aToken", aToken);
        dispatch({type: "LOGIN", payload: {aToken, user}})
    }
    const deleteAccount = async() =>{
        await crossing(`${protectedUrl}/user`, "DELETE");
        console.log("User delted succesfully");
        SecureStore.deleteItemAsync("aToken");
        dispatch({type: "LOGGED_OUT"});
    }
    return (
        <AuthContext.Provider value={{...state, login, register, logout, verify, deleteAccount, loginWithGoogle}}>
                {children}
        </AuthContext.Provider>
    )
}
const useAuth = () =>{
    const authContext = useContext<ContextProps>(AuthContext);
    if(!authContext) throw new Error("useAuth shoud be used inside AuthContext!")
    return authContext
}
export {
    AuthProvider,
    useAuth
}