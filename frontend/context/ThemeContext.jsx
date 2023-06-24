import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { crossing, protectedCrossing } from "../utils";
import * as SecureStore from 'expo-secure-store';

const ThemeContext = createContext(null);
const ThemeDispatchContext = createContext(null);
const theme = {
    dark: {
        background: "rgb(40,40,40)",
        foreground: "rgb(220, 220, 220)",
        strong: "black",
        medium: "rgb(100,100,100)",
        contrast: "rgb(200,200,200)",
        primary_contrast: "rgb(177, 86, 196)"
    },
    light: {
        background: "rgb(245,245,245)",
        foreground: "rgb(20,20,20)",
        strong: "white",
        medium: "rgb(200,200,200)",
        contrast: "rgb(120,120,120)",
        primary_contrast: "rgb(99, 0, 119)"
    },
    same: {
        //primary: "rgb(255, 170, 0)"
        primary: "rgb(143, 65, 158)"
    }
}

const ThemeProvider = ({children}) =>{
    const [state, setState] = useState({...theme.dark, ...theme.same});
    const toggleTheme = ()=>{
        console.log({state })
        console.log({state:  {...theme.dark, ...theme.same}})
        if(JSON.stringify(state)== JSON.stringify({...theme.dark, ...theme.same})) {
            console.log("hello")
            return setState({...theme.light, ...theme.same})
        }
        setState({...theme.dark, ...theme.same})
    }
    return (
        <ThemeContext.Provider value={{...state, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}
const useTheme = () =>{
    return useContext(ThemeContext);
}
export {
    ThemeProvider,
    useTheme
}