import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { crossing, protectedCrossing } from "../utils";
import * as SecureStore from 'expo-secure-store';

const ThemeContext = createContext(null);
const ThemeDispatchContext = createContext(null);
const theme = {
    dark: {
        background: "rgb(15, 15,40)",
        foreground: "rgb(220, 220, 220)",
        strong: "rgb(10,10,25)",
        medium: "rgba(100,100,120, 0.5)",
        light: "rgba(120,120,120, 0.75)",
        contrast: "rgb(200,200,200)",
        primary_contrast: "rgb(255, 177, 0)",
        transparent: {
            primary: "rgba(255, 200, 100, 0.1)",
            light: "rgba(255, 255, 255, 0.1)",
            medium: "rgba(255, 255, 255, 0.5)",
            strong: "rgba(255, 255, 255, 0.75",
        },
    },
    light: {
        background: "rgb(240,240,240)",
        foreground: "rgb(20,20,20)",
        strong: "white",
        medium: "rgb(200,200,200)",
        contrast: "rgb(120,120,120)",
        primary_contrast: "rgb(255, 177, 0)",
        transparent: {
            primary: "rgba(255, 177, 0, 0.25)",
            light: "rgba(0, 0, 0, 0.1)",
            medium: "rgba(0, 0, 0, 0.5)",
            strong: "rgba(0, 0, 0, 0.75",
        },
    },
    same: {
        //primary: "rgb(255, 170, 0)"
        primary: "rgb(255, 177, 0)",
    },
};

const ThemeProvider = ({children}) =>{
    const [state, setState] = useState({...theme.dark, ...theme.same, isDark: true, isLight: false});
    const toggleTheme = ()=>{
        //console.log({state })
        //console.log({state:  {...theme.dark, ...theme.same}})
        if(state.isDark) {
            console.log("hello")
            return setState({
                ...theme.light,
                ...theme.same,
                isDark: false,
                isLight: true,
            });
        }
        setState({
            ...theme.dark,
            ...theme.same,
            isDark: true,
            isLight: false,
        });
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